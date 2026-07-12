import { defineConfig } from '@playwright/test';
import { DETAILED_VIEWPORTS } from './tests/detailed-target';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/detailed-audit.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: [['list']],
  outputDir: 'audit-output/detailed-test-results',
  globalSetup: require.resolve('./tests/detailed-global-setup.ts'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: Object.entries(DETAILED_VIEWPORTS).map(([name, vp]) => ({
    name,
    use: {
      viewport: { width: vp.width, height: vp.height },
      ...(name.startsWith('mobile') ? { hasTouch: true, isMobile: true } : {}),
      ...(name.startsWith('tablet') ? { hasTouch: true } : {}),
    },
  })),
});
