#!/usr/bin/env node
// Cron job: expires unused trial credits after 30 days.
// Run daily at midnight: 0 0 * * * /usr/bin/node /var/www/voxclouds-app/scripts/expire-trial-credits.js
//
// Only deducts the remaining trial_balance from the account balance.
// Purchased/recharged credits are never affected.

const mysql = require('mysql2/promise')

async function main() {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'astppuser',
    password: '1GCm9IqMpAGNWbxFWN3I',
    database: 'astpp',
  })

  // Find accounts with trial credit given 30+ days ago, still having trial_balance > 0, not yet expired
  const [rows] = await db.query(`
    SELECT id, first_name, email, trial_balance, balance
    FROM accounts
    WHERE trial_credited_at IS NOT NULL
      AND trial_balance > 0
      AND (trial_expired IS NULL OR trial_expired = 0)
      AND trial_credited_at <= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND type = 0
      AND deleted = 0
  `)

  if (rows.length === 0) {
    console.log(`[${new Date().toISOString()}] No trial credits to expire`)
    await db.end()
    return
  }

  console.log(`[${new Date().toISOString()}] Found ${rows.length} expired trial credit(s)`)

  let expired = 0
  for (const row of rows) {
    // Only deduct what's left of the trial balance, and never go below 0
    const deduct = Math.min(row.trial_balance, row.balance)
    try {
      await db.query(
        'UPDATE accounts SET balance = GREATEST(balance - ?, 0), trial_balance = 0, trial_expired = 1 WHERE id = ?',
        [deduct, row.id]
      )
      expired++
      console.log(`  → Expired $${Number(deduct).toFixed(2)} trial from ${row.first_name} (${row.email || 'no email'}, balance was $${Number(row.balance).toFixed(2)})`)
    } catch (err) {
      console.error(`  ✗ Failed for account ${row.id}: ${err.message}`)
    }
  }

  console.log(`[${new Date().toISOString()}] Done. Expired ${expired}/${rows.length} trial credits`)
  await db.end()
}

main().catch(err => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)
  process.exit(1)
})
