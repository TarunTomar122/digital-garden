import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
// import { Inter } from "next/font/google";
import type { RouterContext } from '../routerContext';
import appCss from '~/styles/app.css?url'

import Navbar from '../components/Navbar/navbar'

// const inter = Inter({ subsets: ["latin"] });

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        title: 'TanStack Router SSR Basic File Based',
      },
      {
        charSet: 'UTF-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: 'https://unpkg.com/@tailwindcss/browser@4',
      },
      {
        type: 'module',
        children: `import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true`,
      },
      {
        type: 'module',
        src: '/@vite/client',
      },
      {
        type: 'module',
        src: '/src/entry-client.tsx',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { styles = '' } = Route.useRouteContext()
  return (
    <html lang="en">
      <head>
        <Meta />
        {styles && (
          <style id="ssr-styles" dangerouslySetInnerHTML={{ __html: styles }} />
        )}
      </head>
      <body>
        <Navbar />
        <Outlet /> {/* Start rendering router matches */}
        <Scripts />
      </body>
    </html>
  );
}
