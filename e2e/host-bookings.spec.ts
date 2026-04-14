import { expect, test } from '@playwright/test'

test('host can view bookings list', async ({ page, request }) => {
  const runId = Date.now()
  const guestName = `Playwright Host View ${runId}`
  const guestEmail = `playwright-host-view-${runId}@example.com`

  const bookingPageResponse = await request.get('/api/hosts/demo-user/events/15m/booking-page')
  expect(bookingPageResponse.ok()).toBeTruthy()

  const bookingPage = await bookingPageResponse.json()
  const firstSlot = bookingPage.slots[0]

  const createBookingResponse = await request.post('/api/hosts/demo-user/events/15m/bookings', {
    data: {
      guest: {
        name: guestName,
        email: guestEmail,
      },
      startAt: firstSlot.startAt,
    },
  })
  expect(createBookingResponse.ok()).toBeTruthy()

  await page.goto('/host/bookings')

  await expect(page.getByRole('heading', { name: 'Бронирования' })).toBeVisible()

  const bookingRow = page.getByRole('row').filter({ hasText: guestEmail })

  await expect(bookingRow).toHaveCount(1)
  await expect(bookingRow).toContainText(guestName)
  await expect(bookingRow).toContainText(guestEmail)
})
