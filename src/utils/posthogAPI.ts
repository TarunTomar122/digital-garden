export interface PostHogTrend {
  data: number[]
  labels: string[]
  total: number
}

function generateMockData(): PostHogTrend {
  const data = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 80 + 10)
  )
  const labels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 29 + i)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  return {
    data,
    labels,
    total: data.reduce((a, b) => a + b, 0),
  }
}

export async function getPageviews(
  domain: string,
  days: number = 30
): Promise<PostHogTrend | null> {
  const personalKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!personalKey || !projectId) return null

  try {
    const res = await fetch(
      `${host}/api/projects/${projectId}/insights/trend/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${personalKey}`,
        },
        body: JSON.stringify({
          events: [
            {
              id: '$pageview',
              name: '$pageview',
              type: 'events',
              order: 0,
            },
          ],
          properties: [
            {
              key: '$host',
              value: [domain],
              operator: 'exact',
              type: 'event',
            },
          ],
          date_from: `-${days}d`,
          interval: 'day',
          insight: 'TRENDS',
        }),
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return null

    const json = await res.json()
    if (!json.result?.[0]) return null

    const result = json.result[0]
    return {
      data: result.data,
      labels: result.labels || result.days || [],
      total: result.count ?? result.data.reduce((a: number, b: number) => a + b, 0),
    }
  } catch {
    return null
  }
}

export async function getStartupMetrics(domain: string) {
  const real = await getPageviews(domain)
  if (real) return real

  const mock = generateMockData()
  return mock
}
