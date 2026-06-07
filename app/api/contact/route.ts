import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  message?: unknown;
  locale?: unknown;
  source?: unknown;
  website?: unknown;
};

const maxLengths = {
  name: 120,
  company: 160,
  email: 160,
  phone: 80,
  interest: 80,
  message: 4000,
  locale: 8,
  source: 220,
};

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function field(label: string, value: string) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const honeypot = clean(payload.website, 200);
  if (honeypot) {
    return Response.json({ ok: true });
  }

  const name = clean(payload.name, maxLengths.name);
  const company = clean(payload.company, maxLengths.company);
  const email = clean(payload.email, maxLengths.email);
  const phone = clean(payload.phone, maxLengths.phone);
  const interest = clean(payload.interest, maxLengths.interest);
  const message = clean(payload.message, maxLengths.message);
  const locale = clean(payload.locale, maxLengths.locale);
  const source = clean(payload.source, maxLengths.source);

  if (!name || !email || !message || !isEmail(email)) {
    return Response.json({ error: "Missing or invalid required fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return Response.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const subjectCompany = company ? ` (${company})` : "";
  const subject = `Opero demo request from ${name}${subjectCompany}`;
  const text = [
    `Name: ${name}`,
    company ? `Company: ${company}` : "",
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    interest ? `Topic: ${interest}` : "",
    locale ? `Locale: ${locale}` : "",
    source ? `Source: ${source}` : "",
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.55; color: #111827;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">New Opero demo request</h1>
      ${field("Name", name)}
      ${field("Company", company)}
      ${field("Email", email)}
      ${field("Phone", phone)}
      ${field("Topic", interest)}
      ${field("Locale", locale)}
      ${field("Source", source)}
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="white-space: pre-line;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch {
    return Response.json({ error: "Email could not be sent." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
