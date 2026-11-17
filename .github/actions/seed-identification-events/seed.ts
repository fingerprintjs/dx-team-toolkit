// Creates identification events in a Fingerprint workspace by running the JS agent in a real browser.
// Reads PUBLIC_API_KEY, REGION, COUNT and BROWSER_CHANNEL from the environment.
import { chromium, type BrowserContext } from 'playwright-core'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

declare global {
  interface Window {
    // The seed page stores the started agent here.
    FP?: { get: () => Promise<{ event_id: string }> }
  }
}

const publicApiKey = process.env.PUBLIC_API_KEY
const region = (process.env.REGION || 'us').toLowerCase()
const count = Number(process.env.COUNT || '5')
const channel = process.env.BROWSER_CHANNEL || 'chrome'

if (!publicApiKey) {
  console.error('::error::public-api-key is required')
  process.exit(1)
}
if (!Number.isInteger(count) || count < 1) {
  console.error(`::error::count must be a positive integer, got "${process.env.COUNT}"`)
  process.exit(1)
}

// The agent needs a real (non-opaque) origin, so serve the page at a made-up one.
// The name also marks where these events came from when someone looks at them later.
const origin = 'https://dx-team-toolkit-events.test'
const page = `<script>
  import('https://fpjscdn.net/v4/${publicApiKey}')
    .then((loader) => loader.start(${region === 'us' ? '' : `{ region: '${region}' }`}))
    .then((agent) => { window.FP = agent })
</script>`

async function identify(context: BrowserContext): Promise<string> {
  await context.route(`${origin}/`, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: page }))
  const tab = await context.newPage()
  await tab.goto(`${origin}/`, { waitUntil: 'load' })
  await tab.waitForFunction(() => Boolean(window.FP), null, { timeout: 30_000 })
  const result = await tab.evaluate(() => {
    if (!window.FP) {
      throw new Error('The JS agent did not start')
    }
    return window.FP.get()
  })
  return result.event_id
}

const browser = await chromium.launch({ channel })
const eventIds: string[] = []
try {
  for (let i = 0; i < count; i++) {
    // Alternate regular and persistent-profile contexts so the workspace gets both
    // incognito and non-incognito events.
    if (i % 2 === 0) {
      const context = await browser.newContext()
      try {
        eventIds.push(await identify(context))
      } finally {
        await context.close()
      }
    } else {
      const userDataDir = await mkdtemp(join(tmpdir(), 'seed-profile-'))
      const context = await chromium.launchPersistentContext(userDataDir, { channel })
      try {
        eventIds.push(await identify(context))
      } finally {
        await context.close()
        await rm(userDataDir, { recursive: true, force: true })
      }
    }
  }
} finally {
  await browser.close()
}

console.log(`Created ${eventIds.length} identification events: ${eventIds.join(', ')}`)
