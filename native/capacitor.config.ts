import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native shells load the production site. They do not bundle or rebuild
 * the Next.js app, so Vercel deploys stay unchanged.
 */
const config: CapacitorConfig = {
  appId: "in.co.dealpilot.app",
  appName: "DealPilot",
  webDir: "www",
  server: {
    url: "https://www.dealpilot.co.in",
    androidScheme: "https",
    allowNavigation: [
      "www.dealpilot.co.in",
      "dealpilot.co.in",
      "*.supabase.co",
      "*.stripe.com",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
      "*.gstatic.com",
    ],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#F5F8FC",
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#F5F8FC",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#0B1220",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#F5F8FC",
    },
  },
};

export default config;
