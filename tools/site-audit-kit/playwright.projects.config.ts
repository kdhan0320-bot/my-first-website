import { defineConfig } from '@playwright/test';
import { PROJECTS_VIEWPORTS } from './tests/projects-target';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/projects-page.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  outputDir: 'audit-output/projects-test-results',
  globalSetup: require.resolve('./tests/projects-global-setup.ts'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: Object.entries(PROJECTS_VIEWPORTS).map(([name, vp]) => ({
    name,
    use: { viewport: { width: vp.width, height: vp.height } },
  })),
});
