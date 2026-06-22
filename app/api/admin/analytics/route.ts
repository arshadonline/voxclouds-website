import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Funnel stats
  const [[funnel]] = await db.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) AS total_signups,
      SUM(IF(trial_credited_at IS NOT NULL, 1, 0)) AS trial_given,
      SUM(IF(trial_credited_at IS NOT NULL AND trial_expired = 1, 1, 0)) AS trial_expired,
      SUM(IF(id IN (SELECT DISTINCT accountid FROM cdrs WHERE billseconds > 0), 1, 0)) AS made_calls,
      SUM(IF(id IN (SELECT DISTINCT accountid FROM payment_transaction WHERE payment_method != 'trial_credit' AND amount > 0), 1, 0)) AS paying_customers,
      SUM(IF(balance > 0, 1, 0)) AS with_balance,
      SUM(IFNULL(trial_balance, 0)) AS total_trial_balance_outstanding,
      SUM(IF(trial_credited_at IS NOT NULL, 0.50, 0)) AS total_trial_given
    FROM accounts WHERE type = 0 AND deleted = 0
  `)

  // Email stats
  const [[emailStats]] = await db.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) AS total_sent,
      SUM(IF(opened_at IS NOT NULL, 1, 0)) AS total_opened,
      SUM(IF(opened_at IS NULL, 1, 0)) AS total_ignored
    FROM email_log
  `)

  // Email stats by template
  const [emailByTemplate] = await db.query<RowDataPacket[]>(`
    SELECT template,
      COUNT(*) AS sent,
      SUM(IF(opened_at IS NOT NULL, 1, 0)) AS opened
    FROM email_log
    GROUP BY template ORDER BY sent DESC
  `)

  // Signups over last 30 days (by day)
  const [signupTrend] = await db.query<RowDataPacket[]>(`
    SELECT DATE(creation) AS day, COUNT(*) AS count
    FROM accounts WHERE type = 0 AND deleted = 0 AND creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(creation) ORDER BY day
  `)

  // Customer segments for bulk email
  const [segments] = await db.query<RowDataPacket[]>(`
    SELECT
      a.id, a.first_name, a.last_name, a.email, a.balance, a.creation,
      a.country_id, IFNULL(c.country, 'Unknown') AS country_name,
      IFNULL(a.trial_balance, 0) AS trial_balance,
      a.trial_credited_at,
      IFNULL(a.email_opt_out, 0) AS email_opt_out,
      (SELECT COUNT(*) FROM cdrs WHERE accountid = a.id AND billseconds > 0) AS connected_calls,
      (SELECT COUNT(*) FROM payment_transaction WHERE accountid = a.id AND payment_method != 'trial_credit' AND amount > 0) AS paid_count,
      (SELECT COUNT(*) FROM email_log WHERE accountid = a.id) AS emails_sent,
      (SELECT COUNT(*) FROM email_log WHERE accountid = a.id AND opened_at IS NOT NULL) AS emails_opened,
      DATEDIFF(NOW(), a.creation) AS days_since_signup
    FROM accounts a LEFT JOIN countrycode c ON a.country_id = c.id
    WHERE a.type = 0 AND a.deleted = 0 AND a.email IS NOT NULL AND a.email != ''
    ORDER BY a.creation DESC
  `)

  return NextResponse.json({
    funnel,
    emailStats,
    emailByTemplate,
    signupTrend,
    customers: segments,
  })
}
