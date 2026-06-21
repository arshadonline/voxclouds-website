#!/usr/bin/env node
// Cron job: sends re-engagement emails to customers who signed up but never topped up.
// Run once daily at 10:00 AM: 0 10 * * * /usr/bin/node /var/www/voxclouds-app/scripts/re-engage-inactive.js
//
// Criteria:
//   - Account type 0 (customer), not deleted, active
//   - Balance = 0 (never topped up)
//   - Signed up 7+ days ago
//   - Has a valid email
//   - Not already emailed (tracked via re_engage_sent_at column)
//
// Gmail anti-spam best practices applied:
//   - One email per customer, never repeated
//   - Professional subject line (no caps, no urgency words)
//   - Proper From/Reply-To headers
//   - List-Unsubscribe header
//   - Throttled: max 20 per run (avoids rate limits and sudden volume spikes)

const mysql = require('mysql2/promise')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'mail.watnidigital.com',
  port: 587,
  secure: false,
  auth: { user: 'support@voxclouds.com', pass: 'Malik@5253' },
  tls: { rejectUnauthorized: false },
})

function emailWrapper(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f7;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <tr><td style="background:#0a0f1e;padding:28px 40px;text-align:center">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px">VoxClouds</h1>
        </td></tr>
        <tr><td style="padding:36px 40px">${body}</td></tr>
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-align:center;line-height:1.5">
            VoxClouds by <a href="https://watnidigital.com" style="color:#94a3b8;text-decoration:none">Watni Digital</a><br>
            Islamabad, Pakistan
          </p>
          <p style="margin:0;color:#b0b8c4;font-size:11px;text-align:center;line-height:1.4">
            You are receiving this because you have an account at <a href="https://app.voxclouds.com" style="color:#b0b8c4;text-decoration:none">app.voxclouds.com</a>.<br>
            To unsubscribe from these emails, reply with "unsubscribe" or email <a href="mailto:support@voxclouds.com?subject=Unsubscribe" style="color:#b0b8c4;text-decoration:none">support@voxclouds.com</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildEmail(name, daysSinceSignup) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'
  const timeframe = daysSinceSignup > 30 ? 'a while' : 'a few days'

  return {
    subject: 'Your VoxClouds account is ready to use',
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:600">${greeting}</h2>

      <p style="margin:0 0 16px;color:#4a5568;font-size:15px;line-height:1.7">
        You created a VoxClouds account ${timeframe} ago. We noticed you haven't made your first call yet, and wanted to make sure everything is working for you.
      </p>

      <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.7">
        If you ran into any issues during setup, or have questions about how the service works, our team is here to help.
      </p>

      <h3 style="margin:24px 0 12px;color:#1a1a2e;font-size:16px;font-weight:600">What you can do with VoxClouds</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">International calls</strong> — Call 150+ countries at wholesale rates from your browser or SIP device.
        </td></tr>
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">Virtual numbers</strong> — Get local numbers in the US, UK, Canada, and more for incoming calls.
        </td></tr>
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">No contracts</strong> — Prepaid billing with no monthly fees. Pay only for what you use.
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr><td align="center">
          <a href="https://app.voxclouds.com/login" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
            Sign In to Your Account
          </a>
        </td></tr>
      </table>

      <p style="margin:0;color:#4a5568;font-size:14px;line-height:1.6">
        If you need help getting started, simply reply to this email. We typically respond within a few hours.
      </p>
    `),
  }
}

async function main() {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'astppuser',
    password: '1GCm9IqMpAGNWbxFWN3I',
    database: 'astpp',
  })

  // Ensure tracking columns exist
  try {
    await db.query(`ALTER TABLE accounts ADD COLUMN re_engage_sent_at DATETIME DEFAULT NULL`)
    console.log(`[${new Date().toISOString()}] Added re_engage_sent_at column`)
  } catch (e) { /* already exists */ }
  try {
    await db.query(`ALTER TABLE accounts ADD COLUMN email_opt_out TINYINT(1) DEFAULT 0`)
    console.log(`[${new Date().toISOString()}] Added email_opt_out column`)
  } catch (e) { /* already exists */ }

  // Find customers who:
  // - type=0, active, not deleted
  // - balance = 0 (never topped up)
  // - created 7+ days ago
  // - have email
  // - haven't been sent this email yet
  const [rows] = await db.query(`
    SELECT id, first_name, email, DATEDIFF(NOW(), creation) as days_since_signup
    FROM accounts
    WHERE type = 0
      AND deleted = 0
      AND status = 0
      AND balance = 0
      AND email IS NOT NULL AND email != ''
      AND re_engage_sent_at IS NULL
      AND (email_opt_out IS NULL OR email_opt_out = 0)
      AND creation <= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY creation ASC
    LIMIT 20
  `)

  if (rows.length === 0) {
    console.log(`[${new Date().toISOString()}] No inactive customers to email`)
    await db.end()
    return
  }

  console.log(`[${new Date().toISOString()}] Found ${rows.length} inactive customer(s) to re-engage`)

  let sent = 0
  for (const row of rows) {
    const { subject, html } = buildEmail(row.first_name, row.days_since_signup)
    try {
      await transporter.sendMail({
        from: '"VoxClouds" <support@voxclouds.com>',
        replyTo: 'support@voxclouds.com',
        to: row.email,
        subject,
        html,
        headers: {
          'List-Unsubscribe': '<mailto:support@voxclouds.com?subject=Unsubscribe>',
          'Precedence': 'bulk',
        },
      })
      // Mark as sent
      await db.query('UPDATE accounts SET re_engage_sent_at = NOW() WHERE id = ?', [row.id])
      sent++
      console.log(`  → Sent to ${row.email} (${row.first_name}, ${row.days_since_signup}d)`)
      // 3-second delay between emails to avoid rate limiting
      await new Promise(r => setTimeout(r, 3000))
    } catch (err) {
      console.error(`  ✗ Failed for ${row.email}: ${err.message}`)
    }
  }

  console.log(`[${new Date().toISOString()}] Done. Sent ${sent}/${rows.length}`)
  await db.end()
}

main().catch(err => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)
  process.exit(1)
})
