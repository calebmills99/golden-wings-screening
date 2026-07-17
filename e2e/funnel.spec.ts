import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://screening.example/embed', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; display: grid; min-height: 100vh; place-items: center; background: #101114; color: #f4f5f2; font-family: Georgia, serif; }
              main { text-align: center; }
              p { color: #e3b341; font-family: Arial, sans-serif; text-transform: uppercase; }
              h1 { margin: 0; font-size: clamp(2rem, 8vw, 5rem); font-weight: 400; }
            </style>
          </head>
          <body><main><p>Private screening</p><h1>Golden Wings</h1></main></body>
        </html>`
    })
  })

  await page.route('**/api/rsvp', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    })
  })

  await page.route('**/api/watch-access', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    })
  })
})

test('home funnel renders, hints at the next section, and converts', async ({
  page
}, testInfo) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Golden Wings' })
  ).toBeVisible()

  const viewport = page.viewportSize()
  const storyTop = await page.locator('#story').evaluate((element) => {
    return element.getBoundingClientRect().top
  })
  expect(viewport).not.toBeNull()
  expect(storyTop).toBeLessThan(viewport?.height || 0)

  const images = page.locator('img')
  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index)
    if ((await image.getAttribute('loading')) === 'lazy') {
      await image.scrollIntoViewIfNeeded()
    }
    await expect
      .poll(() => image.evaluate((element) => element.naturalWidth))
      .toBeGreaterThan(0)
  }

  await page.locator('.preview-frame').scrollIntoViewIfNeeded()
  await expect(
    page
      .frameLocator('.preview-frame iframe')
      .getByRole('button', { name: 'Play Video' })
  ).toBeVisible({ timeout: 15000 })
  await page.locator('.preview-frame').screenshot({
    path: testInfo.outputPath('preview-media.png')
  })
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0 }))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  await page.screenshot({
    path: testInfo.outputPath('home-full.png'),
    fullPage: true
  })

  await page.locator('#offer-name').fill('Robyn Stewart')
  await page.locator('#offer-email').fill('robyn@example.com')
  await page.getByRole('button', { name: 'Send my watch link' }).click()

  await expect(page).toHaveURL(/\/confirmation$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Check your email' })
  ).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  const skipLinkBottom = await page
    .getByRole('link', { name: 'Skip to film' })
    .evaluate((link) => link.getBoundingClientRect().bottom)
  expect(skipLinkBottom).toBeLessThanOrEqual(0)

  await page.screenshot({
    path: testInfo.outputPath('confirmation.png'),
    fullPage: true
  })
})

test('watch gate opens the screening room', async ({ page }, testInfo) => {
  await page.goto('/watch')

  await page.screenshot({
    path: testInfo.outputPath('watch-gate.png'),
    fullPage: true
  })

  await page.locator('#viewer-email').fill('viewer@example.com')
  await page.getByRole('button', { name: 'Open the screening room' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'Golden Wings' })
  ).toBeVisible()
  const screeningFrame = page.getByTitle('Golden Wings documentary')
  await expect(screeningFrame).toBeVisible()
  await expect(
    page
      .frameLocator('iframe[title="Golden Wings documentary"]')
      .getByRole('heading', { name: 'Golden Wings' })
  ).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  const skipLinkBottom = await page
    .getByRole('link', { name: 'Skip to film' })
    .evaluate((link) => link.getBoundingClientRect().bottom)
  expect(skipLinkBottom).toBeLessThanOrEqual(0)

  const screeningFrameBox = await screeningFrame.boundingBox()
  expect(screeningFrameBox?.width).toBeGreaterThan(0)
  expect(
    (screeningFrameBox?.width || 0) / (screeningFrameBox?.height || 1)
  ).toBeCloseTo(16 / 9, 1)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )

  await page.screenshot({
    path: testInfo.outputPath('screening-room.png'),
    fullPage: true
  })
})

test('blank screening source opens the prepared room', async ({
  page
}, testInfo) => {
  await page.goto('http://127.0.0.1:4174/watch')

  await page.locator('#viewer-email').fill('viewer@example.com')
  await page.getByRole('button', { name: 'Open the screening room' }).click()

  const pendingState = page.getByRole('status')
  await expect(pendingState).toContainText(
    'The screening room is being prepared.'
  )
  await expect(page.getByTitle('Golden Wings documentary')).toHaveCount(0)
  await expect
    .poll(() =>
      pendingState
        .locator('img')
        .evaluate((element: HTMLImageElement) => element.naturalWidth)
    )
    .toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
  expect(hasHorizontalOverflow).toBe(false)

  await page.screenshot({
    path: testInfo.outputPath('screening-room-pending.png'),
    fullPage: true
  })
})

test('public routes do not overflow the viewport', async ({ page }) => {
  for (const path of ['/', '/confirmation', '/watch']) {
    await page.goto(path)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    expect(hasHorizontalOverflow, path).toBe(false)
  }
})
