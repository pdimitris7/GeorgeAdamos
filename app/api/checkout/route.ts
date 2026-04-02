// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ===================== TYPES ===================== */
type CartItem = {
  id: string;
  printId: string;
  title: string;
  slug: string;
  size: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

type Payload = {
  customer: {
    fullName: string;
    email: string;
    phone?: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  items: CartItem[];
  totals?: { subtotal?: number; shipping?: number; total?: number };
};

/* ===================== HELPERS ===================== */
const BRAND_NAME = process.env.BRAND_NAME || "George Adamos Prints";
const BRAND_URL = process.env.BRAND_URL || "https://george-adamos.com";
const BRAND_LOGO = process.env.BRAND_LOGO || ""; // optional logo URL
const ORDER_TO = process.env.ORDER_TO || "";
const ORDER_FROM = process.env.ORDER_FROM || "orders@george-adamos.com";
const ORDER_BCC = process.env.ORDER_BCC || "";

function euro(n: number) {
  const v = Number.isFinite(n) ? Number(n) : 0;
  try {
    return new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: "EUR",
    }).format(v);
  } catch {
    return `€${v.toFixed(2)}`;
  }
}

function esc(s: string) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ]!)
  );
}

function formatDate(d = new Date()) {
  try {
    return d.toLocaleString("el-GR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

function makeOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rnd = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `GA-${y}${m}${day}-${rnd}`;
}

/* ===================== EMAIL TEMPLATES ===================== */

function buildItemsTableHTML(items: CartItem[]) {
  const rows = items
    .map((i) => {
      const thumb = i.imageUrl
        ? `<img src="${esc(
            i.imageUrl
          )}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;object-fit:cover;background:#111;border-radius:4px" />`
        : "";

      return `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #222">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          <tr>
            ${
              thumb
                ? `<td style="width:72px;vertical-align:top">${thumb}</td>`
                : ""
            }
            <td style="vertical-align:top">
              <div style="color:#fff;font:600 14px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
                i.title
              )}</div>
              <div style="color:#bbb;font:12px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">Μέγεθος: ${esc(
                i.size
              )}"</div>
            </td>
            <td align="right" style="white-space:nowrap;color:#ddd;font:600 13px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${euro(
              i.price
            )}</td>
            <td align="right" style="white-space:nowrap;color:#ddd;font:600 13px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">× ${
              i.qty
            }</td>
            <td align="right" style="white-space:nowrap;color:#fff;font:700 13px/1.4 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${euro(
              i.price * i.qty
            )}</td>
          </tr>
        </table>
      </td>
    </tr>`;
    })
    .join("");

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#141414;border:1px solid #1f1f1f">
    <tbody>${rows}</tbody>
  </table>`;
}

function buildTotalsHTML(subtotal: number) {
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#141414;border:1px solid #1f1f1f">
    <tr>
      <td style="padding:12px 16px;color:#fff;font:700 14px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">Σύνολο (χωρίς μεταφορικά)</td>
      <td align="right" style="padding:12px 16px;color:#fff;font:700 16px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${euro(
        subtotal
      )}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:10px 16px;color:#9ad;font:italic 12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;border-top:1px solid #222">
        Τα μεταφορικά δεν συμπεριλαμβάνονται. Θα επικοινωνήσουμε μαζί σας για να επιβεβαιώσουμε τα στοιχεία και το κόστος αποστολής.
      </td>
    </tr>
  </table>`;
}

function buildCustomerBlockHTML(c: Payload["customer"]) {
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#141414;border:1px solid #1f1f1f">
    <tr><td style="padding:16px">
      <div style="color:#bbb;font:12px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;text-transform:uppercase;letter-spacing:.08em">Στοιχεία Πελάτη</div>
      <div style="height:6px"></div>
      <div style="color:#fff;font:600 14px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
        c.fullName
      )}</div>
      <div style="color:#bbb;font:13px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
        c.email
      )}${c.phone ? " • " + esc(c.phone) : ""}</div>
      <div style="height:10px"></div>
      <div style="color:#ccc;font:13px/1.9 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
        ${esc(c.address1)}${c.address2 ? ", " + esc(c.address2) : ""}<br/>
        ${esc(c.postalCode)} ${esc(c.city)}<br/>${esc(c.country)}
      </div>
      ${
        c.notes
          ? `<div style="margin-top:10px;color:#9ad;font:italic 13px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">Σημειώσεις: ${esc(
              c.notes
            )}</div>`
          : ""
      }
    </td></tr>
  </table>`;
}

function buildHTML(
  payload: Required<Payload>,
  opts: { orderId: string; forCustomer: boolean }
) {
  const { customer, items, totals } = payload;
  const subtotal =
    totals.subtotal ?? items.reduce((a, b) => a + b.price * b.qty, 0);

  const headerTitle = opts.forCustomer
    ? "Επιβεβαίωση Παραγγελίας"
    : "Νέα Παραγγελία";
  const intro = opts.forCustomer
    ? `Γεια σου ${esc(
        customer.fullName
      )}, ευχαριστούμε για την παραγγελία σου. Θα επικοινωνήσουμε άμεσα για τα επόμενα βήματα.`
    : `Λάβατε νέα παραγγελία από τον/την ${esc(customer.fullName)}.`;

  return `<!DOCTYPE html>
