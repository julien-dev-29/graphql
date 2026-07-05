import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/#dashboard')
    await expect(page.locator('h1')).toHaveText('Sign In')
  })

  test('should show profile page after mock login', async ({ page }) => {
    await page.goto('/#dashboard')
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'fake-jwt-for-testing')
      window.location.hash = '#dashboard'
    })
    await expect(page.locator('h1')).not.toHaveText('Sign In', { timeout: 10000 })
  })

  test('should have logout button on dashboard', async ({ page }) => {
    await page.goto('/#dashboard')
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'fake-jwt')
      window.location.hash = '#dashboard'
    })
    await expect(page.locator('#logout-btn')).toBeVisible()
  })
})
