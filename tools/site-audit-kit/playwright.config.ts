import { defineConfig } from '@playwright/test';
import { VIEWPORTS } from './tests/target';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/portfolio-audit.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'audit-output/html-report', open: 'never' }],
  ],
  outputDir: 'audit-output/test-results',
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: Object.entries(VIEWPORTS).map(([name, vp]) => ({
    name,
    use: {
      viewport: { width: vp.width, height: vp.height },
      ...(name === 'mobile' ? { hasTouch: true, isMobile: true } : {}),
      ...(name === 'tablet' ? { hasTouch: true } : {}),
    },
  })),
});
