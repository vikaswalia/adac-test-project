import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://127.0.0.1:3100',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3100/uptime',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
