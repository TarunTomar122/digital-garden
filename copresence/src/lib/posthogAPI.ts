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

  try {
    const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${personalKey}`,
      },
      body: JSON.stringify(body),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
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
  } catch (e) {
    console.error('PostHog fetch failed:', e)
    return null
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

export async function getUniquePageviews(domains: string | string[]) {
  const domainList = Array.isArray(domains) ? domains : [domains]
  const hosts = domainList.flatMap(domain => [domain, `www.${domain}`])

  const results = await Promise.all(
    ['$pageview', '$autocapture'].map(event =>
      queryPostHog({
        query: {
          kind: 'TrendsQuery',
          series: [{ kind: 'EventsNode', event, name: event, math: 'dau' }],
          dateRange: { date_from: '-30d' },
          interval: 'day',
          filterTestAccounts: false,
          properties: [{ key: '$host', value: hosts, operator: 'exact', type: 'event' }],
        },
      })
    )
  )

  const best = results.find(r => r && r.total > 0) ?? null
  console.error(`[${domainList.join(', ')}] total=${best?.total ?? 0}`)
  return best
}

export async function getAppInstalls() {
  const eventNames = ['application_installed', 'Application Installed', 'app_install', '$screen']

  const results = await Promise.all(
    eventNames.map(eventName =>
      queryPostHog({
        query: {
          kind: 'TrendsQuery',
          series: [{ kind: 'EventsNode', event: eventName, name: eventName, math: 'total' }],
          dateRange: { date_from: '-30d' },
          interval: 'day',
          filterTestAccounts: false,
        },
      })
    )
  )

  const best = results.find(r => r && r.total > 0) ?? null
  console.error(`[app] total=${best?.total ?? 0}`)
  return best
}

