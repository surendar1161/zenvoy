import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0ea5e9",
    colorLink: "#0ea5e9",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",
    colorBorder: "#e2e8f0",
    colorBorderSecondary: "#f1f5f9",
    boxShadow:
      "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
    boxShadowSecondary:
      "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 600,
    },
    Card: {
      borderRadius: 14,
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Tabs: {
      itemActiveColor: "#0ea5e9",
      itemSelectedColor: "#0ea5e9",
      inkBarColor: "#0ea5e9",
    },
    Menu: {
      itemBorderRadius: 10,
      itemSelectedBg: "#eff6ff",
      itemSelectedColor: "#0ea5e9",
      itemHoverBg: "#f8fafc",
    },
    Layout: {
      siderBg: "#ffffff",
      headerBg: "#ffffff",
      bodyBg: "#f8fafc",
    },
    Steps: {
      colorPrimary: "#0ea5e9",
    },
  },
};
