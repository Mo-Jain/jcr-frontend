import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.jaincarrental.admin',
  appName: 'JCR',
  webDir: 'public',
  server: {
    url: 'https://admin.jaincarrental.in', // Change this to your live URL
    cleartext: true // Allow HTTP for testing
  }
};
export default config;
