import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT || '5173';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const storageState = process.env.PLAYWRIGHT_STORAGE_STATE || '';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...(storageState ? { storageState } : {}),
  },
  webServer: {
    command: `npm run dev -- --host --port ${port}`,
    port: Number(port),
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
