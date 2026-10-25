import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0ea5e9",
    colorLink: "#0ea5e9",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 12,
    borderRadiusLG: 16,
    colorText: "#0b1220",
    colorTextSecondary: "#475569",
    colorTextTertiary: "#94a3b8",
    fontFamily:
      "var(--font-body), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f5f8fc",
    colorBorder: "#e4e9f1",
    colorBorderSecondary: "#eef2f7",
    boxShadow: "0 1px 2px rgba(11,18,32,.04), 0 4px 16px rgba(11,18,32,.05)",
    boxShadowSecondary: "0 2px 4px rgba(11,18,32,.04), 0 12px 32px rgba(11,18,32,.10)",
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      fontWeight: 600,
      primaryShadow: "0 6px 18px rgba(2,132,199,.28)",
    },
    Card: {
      borderRadius: 20,
      boxShadow: "0 1px 2px rgba(11,18,32,.04), 0 4px 16px rgba(11,18,32,.05)",
    },
    Input: {
      borderRadius: 12,
      controlHeight: 42,
      controlHeightLG: 46,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 40,
    },
    Tabs: {
      itemActiveColor: "#0ea5e9",
      itemSelectedColor: "#0ea5e9",
      inkBarColor: "#0ea5e9",
    },
    Menu: {
      itemBorderRadius: 12,
      itemHeight: 40,
      itemMarginInline: 0,
      itemMarginBlock: 2,
      itemColor: "#475569",
      itemHoverColor: "#0b1220",
      itemSelectedBg: "#e0f2fe",
      itemSelectedColor: "#0369a1",
      itemHoverBg: "#f1f5f9",
      subMenuItemBg: "transparent",
      activeBarBorderWidth: 0,
      iconSize: 16,
      fontSize: 14,
      groupTitleColor: "#94a3b8",
    },
    Form: {
      labelColor: "#334155",
      labelFontSize: 13,
      verticalLabelPadding: "0 0 6px",
    },
    Layout: {
      siderBg: "#ffffff",
      headerBg: "#ffffff",
      bodyBg: "#f5f8fc",
    },
    Steps: {
      colorPrimary: "#0ea5e9",
    },
  },
};
