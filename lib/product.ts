export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "SubTrack",
  slug: "subscription-tracker",
  tagline: "See where your subscriptions go",
  description: "List your subscriptions (name + amount + monthly/yearly) and get your total monthly and yearly spend plus the top 3 you could cut. For anyone tired of forgotten charges.",
  toolTitle: "Track your subscriptions",
  resultLabel: "Your summary",
  ctaLabel: "Calculate spend",
  features: [
  "Monthly + yearly total",
  "Top cuts",
  "No login",
  "Copy list"
],
  inputs: [
  {
    "key": "list",
    "label": "Subscriptions (one per line)",
    "type": "textarea",
    "placeholder": "Netflix $15.49 monthly\nSpotify $11.99 monthly\nAdobe $599.88 yearly"
  }
] as InputField[],
  systemPrompt: "You are a personal finance helper. Given a list of subscriptions with amounts and cadence, compute total monthly and yearly spend and rank the top 3 to cut.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "Unlimited"
  },
  {
    "tier": "Pro",
    "price": "$9/mo",
    "desc": "Categories, alerts"
  },
  {
    "tier": "Family",
    "price": "$29/mo",
    "desc": "Shared, export"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const lines = (inputs['list'] || '').split(/\n/).map(s => s.trim()).filter(Boolean)
  let monthly = 0, yearly = 0
  const items = []
  lines.forEach(l => {
    const m = l.match(/\$([0-9]+(\.[0-9]+)?)\s*(monthly|yearly|mo|yr|m|y)?/i)
    if (!m) return
    const amt = parseFloat(m[1])
    const cad = (m[3] || 'monthly').toLowerCase()
    const perMonth = (cad === 'yearly' || cad === 'yr' || cad === 'y') ? amt / 12 : amt
    monthly += perMonth
    yearly += perMonth * 12
    items.push({ name: (l.split('$')[0] || l).trim(), perMonth: perMonth })
  })
  items.sort((a,b) => b.perMonth - a.perMonth)
  const top = items.slice(0, 3).map((it,i)=> (i+1)+'. '+it.name+' ($'+it.perMonth.toFixed(2)+'/mo)').join('\n')
  return 'SUBSCRIPTION SPEND\nTotal monthly: $'+monthly.toFixed(2)+'\nTotal yearly: $'+yearly.toFixed(2)+'\n\nTop 3 to cut:\n'+(top||'none')+'\n\n--- (Mock math. Add OPENAI_API_KEY for renewal reminders.)'
}
}
