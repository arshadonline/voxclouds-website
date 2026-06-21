#!/usr/bin/env node
/**
 * IMAP Email → Ticket Poller
 * Checks support@voxclouds.com and sales@voxclouds.com for new emails,
 * creates support tickets from them, then marks emails as seen.
 *
 * Run via cron every 2 minutes (see bottom of file for cron line)
 */

const imaps = require('imap-simple')
const { simpleParser } = require('mailparser')
const mysql = require('mysql2/promise')

const IMAP_HOST = 'mail.watnidigital.com'
const IMAP_PORT = 993

const MAILBOXES = [
  { user: 'support@voxclouds.com', pass: 'Malik@5253', label: 'support' },
  { user: 'sales@voxclouds.com', pass: 'Malik@5253', label: 'sales' },
]

const DB_CONFIG = {
  host: '127.0.0.1',
  user: 'astppuser',
  password: '1GCm9IqMpAGNWbxFWN3I',
  database: 'astpp',
}

// Emails to ignore (our own outgoing + system)
const IGNORE_FROM = [
  'support@voxclouds.com',
  'sales@voxclouds.com',
  'noreply@voxclouds.com',
  'mailer-daemon',
]

// Spam detection — if subject OR body matches any of these, skip
const SPAM_PATTERNS = [
  /no.?obligation.?audit/i,
  /seo.?(services?|audit|report|proposal|agency)/i,
  /search.?ranking/i,
  /broken.?links/i,
  /missing.?meta/i,
  /website.?not.?performing/i,
  /web.?design.?(services?|agency|proposal)/i,
  /marketing.?consultant/i,
  /send.?the.?proposal/i,
  /link.?building/i,
  /backlinks?/i,
  /domain.?authority/i,
  /google.?ranking/i,
  /first.?page.?of.?google/i,
  /lead.?generation.?(services?|agency)/i,
  /cold.?email/i,
  /bulk.?email/i,
  /email.?marketing.?campaign/i,
  // unsubscribe requests are handled separately — not treated as spam
  /website.?launches?\.(com|net|org)/i,
  /clutch\.co/i,
  /fiverr|upwork/i,
]

