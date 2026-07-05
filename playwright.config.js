import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5500',
  },
  webServer: {
    command: 'npx serve -p 5500 .',
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
  },
})
