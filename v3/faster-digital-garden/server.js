import express from 'express'
import getPort, { portNumbers } from 'get-port'
import compression from 'compression'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort,
) {
  const app = express()

  // Enable compression for all responses
  app.use(compression())

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
  }

  // Set headers for PPR and streaming
  app.use((req, res, next) => {
    // Enable streaming
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    next()
  })

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      if (url.includes('.')) {
        console.warn(`${url} is not valid router path`)
        res.status(404)
        res.end(`${url} is not valid router path`)
        return
      }

      // Extract the head from vite's index transformation hook
      let viteHead = !isProd
        ? await vite.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`,
          )
        : ''

      viteHead = viteHead.substring(
        viteHead.indexOf('<head>') + 6,
        viteHead.indexOf('</head>'),
      )

      const entry = await (async () => {
        if (!isProd) {
          return vite.ssrLoadModule('/src/entry-server.tsx')
        } else {
          return import('./dist/server/entry-server.js')
        }
      })()

      console.info('Rendering in server.js: ', url, '...')
      await entry.render({ req, res, url, head: viteHead })
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.error('Render error:', e)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

// Export the app for Railway
export default async function handler(req, res) {
  const { app } = await createServer(
    process.cwd(),
    process.env.NODE_ENV === 'production'
  )
  
  // Forward the request/response handling to the Express app
  return app(req, res)
}

if (!isTest) {
  createServer().then(async ({ app }) =>
    app.listen(process.env.PORT || await getPort({ port: portNumbers(3000, 3100) }), () => {
      console.info(`Server running on port ${process.env.PORT || 3000}`)
    }),
  )
}
