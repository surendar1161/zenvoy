import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary:    "#0ea5e9",
    colorLink:       "#0ea5e9",
    colorSuccess:    "#10b981",
    colorWarning:    "#f59e0b",
    colorError:      "#ef4444",
    borderRadius:    10,
    borderRadiusLG:  14,
    fontFamily:      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize:        14,
    colorBgLayout:   "#f8fafc",
    colorBorder:     "#e2e8f0",
  },
  components: {
    Button:  { borderRadius: 8, controlHeight: 38, fontWeight: 600 },
    Card:    { borderRadius: 14 },
    Input:   { borderRadius: 8, controlHeight: 40 },
    Select:  { borderRadius: 8, controlHeight: 40 },
    Menu:    { itemBorderRadius: 10, itemSelectedBg: "#eff6ff", itemSelectedColor: "#0ea5e9" },
    Layout:  { siderBg: "#ffffff", headerBg: "#ffffff", bodyBg: "#f8fafc" },
  },
};
