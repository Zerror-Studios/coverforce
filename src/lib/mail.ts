import nodemailer from "nodemailer";
import { env } from "@/config/env";

type MailTransport = ReturnType<typeof nodemailer.createTransport>;

function getMailTransport(): MailTransport | null {
  const { from, pass } = env.mail;
  if (!from || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: from, pass },
  });
}

export function buildReportDownloadEmailHtml({
  firstName,
  reportTitle,
  pdfUrl,
}: {
  firstName: string;
  reportTitle: string;
  pdfUrl: string;
}): string {
  const safeName = firstName.trim() || "there";
  const safeTitle = reportTitle.trim() || "CoverForce report";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your report download</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e1e1e1;">
          <tr>
            <td style="background:#0a143b;padding:28px 24px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.08em;text-transform:uppercase;">CoverForce</p>
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.35;">Your report is ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#333333;">Hi ${safeName},</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#333333;">Thanks for requesting <strong>${safeTitle}</strong>. Use the link below to download the full report.</p>
              <p style="margin:0 0 24px;">
                <a href="${pdfUrl}" style="display:inline-block;background:#413CC0;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:999px;">Download report (PDF)</a>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#666666;word-break:break-all;">
                Or copy this link:<br>
                <a href="${pdfUrl}" style="color:#413CC0;">${pdfUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e1e1e1;">
              <p style="margin:0;font-size:11px;color:#999999;">Sent by CoverForce</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendReportDownloadEmail({
  to,
  firstName,
  reportTitle,
  pdfUrl,
}: {
  to: string;
  firstName: string;
  reportTitle: string;
  pdfUrl: string;
}): Promise<{ sent: boolean; error?: string; messageId?: string }> {
  const transport = getMailTransport();
  const from = env.mail.from;
  const mailConfigured = Boolean(from && env.mail.pass);

  console.log("[Mail] report download config", {
    configured: mailConfigured,
    from: from || "(missing)",
    hasPass: Boolean(env.mail.pass),
  });

  const mailPayload = {
    from,
    to,
    subject: `Your CoverForce report: ${reportTitle.trim() || "Download"}`,
    reportTitle,
    pdfUrl,
    firstName,
  };

  console.log("[Mail] report download payload", mailPayload);

  if (!transport || !from) {
    const error = "Mail transport is not configured";
    console.error("[Mail] report download skipped", { error, mailPayload });
    return { sent: false, error };
  }

  try {
    const info = await transport.sendMail({
      from,
      to: [to],
      subject: mailPayload.subject,
      html: buildReportDownloadEmailHtml({ firstName, reportTitle, pdfUrl }),
    });

    console.log("[Mail] report download response", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Mail] report download send failed", {
      error,
      mailPayload,
      message: error instanceof Error ? error.message : String(error),
    });
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
