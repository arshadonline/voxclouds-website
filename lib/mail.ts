import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'mail.watnidigital.com',
  port: 587,
  secure: false,
  auth: {
    user: 'support@voxclouds.com',
    pass: 'Malik@5253',
  },
  tls: { rejectUnauthorized: false },
})

export async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: '"VoxClouds Support" <support@voxclouds.com>',
    replyTo: 'support@voxclouds.com',
    to,
    subject,
    html,
    headers: {
      'List-Unsubscribe': '<mailto:support@voxclouds.com?subject=Unsubscribe>',
    },
  })
}

export function welcomeEmail(name: string, accountNumber: string, password: string): { subject: string; html: string } {
  return {
    subject: `Your VoxClouds account ${accountNumber} is ready`,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:600">Hi ${name}, your account is ready</h2>

      <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.6">
        Thank you for signing up with VoxClouds. Your account has been created and you can sign in right away.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:24px 0">
        <tr><td style="padding:20px 24px">
          <table width="100%" style="margin:0">
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:14px;width:130px">Account Number</td>
              <td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">${accountNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:14px">Password</td>
              <td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">${password}</td>
            </tr>
          </table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr><td align="center">
          <a href="https://app.voxclouds.com/login" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
            Sign In
          </a>
        </td></tr>
      </table>

      <h3 style="margin:28px 0 12px;color:#1a1a2e;font-size:16px;font-weight:600">How to get started</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">1.</strong> Sign in at <a href="https://app.voxclouds.com" style="color:#2563eb;text-decoration:none">app.voxclouds.com</a> with the credentials above.
        </td></tr>
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">2.</strong> Add balance to your account using any credit or debit card.
        </td></tr>
        <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;line-height:1.5">
          <strong style="color:#1a1a2e">3.</strong> Start making international calls from your browser.
        </td></tr>
      </table>

      <p style="margin:24px 0 0;color:#4a5568;font-size:14px;line-height:1.6">
        If you have questions, reply to this email or contact <a href="mailto:support@voxclouds.com" style="color:#2563eb;text-decoration:none">support@voxclouds.com</a>.
      </p>
    `)
  }
}

function emailWrapper(body: string): string {
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
            To unsubscribe from notifications, reply with "unsubscribe" or email <a href="mailto:support@voxclouds.com?subject=Unsubscribe" style="color:#b0b8c4;text-decoration:none">support@voxclouds.com</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function passwordResetEmail(name: string, accountNumber: string, newPassword: string): { subject: string; html: string } {
  return {
    subject: `VoxClouds account ${accountNumber} — password updated`,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:600">Your password has been updated</h2>
      <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.6">
        Hi ${name}, the password for your VoxClouds account has been reset. Below are your updated sign-in details.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:24px 0">
        <tr><td style="padding:20px 24px">
          <table width="100%" style="margin:0">
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:14px;width:130px">Account Number</td>
              <td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">${accountNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:14px">New Password</td>
              <td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">${newPassword}</td>
            </tr>
          </table>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr><td align="center">
          <a href="https://app.voxclouds.com/login" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
            Sign In
          </a>
        </td></tr>
      </table>
      <p style="margin:0;color:#4a5568;font-size:14px;line-height:1.6">
        If you did not request this change, please contact us at <a href="mailto:support@voxclouds.com" style="color:#2563eb;text-decoration:none">support@voxclouds.com</a>.
      </p>
    `)
  }
}

export function customerEmail(name: string, subject: string, messageHtml: string): { subject: string; html: string } {
  return {
    subject,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:600">Hi ${name},</h2>
      <div style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.8">${messageHtml}</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr><td align="center">
          <a href="https://app.voxclouds.com/login" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
            Sign In
          </a>
        </td></tr>
      </table>
      <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5">
        If you have questions, reply to this email or contact <a href="mailto:support@voxclouds.com" style="color:#2563eb;text-decoration:none">support@voxclouds.com</a>.
      </p>
    `)
  }
}

export function ticketReplyEmail(customerName: string, ticketId: number, subject: string, message: string): { subject: string; html: string } {
  const safeMsg = message.replace(/\n/g, '<br>')
  return {
    subject: `Re: ${subject} — Ticket #${ticketId}`,
    html: emailWrapper(`
      <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:600">Hi ${customerName},</h2>
      <p style="margin:0 0 8px;color:#64748b;font-size:13px">Ticket #${ticketId} — ${subject}</p>
      <div style="margin:16px 0 24px;padding:16px 20px;background:#f8fafc;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;color:#1a1a2e;font-size:15px;line-height:1.7">
        ${safeMsg}
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr><td align="center">
          <a href="https://app.voxclouds.com/login" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600">
            View in Dashboard
          </a>
        </td></tr>
      </table>
      <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5">
        You can reply directly in your dashboard or reply to this email.
      </p>
    `)
  }
}

export function adminTicketNotification(customerName: string, customerEmail: string, ticketId: number, subject: string, message: string, isReply: boolean): { subject: string; html: string } {
  const safeMsg = message.replace(/\n/g, '<br>')
  return {
    subject: isReply ? `Re: ${subject} — Ticket #${ticketId}` : `New Ticket #${ticketId}: ${subject}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <tr><td style="background:#0a0f1e;padding:24px 32px">
          <h2 style="margin:0;color:#ffffff;font-size:18px">${isReply ? 'Customer Reply' : 'New Support Ticket'} #${ticketId}</h2>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <table width="100%">
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px;width:100px">Customer</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600">${customerName}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Email</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px">${customerEmail}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Subject</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px">${subject}</td></tr>
          </table>
          <div style="margin:20px 0;padding:16px 20px;background:#f8fafc;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;color:#1a1a2e;font-size:14px;line-height:1.7">
            ${safeMsg}
          </div>
          <table width="100%" style="margin-top:20px"><tr><td align="center">
            <a href="https://app.voxclouds.com/admin/tickets/${ticketId}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">Reply in Admin Panel</a>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  }
}

export function adminSignupNotification(name: string, email: string, phone: string, company: string, accountNumber: string): { subject: string; html: string } {
  return {
    subject: `New VoxClouds Signup: ${name}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px">
    <tr><td align="center">
      <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <tr><td style="background:#0a0f1e;padding:24px 32px">
          <h2 style="margin:0;color:#ffffff;font-size:18px">New Customer Signup</h2>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <table width="100%">
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px;width:120px">Name</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-weight:600">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Email</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px">${email}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Phone</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px">${phone}</td></tr>
            ${company ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px">Company</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px">${company}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#64748b;font-size:14px">Account #</td><td style="padding:6px 0;color:#1a1a2e;font-size:14px;font-family:monospace">${accountNumber}</td></tr>
          </table>
          <table width="100%" style="margin-top:20px"><tr><td align="center">
            <a href="https://app.voxclouds.com/admin/customers" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">View in Admin Panel</a>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  }
}
