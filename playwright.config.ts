import { defineConfig } from '@playwright/test';
const port = Number(process.env.PLAYWRIGHT_PORT) || 5173;
const baseURL = 'http://127.0.0.1:' + port;
export default defineConfig({
  testDir:'./tests',timeout:60000,workers:2,
  use:{baseURL,viewport:{width:1440,height:900},trace:'retain-on-failure'},
  webServer:{command:`npm run dev -- --port ${port} --strictPort`,url:baseURL,reuseExistingServer:true}
});
