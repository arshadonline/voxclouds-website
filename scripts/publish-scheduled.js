#!/usr/bin/env node
// Cron job: publishes blog posts where scheduled_at <= NOW and status = 'scheduled'
// Run every minute: * * * * * /usr/bin/node /var/www/voxclouds-app/scripts/publish-scheduled.js

const mysql = require('mysql2/promise')

async function main() {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'astppuser',
    password: '1GCm9IqMpAGNWbxFWN3I',
    database: 'astpp',
  })

  const [rows] = await db.query(
    `UPDATE blog_posts SET status = 'published', published_at = NOW()
     WHERE status = 'scheduled' AND scheduled_at <= NOW()`
  )

  if (rows.affectedRows > 0) {
    console.log(`[${new Date().toISOString()}] Published ${rows.affectedRows} scheduled post(s)`)
  }

  await db.end()
}

main().catch(err => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)
  process.exit(1)
})
