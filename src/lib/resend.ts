import { Resend } from "resend"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

export async function sendInviteEmail({
  toEmail,
  toName,
  honoredName,
  purchaserName,
  tributeUrl,
}: {
  toEmail: string
  toName?: string
  honoredName: string
  purchaserName: string
  tributeUrl: string
}) {
  const { data, error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: toEmail,
    subject: `You're invited to share your memories of ${honoredName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Share a memory of ${honoredName}</title>
        </head>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2d2d2d; background: #faf9f7;">
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin: 0;">In Loving Memory</p>
            <h1 style="font-size: 32px; font-weight: normal; margin: 8px 0; color: #1a1a1a;">${honoredName}</h1>
          </div>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            ${toName ? `Dear ${toName},` : "Dear friend,"}
          </p>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            ${purchaserName} has invited you to share your memories of <strong>${honoredName}</strong>
            as part of a Love Card Box — a beautiful keepsake that will be printed and preserved.
          </p>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
            You can share a written message, a photo, or both. You may also choose to remain anonymous
            if you prefer. Your contribution will join others in a printed collection of cards.
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${tributeUrl}"
               style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 16px 40px;
                      text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
              Share Your Memories
            </a>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 40px; line-height: 1.6;">
            This link is unique to you. If you have any questions, please contact ${purchaserName} directly.<br />
            <a href="${tributeUrl}" style="color: #888;">${tributeUrl}</a>
          </p>
        </body>
      </html>
    `,
  })

  if (error) throw new Error(`Failed to send email: ${error.message}`)
  return data
}

export async function sendNudgeEmail({
  toEmail,
  toName,
  honoredName,
  purchaserName,
  tributeUrl,
  contributionCount,
}: {
  toEmail: string
  toName?: string
  honoredName: string
  purchaserName: string
  tributeUrl: string
  contributionCount: number
}) {
  const { data, error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: toEmail,
    subject: `Gentle reminder: share your memories of ${honoredName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reminder: Share your memories of ${honoredName}</title>
        </head>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2d2d2d; background: #faf9f7;">
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin: 0;">In Loving Memory</p>
            <h1 style="font-size: 32px; font-weight: normal; margin: 8px 0; color: #1a1a1a;">${honoredName}</h1>
          </div>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            ${toName ? `Dear ${toName},` : "Dear friend,"}
          </p>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            Just a gentle reminder — ${purchaserName} invited you to share your memories of <strong>${honoredName}</strong>,
            and we'd love to include your words in their Love Card Box.
          </p>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
            ${contributionCount > 0 ? `${contributionCount} people have already shared their memories. ` : ""}Your contribution — whether a short message, a photo, or both — will be printed as a beautiful card
            and preserved in a keepsake box. It only takes a few minutes.
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${tributeUrl}"
               style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 16px 40px;
                      text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
              Share Your Memories
            </a>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 40px; line-height: 1.6;">
            This link is unique to you. If you have any questions, please contact ${purchaserName} directly.<br />
            <a href="${tributeUrl}" style="color: #888;">${tributeUrl}</a>
          </p>
        </body>
      </html>
    `,
  })

  if (error) throw new Error(`Failed to send nudge email: ${error.message}`)
  return data
}
