import { defineConfig } from '@playwright/test';
import { ROUTE_VIEWPORTS } from './tests/route-target';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/route-regression.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  outputDir: 'audit-output/route-test-results',
  globalSetup: require.resolve('./tests/route-global-setup.ts'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: Object.entries(ROUTE_VIEWPORTS).map(([name, vp]) => ({
    name,
    use: { viewport: { width: vp.width, height: vp.height } },
  })),
});
