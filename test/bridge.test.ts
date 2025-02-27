import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch, fetch, startServer } from '@nuxt/test-utils'
import { expectNoClientErrors } from './utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  server: true
})

describe('pages', () => {
  it('render hello world', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Hello Vue 2!')
    expect(html).toContain('public:{myValue:123}')
    await expectNoClientErrors('/')
  })
  it('uses server Vue build', async () => {
    expect(await $fetch('/')).toContain('Rendered on server: true')
  })
})

describe('navigate', () => {
  it('should redirect to index with navigateTo', async () => {
    const html = await $fetch('/navigate-to/')
    expect(html).toContain('Hello Vue 2!')
    await expectNoClientErrors('/navigate-to/')
  })
})

describe('legacy capi', () => {
  it('should continue to work', async () => {
    const html = await $fetch('/legacy-capi')
    expect(html).toMatch(/([\s\S]*✅){11}/)
    await expectNoClientErrors('/legacy-capi')
  })
})

describe('errors', () => {
  it('should render a JSON error page', async () => {
    const res = await fetch('/error', {
      headers: {
        accept: 'application/json'
      }
    })
    expect(res.status).toBe(500)
    const error = await res.json()
    delete error.stack
    expect(error).toMatchObject({
      description: process.env.NUXT_TEST_DEV ? expect.stringContaining('<pre>') : '',
      message: 'This is a custom error',
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      url: '/error'
    })
  })

  it('should render a HTML error page', async () => {
    const res = await fetch('/error')
    expect(await res.text()).toContain('This is a custom error')
    await expectNoClientErrors('/error')
  })
})

describe('dynamic paths', () => {
  if (process.env.NUXT_TEST_DEV) {
    // TODO:
    it.todo('dynamic paths in dev')
    return
  }
  if (process.env.TEST_WITH_WEBPACK) {
    // TODO:
    it.todo('work with webpack')
    return
  }
  it('should work with no overrides', async () => {
    const html = await $fetch('/assets')
    for (const match of html.matchAll(/(href|src)="(.*?)"/g)) {
      const url = match[2]
      expect(url.startsWith('/_nuxt/') || url === '/public.svg').toBeTruthy()
    }
    await expectNoClientErrors('/assets')
  })

  it('adds relative paths to CSS', async () => {
    const html = await $fetch('/assets')
    const urls = Array.from(html.matchAll(/(href|src)="(.*?)"/g)).map(m => m[2])
    const cssURL = urls.find(u => /_nuxt\/assets.*\.css$/.test(u))
    const css = await $fetch(cssURL)
    const imageUrls = Array.from(css.matchAll(/url\(['"]?([^')]*)['"]?\)/g)).map(m =>
      m[1].replace(/[-.][\w]{8}\./g, '.')
    )
    expect(imageUrls).toMatchInlineSnapshot(`
        [
          "./logo.svg",
          "../public.svg",
        ]
      `)
  })

  it('should allow setting base URL and build assets directory', async () => {
    process.env.NUXT_APP_BUILD_ASSETS_DIR = '/_other/'
    process.env.NUXT_APP_BASE_URL = '/foo/'
    await startServer()

    const html = await $fetch('/foo/assets')
    for (const match of html.matchAll(/(href|src)="(.*?)"/g)) {
      const url = match[2]
      expect(url.startsWith('/foo/_other/') || url === '/foo/public.svg').toBeTruthy()
    }
    await expectNoClientErrors('/foo/assets')
  })

  it('should allow setting CDN URL', async () => {
    process.env.NUXT_APP_BASE_URL = '/foo/'
    process.env.NUXT_APP_CDN_URL = 'https://example.com/'
    process.env.NUXT_APP_BUILD_ASSETS_DIR = '/_cdn/'
    await startServer()

    const html = await $fetch('/foo/assets')
    for (const match of html.matchAll(/(href|src)="(.*?)"/g)) {
      const url = match[2]
      expect(
        url.startsWith('https://example.com/_cdn/') || url === 'https://example.com/public.svg'
      ).toBeTruthy()
    }
    await expectNoClientErrors('/foo/assets')
  })
})
