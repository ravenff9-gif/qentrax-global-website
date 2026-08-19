import { neon } from '@neondatabase/serverless';

const required = ['name', 'company', 'email', 'phone', 'industry', 'service', 'team_size'];

function validInquiry(data) {
  return !required.some((key) => !data[key]?.trim()) && /^\S+@\S+\.\S+$/.test(data.email);
}

function emailText(data) {
  const fields = [
    ['Name', data.name], ['Company', data.company], ['Email', data.email], ['Phone', data.phone],
    ['Website', data.website || 'Not provided'], ['Industry', data.industry],
    ['Service required', data.service], ['Team size', data.team_size],
    ['Monthly spend', data.budget || 'Not provided'], ['Start date', data.start_date || 'Not provided'],
    ['Additional information', data.message || 'Not provided'],
  ];
  return `NEW WEBSITE INQUIRY\n\nCustomer Details\n${fields.slice(0, 6).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nRequirements\n${fields.slice(6).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nSubmitted from website`;
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    if (!validInquiry(data)) return Response.json({ error: 'Please complete all required fields with a valid email.' }, { status: 400 });
    if (!env.DATABASE_URL && (!env.RESEND_API_KEY || !env.LEAD_RECIPIENT)) return Response.json({ error: 'The inquiry service is not configured yet. Please email us directly.' }, { status: 503 });

    if (env.DATABASE_URL) {
      const sql = neon(env.DATABASE_URL);
      await sql`
        INSERT INTO inquiries (full_name, company_name, email, phone, website, business_type, service_needed, support_size, monthly_budget, start_timing, message)
        VALUES (${data.name}, ${data.company}, ${data.email}, ${data.phone}, ${data.website || null}, ${data.industry}, ${data.service}, ${data.team_size}, ${data.budget || null}, ${data.start_date || null}, ${data.message || null})
      `;
    }

    if (env.RESEND_API_KEY && env.LEAD_RECIPIENT) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.SENDER_EMAIL || 'Qentrax Website <onboarding@resend.dev>', to: [env.LEAD_RECIPIENT], reply_to: data.email, subject: `New website inquiry — ${data.company}`, text: emailText(data) }),
      });
      if (!response.ok) console.error('Inquiry saved, but notification email could not be sent.');
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Unable to save inquiry', error);
    return Response.json({ error: 'We could not save your request. Please try again or email us directly.' }, { status: 500 });
  }
}
