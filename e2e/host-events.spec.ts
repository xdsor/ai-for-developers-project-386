import { expect, test } from '@playwright/test'

test('host can create an event', async ({ page }) => {
  const eventTitle = `Playwright Event ${Date.now()}`
  const eventSlug = `playwright-event-${Date.now()}`

  await page.goto('/host')

  await expect(page.getByRole('heading', { name: 'События' })).toBeVisible()
  await page.getByRole('button', { name: '+ Создать событие' }).click()

  await page.getByLabel('Название').fill(eventTitle)
  await page.getByLabel('Описание').fill('Создано smoke-тестом Playwright.')
  await page.getByLabel('Длительность (минут)').fill('45')
  await page.getByLabel('Slug (публичный идентификатор)').fill(eventSlug)
  await page.getByRole('button', { name: 'Создать', exact: true }).click()

  await expect(page.getByRole('cell', { name: eventTitle, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: eventSlug, exact: true })).toBeVisible()
})
