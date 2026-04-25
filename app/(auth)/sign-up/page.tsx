"use client";

import { useState } from "react";
import {
  Alert, Button, Card, Divider, Form, Input, Typography, Space, Result, message,
} from "antd";
import {
  MailOutlined, LockOutlined, UserOutlined, ThunderboltFilled,
  GoogleOutlined, CheckCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text, Paragraph } = Typography;

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

const BENEFITS = [
  "AI proposals in under 60 seconds",
  "Stripe payment links auto-generated",
  "Web proposal links with cover page",
  "Good / Better / Best pricing tiers",
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [msgApi, ctx] = message.useMessage();

  async function onFinish({ fullName, email, password }: { fullName: string; email: string; password: string }) {
    if (!hasSupabase) {
      msgApi.warning("Supabase not configured. Add credentials to .env.local first.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Seed demo data in background — don't block the UI
      fetch("/api/seed-demo", { method: "POST" }).catch(() => {});
      setSignedUpEmail(email);
      setDone(true);
    }
  }

  async function signInWithGoogle() {
    if (!hasSupabase) { msgApi.warning("Supabase not configured."); return; }
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)", padding: 24 }}>
        <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", maxWidth: 440, width: "100%" }} bodyStyle={{ padding: 40 }}>
          <Result
            icon={<CheckCircleFilled style={{ color: "#10b981", fontSize: 56 }} />}
            title={<Title level={3} style={{ margin: 0, fontWeight: 800 }}>Check your inbox!</Title>}
            subTitle={
              <Paragraph type="secondary" style={{ fontSize: 15, margin: "12px 0 0" }}>
                We sent a confirmation link to <strong>{signedUpEmail}</strong>.
                Click it to activate your account and start generating proposals.
              </Paragraph>
            }
            extra={
              <Link href="/sign-in">
                <Button type="primary" size="large" style={{ borderRadius: 10, fontWeight: 600, height: 46 }}>
                  Go to Sign In
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)", padding: "24px 16px" }}>
      {ctx}
      <div style={{ width: "100%", maxWidth: 860, display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>

        {/* Benefits panel */}
        <div style={{ flex: "0 0 320px", padding: "40px 0" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ThunderboltFilled style={{ color: "#fff", fontSize: 22 }} />
            </div>
            <Text strong style={{ fontSize: 22, color: "#0ea5e9", letterSpacing: "-0.5px" }}>DealPilot</Text>
          </Link>
          <Title level={2} style={{ fontWeight: 900, margin: "0 0 12px", fontSize: 30, lineHeight: 1.2 }}>
            Win more clients with AI proposals
          </Title>
          <Text type="secondary" style={{ fontSize: 15, display: "block", marginBottom: 32 }}>
            Free to start. No credit card required.
          </Text>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {BENEFITS.map(b => (
              <Space key={b} align="start">
                <CheckCircleFilled style={{ color: "#10b981", fontSize: 18, marginTop: 2 }} />
                <Text style={{ fontSize: 15 }}>{b}</Text>
              </Space>
            ))}
          </Space>
        </div>

        {/* Sign-up card */}
        <Card style={{ flex: "0 0 400px", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} bodyStyle={{ padding: 32 }}>
          <Title level={4} style={{ margin: "0 0 24px", fontWeight: 800 }}>Create your free account</Title>

          {!hasSupabase && (
            <Alert type="warning" showIcon message="Demo Mode"
              description={<span>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>.</span>}
              style={{ marginBottom: 20, borderRadius: 10 }} />
          )}

          {/* OAuth */}
          <Button block size="large" icon={<GoogleOutlined />} loading={googleLoading}
            onClick={signInWithGoogle}
            style={{ borderRadius: 10, height: 46, fontWeight: 600, border: "1.5px solid #e2e8f0", marginBottom: 20 }}>
            Continue with Google
          </Button>

          <Divider style={{ margin: "20px 0" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>or sign up with email</Text>
          </Divider>

          {error && (
            <Alert type="error" message={error} showIcon closable onClose={() => setError(null)}
              style={{ marginBottom: 20, borderRadius: 10 }} />
          )}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
            <Form.Item name="fullName" label={<Text strong style={{ fontSize: 13 }}>Full name</Text>}
              rules={[{ required: true, message: "Enter your name" }]}>
              <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="Alex Johnson"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Form.Item name="email" label={<Text strong style={{ fontSize: 13 }}>Email address</Text>}
              rules={[{ required: true, message: "Enter your email" }, { type: "email" }]}>
              <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} placeholder="you@example.com"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Form.Item name="password" label={<Text strong style={{ fontSize: 13 }}>Password</Text>}
              rules={[{ required: true, message: "Enter a password" }, { min: 8, message: "Minimum 8 characters" }]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="Min. 8 characters"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Form.Item name="confirm" label={<Text strong style={{ fontSize: 13 }}>Confirm password</Text>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="••••••••"
                style={{ borderRadius: 10, height: 46 }} />
            </Form.Item>

            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 16 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Text>

            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 48, borderRadius: 10, fontSize: 15, fontWeight: 700 }}>
              Create Free Account
            </Button>
          </Form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Text type="secondary">Already have an account? </Text>
            <Link href="/sign-in" style={{ color: "#0ea5e9", fontWeight: 600 }}>Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
