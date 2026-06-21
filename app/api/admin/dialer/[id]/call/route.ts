import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// DELETE /api/admin/dialer/[id]/call — hang up active calls for this campaign
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  try {
    // hupall kills all channels matching the channel variable
    // We set dialer_campaign_id on every originate call
    const { stdout } = await execAsync(
      `fs_cli -x "hupall NORMAL_CLEARING dialer_campaign_id ${id}"`,
      { timeout: 10000 }
    )
    return NextResponse.json({ success: true, output: stdout.trim() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/admin/dialer/[id]/call — dial next number in campaign
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  // Get campaign
  const [[campaign]] = await db.query<RowDataPacket[]>(
    'SELECT * FROM dialer_campaigns WHERE id=?', [id]
  )
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  // Manual dial specific number
  if (body.numberId) {
    const [[num]] = await db.query<RowDataPacket[]>(
      'SELECT * FROM dialer_numbers WHERE id=? AND campaign_id=?', [body.numberId, id]
    )
    if (!num) {
      return NextResponse.json({ error: 'Number not found' }, { status: 404 })
    }
    return await dialNumber(num, campaign)
  }

  // Auto: pick next pending number
  const [[next]] = await db.query<RowDataPacket[]>(
    `SELECT * FROM dialer_numbers WHERE campaign_id=? AND status='pending' ORDER BY id LIMIT 1`, [id]
  )

  if (!next) {
    await db.query("UPDATE dialer_campaigns SET status='completed' WHERE id=?", [id])
    return NextResponse.json({ done: true, message: 'All numbers have been dialed' })
  }

  return await dialNumber(next, campaign)
}

async function dialNumber(num: RowDataPacket, campaign: RowDataPacket) {
  await db.query(
    "UPDATE dialer_numbers SET status='dialing', attempts=attempts+1, called_at=NOW() WHERE id=?",
    [num.id]
  )

  const phone = num.phone_number
  const agent = campaign.agent_extension
  const callerId = campaign.caller_id
  const timeout = campaign.ring_timeout || 30
  const mode = campaign.mode || 'robocall'
  const script = campaign.script || 'english'
  const voice = campaign.voice || 'female'

  // Map script language + voice to Lua file
  const scriptMap: Record<string, string> = {
    'english_female': 'vox_robocall_english_female.lua',
    'english_male': 'vox_robocall_english_male.lua',
    'urdu_male': 'vox_robocall_urdu.lua',
    'urdu_female': 'vox_robocall_urdu_female.lua',
  }
  const luaScript = scriptMap[`${script}_${voice}`] || 'vox_robocall_english_female.lua'

  let originateCmd: string

  if (mode === 'robocall') {
    // Robo-call: originate to prospect, when answered run Lua IVR script
    originateCmd = `originate {origination_caller_id_number=${callerId},origination_caller_id_name=VoxClouds,call_timeout=${timeout},dialer_campaign_id=${campaign.id},dialer_number_id=${num.id},dialer_agent_extension=${agent}}sofia/gateway/idt_instant/${phone} &lua(${luaScript})`
  } else {
    // Agent mode: originate to prospect, bridge to agent
    originateCmd = `originate {origination_caller_id_number=${callerId},origination_caller_id_name=VoxClouds,call_timeout=${timeout},dialer_campaign_id=${campaign.id},dialer_number_id=${num.id}}sofia/gateway/idt_instant/${phone} &bridge(user/${agent}@\${domain_name})`
  }

  try {
    const { stdout, stderr } = await execAsync(
      `fs_cli -x "${originateCmd}"`,
      { timeout: (timeout + 60) * 1000 }  // Extra time for IVR playback
    )

    const output = (stdout + stderr).trim()

    if (output.includes('+OK')) {
      // Call was originated successfully
      // For robocall, check the DTMF response from channel variables
      let dtmfResponse = ''
      if (mode === 'robocall') {
        // Give a moment for the call to complete, then check logs
        // The Lua script sets dialer_response variable
        // We'll parse it from the UUID in the +OK response
        const uuidMatch = output.match(/\+OK\s+([a-f0-9-]+)/)
        if (uuidMatch) {
          // Wait for the call to finish (pitch is ~45s + response time)
          await new Promise(r => setTimeout(r, 3000))
          try {
            const { stdout: varOut } = await execAsync(
              `fs_cli -x "uuid_getvar ${uuidMatch[1]} dialer_response"`,
              { timeout: 5000 }
            )
            dtmfResponse = varOut.trim()
            if (dtmfResponse === '-ERR No Such Channel!') dtmfResponse = ''
          } catch { /* channel ended */ }
        }
      }

      // Wait for call to fully end before updating DB
      // For robocall, the call might still be in progress
      if (mode === 'robocall' && !dtmfResponse) {
        // Poll for up to 90 seconds for the call to end
        const uuidMatch = output.match(/\+OK\s+([a-f0-9-]+)/)
        if (uuidMatch) {
          for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 3000))
            try {
              const { stdout: varOut } = await execAsync(
                `fs_cli -x "uuid_getvar ${uuidMatch[1]} dialer_response"`,
                { timeout: 5000 }
              )
              const val = varOut.trim()
              if (val === '-ERR No Such Channel!') {
                // Call ended, check if response was logged
                break
              }
              if (val && !val.startsWith('-ERR')) {
                dtmfResponse = val
                break
              }
            } catch { break }
          }
        }
      }

      const responseLabel: Record<string, string> = {
        'interested': 'INTERESTED (Press 1)',
        'not_interested': 'NOT INTERESTED (Press 9)',
        'call_later': 'CALL LATER (Press 3)',
        'agent': 'TALK TO AGENT (Press 0)',
        'no_response': 'NO RESPONSE',
      }

      await db.query(
        "UPDATE dialer_numbers SET status='answered', hangup_cause='NORMAL_CLEARING', dtmf_response=? WHERE id=?",
        [dtmfResponse || 'no_response', num.id]
      )
      await db.query(
        "UPDATE dialer_campaigns SET dialed=dialed+1, answered=answered+1 WHERE id=?",
        [campaign.id]
      )
      if (dtmfResponse === 'interested') {
        await db.query(
          "UPDATE dialer_campaigns SET interested=interested+1 WHERE id=?",
          [campaign.id]
        )
      }

      const callUuid = output.match(/\+OK\s+([a-f0-9-]+)/)?.[1] || ''
      return NextResponse.json({
        status: 'answered',
        number: phone,
        uuid: callUuid,
        dtmf: dtmfResponse || 'no_response',
        dtmfLabel: responseLabel[dtmfResponse] || dtmfResponse || 'NO RESPONSE',
      })
    } else {
      const causeMatch = output.match(/Cause:\s*(\w+)/) || output.match(/ERR\s+\[(\w+)\]/)
      const cause = causeMatch ? causeMatch[1] : 'UNKNOWN'

      let status = 'failed'
      if (cause === 'USER_BUSY' || cause === 'CALL_REJECTED') status = 'busy'
      else if (cause === 'NO_ANSWER' || cause === 'ALLOTTED_TIMEOUT' || cause === 'NO_USER_RESPONSE') status = 'no_answer'

      await db.query(
        "UPDATE dialer_numbers SET status=?, hangup_cause=? WHERE id=?",
        [status, cause, num.id]
      )
      await db.query(
        "UPDATE dialer_campaigns SET dialed=dialed+1, failed=failed+1 WHERE id=?",
        [campaign.id]
      )
      return NextResponse.json({ status, number: phone, cause })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await db.query(
      "UPDATE dialer_numbers SET status='failed', hangup_cause=? WHERE id=?",
      [message.substring(0, 100), num.id]
    )
    await db.query(
      "UPDATE dialer_campaigns SET dialed=dialed+1, failed=failed+1 WHERE id=?",
      [campaign.id]
    )
    return NextResponse.json({ status: 'failed', number: phone, error: message }, { status: 500 })
  }
}
