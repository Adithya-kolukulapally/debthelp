import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid', 'landing_page', 'referrer'] as const
type Touch = Partial<Record<typeof attributionFields[number], string>>

function cleanTouch(value: unknown): Touch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const input = value as Record<string, unknown>
  const touch: Touch = {}
  for (const key of attributionFields) {
    if (typeof input[key] === 'string') touch[key] = input[key].replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, key === 'landing_page' || key === 'referrer' ? 512 : 255)
  }
  return touch
}

function cleanAttribution(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { first_touch: {}, last_touch: {} }
  const input = value as Record<string, unknown>
  return { first_touch: cleanTouch(input.first_touch), last_touch: cleanTouch(input.last_touch) }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  try {
    const body = await req.json()
    const required = ['firstName', 'lastName', 'email', 'phone', 'province', 'debtAmount', 'homeowner', 'ageRange', 'priorFiling']
    if (required.some((key) => typeof body[key] !== 'string' || !body[key].trim()) || body.contactConsent !== true ||
        !Array.isArray(body.debtTypes) || body.debtTypes.length === 0 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return json({ error: 'Please complete all required assessment fields.' }, 400)
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const lead = {
      first_name: body.firstName.trim().slice(0, 100), last_name: body.lastName.trim().slice(0, 100),
      email: body.email.trim().slice(0, 254), phone: body.phone.trim().slice(0, 40),
      province: body.province, debt_amount_range: body.debtAmount, homeowner: body.homeowner,
      mortgage_equity: body.equity || null, debt_types: body.debtTypes.slice(0, 20),
      age_range: body.ageRange, prior_filing: body.priorFiling,
      contact_consent_at: new Date().toISOString(),
      attribution: cleanAttribution(body.attribution),
    }
    const { data, error } = await supabase.from('assessments').insert(lead).select('id').single()
    if (error) throw error

    const brevoKey = Deno.env.get('BREVO_API_KEY')
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL')
    const notifyEmails = [
      Deno.env.get('ASSESSMENT_NOTIFICATION_EMAIL') ?? '',
      Deno.env.get('ASSESSMENT_EXTRA_NOTIFICATION_EMAILS') ?? '',
    ].flatMap((value) => value.split(',')).map((email) => email.trim()).filter(Boolean)
    if (brevoKey && senderEmail && notifyEmails.length > 0) {
      const mail = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'api-key': brevoKey, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Debt Advisors Canada', email: senderEmail },
          to: [...new Set(notifyEmails)].map((email) => ({ email })),
          replyTo: { email: lead.email, name: `${lead.first_name} ${lead.last_name}` },
          subject: `New debt assessment — ${lead.first_name} ${lead.last_name}`,
          textContent: [
            `New assessment received (${data.id})`, '', `Name: ${lead.first_name} ${lead.last_name}`,
            `Email: ${lead.email}`, `Phone: ${lead.phone}`, `Province: ${lead.province}`,
            `Debt range: ${lead.debt_amount_range}`, `Homeowner: ${lead.homeowner}`,
            `Equity: ${lead.mortgage_equity ?? 'N/A'}`, `Debt types: ${lead.debt_types.join(', ')}`,
            `Age range: ${lead.age_range}`, `Prior filing: ${lead.prior_filing}`,
            '', 'Attribution (first touch):', ...Object.entries(lead.attribution.first_touch).map(([key, value]) => `${key}: ${value || '(none)'}`),
            'Attribution (last touch):', ...Object.entries(lead.attribution.last_touch).map(([key, value]) => `${key}: ${value || '(none)'}`),
          ].join('\n'),
        }),
      })
      if (!mail.ok) console.error('Brevo notification failed', mail.status, await mail.text())
    } else {
      console.warn('Brevo notification skipped; configure BREVO_API_KEY, BREVO_SENDER_EMAIL and at least one assessment notification email.')
    }
    return json({ success: true, id: data.id })
  } catch (error) {
    console.error('Assessment submission failed', error)
    return json({ error: 'We could not submit your assessment right now. Please try again shortly.' }, 500)
  }
})