function isSpam(subject, body) {
  const text = `${subject} ${body}`
  return SPAM_PATTERNS.some(p => p.test(text))
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

async function pollMailbox(mailbox, db) {
  const config = {
    imap: {
      user: mailbox.user,
      password: mailbox.pass,
      host: IMAP_HOST,
      port: IMAP_PORT,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    },
  }

  let connection
  try {
    connection = await imaps.connect(config)
    await connection.openBox('INBOX')

    // Search for unseen emails
    const searchCriteria = ['UNSEEN']
    const fetchOptions = { bodies: '', markSeen: true }
    const messages = await connection.search(searchCriteria, fetchOptions)

    if (messages.length === 0) {
      return 0
    }

    log(`[${mailbox.label}] Found ${messages.length} new email(s)`)

    let created = 0
    for (const msg of messages) {
      try {
        const raw = msg.parts.find(p => p.which === '')
        if (!raw) continue

        const parsed = await simpleParser(raw.body)
        const fromAddr = parsed.from?.value?.[0]?.address?.toLowerCase() || ''
        const fromName = parsed.from?.value?.[0]?.name || fromAddr
        const subject = parsed.subject || '(No subject)'
        const body = parsed.text || parsed.html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '(Empty message)'

        // Skip our own outgoing emails
        if (IGNORE_FROM.some(ig => fromAddr.includes(ig))) {
          log(`[${mailbox.label}] Skipping own email from ${fromAddr}`)
          continue
        }

        // Unsubscribe detection — mark customer as opted out
        const unsubPattern = /\bunsubscribe\b|opt.?out|remove.?me|stop.?send/i
        if (unsubPattern.test(subject) || (unsubPattern.test(body) && body.length < 200)) {
          const [custRows] = await db.query(
            'SELECT id, first_name, email FROM accounts WHERE email = ? AND type = 0 AND deleted = 0 LIMIT 1',
            [fromAddr]
          )
          if (custRows.length > 0) {
            await db.query('UPDATE accounts SET email_opt_out = 1 WHERE id = ?', [custRows[0].id])
            log(`[${mailbox.label}] UNSUBSCRIBE: ${fromAddr} (account ${custRows[0].id}, ${custRows[0].first_name}) — marked email_opt_out=1`)
          } else {
            log(`[${mailbox.label}] UNSUBSCRIBE request from unknown email: ${fromAddr} — ignored`)
          }
          continue
        }

        // Spam filter
        if (isSpam(subject, body)) {
          log(`[${mailbox.label}] SPAM blocked: "${subject}" from ${fromAddr}`)
          continue
        }

        // Try to match sender to existing customer
        const [customers] = await db.query(
          'SELECT id, first_name, last_name, email FROM accounts WHERE email = ? AND type = 0 AND deleted = 0 LIMIT 1',
          [fromAddr]
        )

        const accountId = customers.length > 0 ? customers[0].id : null
        const senderName = customers.length > 0
          ? `${customers[0].first_name} ${customers[0].last_name}`.trim()
          : fromName

        // Truncate body for the message field
        const msgBody = body.substring(0, 5000)

        // Check for duplicate: same email + subject in last 5 minutes
        const [dupes] = await db.query(
          `SELECT id FROM support_tickets
           WHERE subject = ? AND message LIKE ? AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
           LIMIT 1`,
          [subject, msgBody.substring(0, 100) + '%']
        )
        if (dupes.length > 0) {
          log(`[${mailbox.label}] Skipping duplicate: "${subject}" from ${fromAddr}`)
          continue
        }

        // Check if this is a reply to an existing ticket (subject contains "Ticket #NNN")
        const ticketMatch = subject.match(/Ticket #(\d+)/i)
        if (ticketMatch) {
          const ticketId = parseInt(ticketMatch[1])
          const [existing] = await db.query('SELECT id, accountid FROM support_tickets WHERE id = ?', [ticketId])
          if (existing.length > 0) {
            // Add as reply to existing ticket
            const senderId = accountId || existing[0].accountid
            await db.query(
              'INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
              [ticketId, accountId ? 'customer' : 'customer', senderId, `[Via Email from ${fromAddr}]\n\n${msgBody}`]
            )
            await db.query(
              `UPDATE support_tickets SET last_message_at = NOW(), unread_admin = 1,
               status = IF(status = 'closed', 'open', status) WHERE id = ?`,
              [ticketId]
            )
            log(`[${mailbox.label}] Added reply to ticket #${ticketId} from ${fromAddr}`)
            created++
            continue
          }
        }

        // Create new ticket
        const conn = await db.getConnection()
        try {
          await conn.beginTransaction()

          const ticketSubject = `[${mailbox.label}] ${subject}`

          const [result] = await conn.query(
            `INSERT INTO support_tickets (accountid, sender_email, sender_name, source, subject, message, status, priority, last_message_at, unread_admin, unread_customer)
             VALUES (?, ?, ?, 'email', ?, ?, 'open', 'medium', NOW(), 1, 0)`,
            [accountId || 0, fromAddr, senderName, ticketSubject, msgBody]
          )

          await conn.query(
            'INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
            [result.insertId, 'customer', accountId || 0, msgBody]
          )

          await conn.commit()
          log(`[${mailbox.label}] Created ticket #${result.insertId}: "${subject}" from ${fromAddr}${accountId ? ` (account ${accountId})` : ' (guest)'}`)
          created++
        } catch (e) {
          await conn.rollback()
          throw e
        } finally {
          conn.release()
        }
      } catch (err) {
        log(`[${mailbox.label}] Error processing email: ${err.message}`)
      }
    }

    return created
  } catch (err) {
    log(`[${mailbox.label}] IMAP error: ${err.message}`)
    return 0
  } finally {
    if (connection) {
      try { connection.end() } catch {}
    }
  }
}

async function main() {
  const db = await mysql.createPool({ ...DB_CONFIG, connectionLimit: 3 })

  let total = 0
  for (const mailbox of MAILBOXES) {
    total += await pollMailbox(mailbox, db)
  }

  if (total > 0) {
    log(`Done. Created/updated ${total} ticket(s).`)
  }

  await db.end()
}

main().catch(err => {
  log(`Fatal error: ${err.message}`)
  process.exit(1)
})
