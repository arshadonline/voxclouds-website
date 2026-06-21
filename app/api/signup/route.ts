import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import crypto from 'crypto'
import { sendMail, welcomeEmail, adminSignupNotification } from '@/lib/mail'

const ASTPP_PRIVATE_KEY = '8YSDaBtDHAB3EQkxPAyTz2I5DttzA9uR'
const AES_KEY = crypto.createHash('sha256').update(ASTPP_PRIVATE_KEY).digest().slice(0, 32)

function encodePassword(value: string): string {
  const pad = 16 - (Buffer.byteLength(value) % 16)
  const padded = Buffer.concat([Buffer.from(value), Buffer.alloc(pad, pad)])
  const cipher = crypto.createCipheriv('aes-256-ecb', AES_KEY, null)
  cipher.setAutoPadding(false)
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final()])
  return encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '$').replace(/=+$/, '')
}

function generateAccountNumber(): string {
  // 10-digit random number
  return String(Math.floor(1000000000 + Math.random() * 9000000000))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, company, password, countryCode } = body

    // Validation
    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if email already exists
    const [existingEmail] = await db.query<RowDataPacket[]>(
      'SELECT id FROM accounts WHERE email=? AND deleted=0', [email.trim()]
    )
    if ((existingEmail as RowDataPacket[]).length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Generate unique account number
    let accountNumber = ''
    for (let i = 0; i < 10; i++) {
      accountNumber = generateAccountNumber()
      const [existing] = await db.query<RowDataPacket[]>(
        'SELECT id FROM accounts WHERE number=? AND deleted=0', [accountNumber]
      )
      if ((existing as RowDataPacket[]).length === 0) break
    }

    const encodedPassword = encodePassword(password)

    // Get country dial code to store full phone number
    let fullPhone = (phone || '').trim()
    if (countryCode) {
      const [countryRows] = await db.query<RowDataPacket[]>(
        'SELECT countrycode FROM countrycode WHERE id = ?', [countryCode]
      )
      if (countryRows.length > 0) {
        const dialCode = String(countryRows[0].countrycode)
        // Remove leading 0 from local number and prepend +countrycode
        const cleanPhone = fullPhone.replace(/^0+/, '')
        fullPhone = `+${dialCode}${cleanPhone}`
      }
    }

    // Create account
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO accounts (number, first_name, last_name, email, password, telephone_1, company_name,
        balance, credit_limit, type, status, creation, maxchannels, currency_id, pricelist_id, country_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, NOW(), 1, 1, 5, ?)`,
      [accountNumber, firstName.trim(), (lastName || '').trim(), email.trim(), encodedPassword,
       fullPhone, (company || '').trim(), countryCode || 146]
    )

    const accountId = result.insertId

    // Create SIP device with same number as username
    await db.query(
      `INSERT INTO sip_devices (username, accountid, dir_params, dir_vars, status, codec, creation_date)
       VALUES (?, ?, ?, ?, 0, 'ulaw,alaw,g729', NOW())`,
      [
        accountNumber,
        accountId,
        JSON.stringify({ password, 'vm-enabled': 'true' }),
        JSON.stringify({ 'effective_caller_id_name': '', 'effective_caller_id_number': '', 'user_context': 'default' }),
      ]
    )

    // Send welcome email (non-blocking)
    const welcome = welcomeEmail(firstName.trim(), accountNumber, password)
    sendMail(email.trim(), welcome.subject, welcome.html).catch(err => {
      console.error('Welcome email failed:', err)
    })

    // Notify admin (non-blocking)
    const adminNotif = adminSignupNotification(
      `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
      email.trim(), (phone || '').trim(), (company || '').trim(), accountNumber
    )
    sendMail('arshadonline1@gmail.com', adminNotif.subject, adminNotif.html).catch(err => {
      console.error('Admin notification failed:', err)
    })

    return NextResponse.json({
      success: true,
      accountNumber,
      message: 'Account created successfully',
    })
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
