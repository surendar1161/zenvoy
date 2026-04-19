"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert, Button, Card, Divider, Form, Input, Typography, Space, message,
} from "antd";
import {
  MailOutlined, LockOutlined, ThunderboltFilled, GoogleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export default function SignInClientWrapper() {
  return <Suspense><SignInClient /></Suspense>;
}

function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msgApi, ctx] = message.useMessage();

  async function onFinish({ email, password }: { email: string; password: string }) {
    if (!hasSupabase) {
      msgApi.warning("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  }

  async function signInWithGoogle() {
    if (!hasSupabase) { msgApi.warning("Supabase not configured."); return; }
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
    });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)", padding: "24px 16px" }}>
      {ctx}
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ThunderboltFilled style={{ color: "#fff", fontSize: 22 }} />
            </div>
            <Text strong style={{ fontSize: 22, color: "#0ea5e9", letterSpacing: "-0.5px" }}>Zenvoy</Text>
          </Link>
          <Title level={3} style={{ margin: "20px 0 4px", fontWeight: 800 }}>Welcome back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: 32 }}>
          {!hasSupabase && (
            <Alert type="warning" showIcon message="Demo Mode — Supabase not configured"
              description={<>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code></>}
              style={{ marginBottom: 24, borderRadius: 10 }} />
          )}

          {/* OAuth */}
          <Button block size="large" icon={<GoogleOutlined />} loading={googleLoading}
            onClick={signInWithGoogle}
            style={{ borderRadius: 10, height: 46, fontWeight: 600, border: "1.5px solid #e2e8f0", marginBottom: 20 }}>
            Continue with Google
          </Button>

          <Divider style={{ margin: "20px 0" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>or sign in with email</Text>
          </Divider>

          {error && (
            <Alert type="error" message={error} showIcon closable onClose={() => setError(null)}
              style={{ marginBottom: 20, borderRadius: 10 }} />
          )}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
            <Form.Item name="email" label={<Text strong style={{ fontSize: 13 }}>Email address</Text>}
              rules={[{ required: true, message: "Enter your email" }, { type: "email" }]}>
              <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} placeholder="you@example.com"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Form.Item name="password"
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <Text strong style={{ fontSize: 13 }}>Password</Text>
                  <Link href="/forgot-password" style={{ fontSize: 13, color: "#0ea5e9" }}>Forgot password?</Link>
                </div>
              }
              rules={[{ required: true, message: "Enter your password" }]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="••••••••"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 48, borderRadius: 10, fontSize: 15, fontWeight: 700, marginTop: 4 }}>
              Sign In
            </Button>
          </Form>
        </Card>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary">Don&apos;t have an account? </Text>
          <Link href="/sign-up" style={{ color: "#0ea5e9", fontWeight: 600 }}>Create one free</Link>
        </div>
      </div>
    </div>
  );
}
