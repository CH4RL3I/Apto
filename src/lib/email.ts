// Tiny email helper. Sends transactional emails via Resend when
// RESEND_API_KEY is set. Falls back to a no-op + console.warn so the
// surrounding flow never fails just because email isn't configured.
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM ?? "Apto <onboarding@resend.dev>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://apto.app";

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export interface InviteEmailInput {
  to: string;
  studentName: string | null;
  companyName: string;
  caseStudyTitle: string;
  message: string;
}

export async function sendInviteEmail(input: InviteEmailInput): Promise<void> {
  const c = getClient();
  if (!c) {
    console.warn("Resend not configured (RESEND_API_KEY missing) — skipping invite email.");
    return;
  }

  const greeting = input.studentName ? `Hi ${input.studentName.split(" ")[0]},` : "Hi,";
  const subject = `${input.companyName} invited you to interview`;

  const html = `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; background:#fafaf7; padding:32px; color:#1f1f1f;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:14px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <tr><td>
        <div style="text-transform:uppercase; font-size:11px; letter-spacing:0.18em; color:#6b8e7c; font-weight:700;">Match made</div>
        <h1 style="font-size:22px; font-weight:700; color:#1f1f1f; margin:8px 0 12px;">${input.companyName} wants to interview you.</h1>
        <p style="font-size:15px; line-height:1.6; color:#4a4a4a; margin:0 0 16px;">${greeting}</p>
        <p style="font-size:15px; line-height:1.6; color:#4a4a4a; margin:0 0 16px;">${escapeHtml(input.message)}</p>
        <p style="font-size:13px; line-height:1.5; color:#777; margin:0 0 24px;">Based on your submission to <strong style="color:#1f1f1f;">${escapeHtml(input.caseStudyTitle)}</strong>.</p>
        <a href="${appUrl}/dashboard#invitations" style="display:inline-block; background:#6b8e7c; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 22px; border-radius:10px; font-size:14px;">View on Apto</a>
        <p style="margin:32px 0 0; font-size:11px; color:#a0a0a0;">You're receiving this because you completed a case study on Apto. Reply or sign in to respond.</p>
      </td></tr>
    </table>
  </body>
</html>`.trim();

  try {
    await c.emails.send({
      from: fromAddress,
      to: input.to,
      subject,
      html,
    });
  } catch (e) {
    console.error("Failed to send invite email:", e);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
