"use client";

import { ConfigProvider, Layout, Button, Space } from "antd";
import { ThunderboltFilled } from "@ant-design/icons";
import Link from "next/link";
import { antdTheme } from "@/lib/theme";

const { Header, Content, Footer } = Layout;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 64,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <ThunderboltFilled style={{ color: "#0ea5e9", fontSize: 22 }} />
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0ea5e9", letterSpacing: "-0.3px" }}>Zenvoy</span>
          </Link>
          <Space>
            <Link href="/pricing"><Button type="text" size="middle">Pricing</Button></Link>
            <Link href="/sign-in"><Button size="middle">Sign In</Button></Link>
            <Link href="/sign-up">
              <Button type="primary" size="middle" icon={<ThunderboltFilled />}>Get Started Free</Button>
            </Link>
          </Space>
        </Header>
        <Content>{children}</Content>
        <Footer style={{ textAlign: "center", background: "#fff", borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 13 }}>
          Built with Claude AI · Stripe · Supabase · Ant Design · Vercel
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
