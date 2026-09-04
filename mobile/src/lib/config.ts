import Constants from "expo-constants";

export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appUrl: (process.env.EXPO_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};

export function assertConfig() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile/.env");
  }
}
