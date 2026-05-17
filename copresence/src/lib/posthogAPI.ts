export interface PostHogTrend {
  data: number[]
  labels: string[]
  total: number
}

async function queryPostHog(body: Record<string, unknown>): Promise<PostHogTrend | null> {
  const personalKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!personalKey || !projectId) return null

  const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${personalKey}`,
    },
    body: JSON.stringify(body),
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`PostHog error (${res.status}): ${text}`)
    return null
  }

  const json = await res.json()
  const results = (json as any).results as Array<Record<string, unknown>> | undefined
  if (!results?.[0]) return null

  const r = results[0]
  const data = r.data as number[] | undefined
  if (!data) return null

  const days = (r.days as string[]) ?? (r.labels as string[]) ?? []
  const count = (r.count as number) ?? 0

  return {
    data,
    labels: days,
    total: count || data.reduce((a: number, b: number) => a + b, 0),
  }
}

function buildQuery(event: string, hostFilter?: string, math: string = 'dau') {
  const q: any = {
    kind: 'TrendsQuery',
    series: [{ kind: 'EventsNode', event, name: event, math }],
    dateRange: { date_from: '-30d' },
    interval: 'day',
    filterTestAccounts: false,
  }
  if (hostFilter) {
    q.properties = [{ key: '$host', value: [hostFilter], operator: 'exact', type: 'event' }]
  }
  return q
}

export async function getUniquePageviews(domain: string) {
  const www = `www.${domain}`

  for (const hostVal of [www, domain]) {
    for (const event of ['$autocapture', '$pageview']) {
      const r = await queryPostHog({
        query: {
          kind: 'TrendsQuery',
          series: [{ kind: 'EventsNode', event, name: event, math: 'dau' }],
          dateRange: { date_from: '-30d' },
          interval: 'day',
          filterTestAccounts: false,
          properties: [{ key: '$host', value: [hostVal], operator: 'exact', type: 'event' }],
        },
      })
      if (r && r.total > 0) {
        console.error(`[${domain}] ${event} via $host=${hostVal}: total=${r.total}`)
        return r
      }
    }
  }

  console.error(`[${domain}] no data found`)
  return null
}

export async function getAppInstalls() {
  // Try application_installed with a wider date range
  for (const eventName of ['application_installed', 'Application Installed', 'app_install', '$screen']) {
    const r = await queryPostHog({
      query: {
        kind: 'TrendsQuery',
        series: [{ kind: 'EventsNode', event: eventName, name: eventName, math: 'total' }],
        dateRange: { date_from: '-30d' },
        interval: 'day',
        filterTestAccounts: false,
      },
    })
    if (r && r.total > 0) {
      console.error(`[app] found event "${eventName}": total=${r.total}`)
      return r
    }
  }

  return null
}

export async function dumpRecentEvents() {
  const personalKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
  if (!personalKey || !projectId) return

  try {
    // Get ALL event names from the project
    const defRes = await fetch(`${host}/api/projects/${projectId}/event_definitions/?limit=200`, {
      headers: { Authorization: `Bearer ${personalKey}` },
    })
    if (defRes.ok) {
      const defJson = await defRes.json()
      const names = (defJson.results as any[] || []).map((r: any) => r.name)
      console.error('=== ALL EVENT NAMES ===')
      console.error(names.join(', '))
    }

    // Get recent events with a good sample
    const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${personalKey}` },
      body: JSON.stringify({
        query: {
          kind: 'EventsQuery',
          select: ['event', 'person', 'properties.$host', 'properties.$current_url'],
          after: '-7d',
          limit: 200,
        },
      }),
    })
    const json = await res.json()
    const cols = json.columns as string[]
    const rows = json.results as any[][]
    const events = new Set<string>()
    for (const row of rows) events.add(row[0])
    console.error('=== RECENT 200 EVENTS ===')
    console.error('unique events:', [...events].join(', '))
  } catch (e) {
    console.error('dump events failed:', e)
  }
}
