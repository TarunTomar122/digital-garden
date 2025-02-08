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
import { renderToPipeableStream } from 'react-dom/server'

export async function render({
  req,
  res,
  head,
}: {
  head: string
  req: express.Request
  res: express.Response
}) {
  let stylesContent = ''
  
  // In production, read the styles file
  if (process.env.NODE_ENV === 'production') {
    const stylesPath = path.join(process.cwd(), 'dist', 'styles.css')
    if (fs.existsSync(stylesPath)) {
      stylesContent = fs.readFileSync(stylesPath, 'utf-8')
    }
  }

  // Convert the express request to a fetch request
  const url = new URL(req.originalUrl || req.url, `http://${req.headers.host || 'localhost'}`).href
  const request = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as any),
  })

  // Create a request handler with streaming enabled
  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter()
      router.update({
        context: {
          ...router.options.context,
          head,
          styles: stylesContent,
          enablePPR: true,
          enableStreaming: true,
        },
      })
      return router
    },
  })

  try {
    // Get the streaming response
    const response = await handler(defaultStreamHandler)
    
    // Set response headers
    res.statusMessage = response.statusText
    res.status(response.status)
    response.headers.forEach((value: string, name: string) => {
      res.setHeader(name, value)
    })

    // Ensure proper streaming headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache, no-transform')

    // Stream the response
    if (response.body) {
      await pipeline(response.body as any, res)
    } else {
      res.end()
    }
  } catch (error) {
    console.error('Render error:', error instanceof Error ? error.message : String(error))
    res.status(500).end(error instanceof Error ? error.message : 'Internal Server Error')
  }
}
