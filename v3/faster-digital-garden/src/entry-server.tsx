import { pipeline } from 'node:stream/promises'
import {
  createRequestHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'
import { createRouter } from './router'
import type express from 'express'
import './fetch-polyfill'
import fs from 'fs'
import path from 'path'

export async function render({
  req,
  res,
  head,
}: {
  head: string
  req: express.Request
  res: express.Response
}) {
  
  // Load the pre-built Tailwind styles
  let styles = ''
  try {
    styles = fs.readFileSync(
      './dist/styles.css',
      'utf-8'
    )
  } catch (error) {
    console.warn('Could not load styles.css:', error)
  }

  // Convert the express request to a fetch request
  const url = new URL(req.originalUrl || req.url, 'https://localhost:3000').href
  const request = new Request(url, {
    method: req.method,
    headers: (() => {
      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers)) {
        headers.set(key, value as any)
      }
      return headers
    })(),
  })

  // Create a request handler
  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter()

      // Update each router instance with the head info from vite
      router.update({
        context: {
          ...router.options.context,
          head: head,
          styles: styles, // Pass the styles to the router context
        },
      })
      return router
    },
  })

  // Let's use the default stream handler to create the response
  const response = await handler(defaultStreamHandler)

  // Convert the fetch response back to an express response
  res.statusMessage = response.statusText
  res.status(response.status)
  response.headers.forEach((value, name) => {
    res.setHeader(name, value)
  })

  // Stream the response body
  return pipeline(response.body as any, res)
}
