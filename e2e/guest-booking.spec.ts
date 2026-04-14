import { expect, test } from '@playwright/test'

test('guest can book an event slot', async ({ page }) => {
  await page.goto('/hosts/demo-user')

  await expect(page.getByRole('heading', { name: 'Иван Иванов' })).toBeVisible()
  await page.getByRole('button', { name: 'Открыть событие 15 минут' }).click()

  const slotButton = page.getByRole('button', { name: /^\d{1,2}:\d{2}$/ }).first()

  await expect(slotButton).toBeVisible()
  await slotButton.click()

  await page.getByLabel('Ваше имя').fill('Playwright Guest')
  await page.getByLabel('Email').fill('playwright-guest@example.com')
  await page.getByRole('button', { name: 'Забронировать' }).click()

  await expect(page.getByTestId('booking-success')).toBeVisible()
  await expect(page.getByText('Playwright Guest (playwright-guest@example.com)')).toBeVisible()
})
