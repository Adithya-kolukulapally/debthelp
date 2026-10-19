const storageKey = 'dacl_attribution_v1'
const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid']

function clean(value) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 255)
}

function readStored() {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(storageKey) || '{}')
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

function currentTouch() {
  const params = new URLSearchParams(window.location.search)
  const values = Object.fromEntries(fields.map((key) => [key, clean(params.get(key))]))
  let referrer = ''
  try {
    if (document.referrer) {
      const url = new URL(document.referrer)
      referrer = clean(`${url.origin}${url.pathname}`).slice(0, 512)
    }
  } catch { /* Ignore malformed referrers. */ }
  return {
    ...values,
    landing_page: clean(`${window.location.origin}${window.location.pathname}`).slice(0, 512),
    referrer,
  }
}

export function getAttribution() {
  if (typeof window === 'undefined') return { first_touch: {}, last_touch: {} }
  const stored = readStored()
  const current = currentTouch()
  const hasCampaignParams = fields.some((key) => current[key])
  const firstTouch = stored.first_touch || current
  const lastTouch = hasCampaignParams ? current : (stored.last_touch || current)
  const attribution = { first_touch: firstTouch, last_touch: lastTouch }
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(attribution)) } catch { /* Storage may be disabled. */ }
  return attribution
}
