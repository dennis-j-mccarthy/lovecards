export default function SampleEmailPage() {

  const honoredName = "Sarah Mitchell"
  const purchaserName = "Demo User"
  const toName = "Friend"
  const tributeUrl = "#"

  const emailHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2d2d2d; background: #faf9f7;">
      <div style="text-align: center; margin-bottom: 40px;">
        <p style="font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin: 0;">In Loving Memory</p>
        <h1 style="font-size: 32px; font-weight: normal; margin: 8px 0; color: #1a1a1a;">${honoredName}</h1>
      </div>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
        Dear ${toName},
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
    </div>
  `

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="border-b border-[#d4c5a9] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[3px] uppercase text-[#8b7355]">
              Sample Email Preview
            </p>
            <p className="text-sm text-[#999] mt-0.5">
              This is what contributors receive when invited
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-[#8b7355] hover:text-[#1a1a1a] transition-colors"
          >
            &larr; Back
          </a>
        </div>
      </div>

      {/* Email preview */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Email metadata */}
        <div className="border border-[#d4c5a9] bg-white p-4 mb-0 border-b-0">
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-[#8b7355] w-16 flex-shrink-0">From:</span>
              <span className="text-[#666]">Love Cards &lt;hello@lovecards.dev&gt;</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#8b7355] w-16 flex-shrink-0">To:</span>
              <span className="text-[#666]">{toName} &lt;friend@example.com&gt;</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#8b7355] w-16 flex-shrink-0">Subject:</span>
              <span className="text-[#1a1a1a] font-medium">
                You&apos;re invited to share your memories of {honoredName}
              </span>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div
          className="border border-[#d4c5a9] bg-white shadow-lg"
          dangerouslySetInnerHTML={{ __html: emailHtml }}
        />
      </div>
    </div>
  )
}
