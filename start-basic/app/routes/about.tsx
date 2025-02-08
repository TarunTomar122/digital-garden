import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  loader: async () => {
    console.log('about loader')
    return {
      message: 'Hello, world!',
    }
  },
  component: AboutComponent,
})

function AboutComponent() {
  return (
    <div className="p-16">
      <h3>About</h3>
    </div>
  )
}