<html lang="el">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>${esc(headerTitle)} — ${esc(BRAND_NAME)}</title></head>
<body style="margin:0;padding:0;background:#0b0b0b;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0b0b;">
<tr><td align="center" style="padding:24px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;border-collapse:collapse;background:#111;border:1px solid #1b1b1b">
    <tr><td style="padding:20px 24px;border-bottom:1px solid #1b1b1b">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <div style="color:#fff;font:700 18px/1 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
              BRAND_NAME
            )}</div>
            <div style="color:#9aa0a6;font:12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
              BRAND_URL
            )}</div>
          </td>
          ${
            BRAND_LOGO
              ? `<td align="right"><img src="${esc(
                  BRAND_LOGO
                )}" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:contain" alt="" /></td>`
              : ""
          }
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:18px 24px 0">
      <div style="color:#fff;font:700 22px/1.3 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${esc(
        headerTitle
      )}</div>
      <div style="color:#bbb;font:12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
        Αρ. Παραγγελίας: <strong style="color:#fff">${esc(
          opts.orderId
        )}</strong> • Ημ/νία: ${esc(formatDate())}
      </div>
    </td></tr>

    <tr><td style="padding:12px 24px">
      <div style="color:#ddd;font:14px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">${intro}</div>
    </td></tr>

    <tr><td style="padding:10px 24px">${buildCustomerBlockHTML(
      customer
    )}</td></tr>

    <tr><td style="padding:10px 24px">${buildItemsTableHTML(items)}</td></tr>

    <tr><td style="padding:10px 24px">${buildTotalsHTML(subtotal)}</td></tr>

    <tr><td style="padding:18px 24px 24px">
      <div style="color:#888;font:12px/1.8 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
        Για απορίες, απάντησε σε αυτό το email ή επισκέψου το
        <a href="${esc(
          BRAND_URL
        )}" style="color:#9ad;text-decoration:none">${esc(BRAND_URL)}</a>.
      </div>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function buildText(
  payload: Required<Payload>,
  orderId: string,
  forCustomer: boolean
) {
  const { customer, items, totals } = payload;
  const subtotal =
    totals.subtotal ?? items.reduce((a, b) => a + b.price * b.qty, 0);
  const intro = forCustomer
    ? `Γεια σου ${customer.fullName}, ευχαριστούμε για την παραγγελία σου.`
    : `Νέα παραγγελία από ${customer.fullName}.`;

  const lines = items
    .map(
      (i) => `- ${i.title} (${i.size}") x${i.qty} → ${euro(i.price * i.qty)}`
    )
    .join("\n");

  return `${intro}
Αρ. Παραγγελίας: ${orderId}
Ημ/νία: ${formatDate()}

Στοιχεία πελάτη:
  Όνομα: ${customer.fullName}
  Email: ${customer.email}${customer.phone ? `, Τηλ: ${customer.phone}` : ""}
  Διεύθυνση: ${customer.address1}${
    customer.address2 ? `, ${customer.address2}` : ""
  }, ${customer.postalCode} ${customer.city}, ${customer.country}
  ${customer.notes ? `Σημειώσεις: ${customer.notes}` : ""}

Items:
${lines}

Σύνολο (χωρίς μεταφορικά): ${euro(subtotal)}
* Τα μεταφορικά δεν συμπεριλαμβάνονται. Θα επικοινωνήσουμε για να επιβεβαιώσουμε το κόστος αποστολής.

${BRAND_NAME} — ${BRAND_URL}
`;
}

/* ===================== ROUTE ===================== */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    if (!body?.customer?.email || !body?.items?.length) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Server-side calculations (shipping handled separately after contact)
    const subtotal = body.items.reduce((s, i) => s + i.qty * i.price, 0);

    const orderId = makeOrderId();

    // Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fullPayload: Required<Payload> = {
      customer: body.customer,
      items: body.items,
      totals: { subtotal, shipping: 0, total: subtotal },
    };

    // Email to owner
    await resend.emails.send({
      from: ORDER_FROM,
      to: ORDER_TO || body.customer.email,
      ...(ORDER_BCC ? { bcc: ORDER_BCC } : {}),
      replyTo: body.customer.email,
      subject: `🖼️ Νέα Παραγγελία — ${orderId}`,
      text: buildText(fullPayload, orderId, false),
      html: buildHTML(fullPayload, { orderId, forCustomer: false }),
    });

    // Confirmation email to customer
    await resend.emails.send({
      from: ORDER_FROM,
      to: body.customer.email,
      replyTo: ORDER_TO || ORDER_FROM,
      subject: `Η παραγγελία σας — ${BRAND_NAME} (${orderId})`,
      text: buildText(fullPayload, orderId, true),
      html: buildHTML(fullPayload, { orderId, forCustomer: true }),
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (e: any) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Error" },
      { status: 500 }
    );
  }
}
