// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRAND_NAME = process.env.BRAND_NAME || "George Adamos";
const BRAND_URL = process.env.BRAND_URL || "https://georgeadamos.com";
const ORDER_TO = process.env.ORDER_TO || "";
const ORDER_FROM = process.env.ORDER_FROM || "orders@georgeadamos.com";

function esc(s: string) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}

function buildHTML(name: string, email: string, description: string) {
  return `<!DOCTYPE html>
<html lang="el">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Νέο Μήνυμα Επικοινωνίας — ${esc(BRAND_NAME)}</title></head>
<body style="margin:0;padding:0;background:#0b0b0b;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0b0b;">
<tr><td align="center" style="padding:24px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:collapse;background:#111;border:1px solid #1b1b1b">

    <tr><td style="padding:20px 24px;border-bottom:1px solid #1b1b1b">
      <div style="color:#fff;font:700 16px/1 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(BRAND_NAME)}</div>
      <div style="color:#9aa0a6;font:12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(BRAND_URL)}</div>
    </td></tr>

    <tr><td style="padding:20px 24px 8px">
      <div style="color:#fff;font:700 20px/1.3 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">Νέο Μήνυμα Επικοινωνίας</div>
    </td></tr>

    <tr><td style="padding:8px 24px 20px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#141414;border:1px solid #1f1f1f">
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #1f1f1f">
            <div style="color:#888;font:11px/1 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Όνομα</div>
            <div style="color:#fff;font:600 14px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(name)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #1f1f1f">
            <div style="color:#888;font:11px/1 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Email</div>
            <div style="color:#fff;font:600 14px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
              <a href="mailto:${esc(email)}" style="color:#9ad;text-decoration:none">${esc(email)}</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px">
            <div style="color:#888;font:11px/1 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Περιγραφή Project</div>
            <div style="color:#ddd;font:14px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;white-space:pre-wrap">${esc(description)}</div>
          </td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:0 24px 20px">
      <div style="color:#666;font:12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
        Απάντησε απευθείας σε αυτό το email για να επικοινωνήσεις με τον αποστολέα.
      </div>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, description } = body as {
      name: string;
      email: string;
      description: string;
    };

    if (!name?.trim() || !email?.trim() || !description?.trim()) {
      return NextResponse.json(
        { ok: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: ORDER_FROM,
      to: ORDER_TO,
      replyTo: email,
      subject: `New Contact — ${name}`,
      text: `New message from ${name} (${email})\n\n${description}`,
      html: buildHTML(name, email, description),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Contact error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Error" },
      { status: 500 }
    );
  }
}
