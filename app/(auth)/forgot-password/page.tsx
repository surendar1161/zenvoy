"use client";

import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography, Space } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit({ email }: { email: string }) {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/sign-in" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>Z</span>
            </div>
            <Text strong style={{ fontSize: 22, color: "#0ea5e9" }}>Zenvoy</Text>
          </Link>
          <Title level={3} style={{ margin: "0 0 8px", fontWeight: 800 }}>Reset your password</Title>
          <Text type="secondary">Enter your email and we'll send you a reset link.</Text>
        </div>

        <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} styles={{ body: { padding: 32 } }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <Title level={4} style={{ margin: "0 0 8px" }}>Check your inbox</Title>
              <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                We've sent a password reset link to your email. It expires in 1 hour.
              </Text>
              <Link href="/sign-in">
                <Button type="primary" block size="large" style={{ borderRadius: 10 }}>Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              {error && <Alert type="error" message={error} style={{ marginBottom: 20, borderRadius: 10 }} />}
              <Form layout="vertical" size="large" onFinish={handleSubmit}>
                <Form.Item name="email" label={<Text strong style={{ fontSize: 13 }}>Email address</Text>}
                  rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                  <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} placeholder="you@example.com" style={{ borderRadius: 10, height: 44 }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large"
                  style={{ borderRadius: 10, height: 48, fontWeight: 700, marginBottom: 16 }}>
                  Send Reset Link
                </Button>
              </Form>
              <div style={{ textAlign: "center" }}>
                <Link href="/sign-in">
                  <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#64748b" }}>Back to Sign In</Button>
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
