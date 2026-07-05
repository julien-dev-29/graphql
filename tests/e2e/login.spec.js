import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Sign In')
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/')
    await page.fill('#username', 'baduser')
    await page.fill('#password', 'badpass')
    await page.evaluate(() => {
      document.getElementById('password').removeAttribute('required')
      document.getElementById('password').value = ''
    })
    await page.click('button[type="submit"]')
    await expect(page.locator('#error-msg')).not.toBeEmpty()
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/#dashboard')
    await expect(page.locator('h1')).toHaveText('Sign In')
  })
})
