"use client";

import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit({ password }: { password: string }) {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>Z</span>
            </div>
            <Text strong style={{ fontSize: 22, color: "#0ea5e9" }}>DealPilot</Text>
          </Link>
          <Title level={3} style={{ margin: "0 0 8px", fontWeight: 800 }}>Set new password</Title>
          <Text type="secondary">Choose a strong password for your account.</Text>
        </div>

        <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} styles={{ body: { padding: 32 } }}>
          {error && <Alert type="error" message={error} style={{ marginBottom: 20, borderRadius: 10 }} />}
          <Form layout="vertical" size="large" onFinish={handleSubmit}>
            <Form.Item name="password" label={<Text strong style={{ fontSize: 13 }}>New Password</Text>}
              rules={[{ required: true }, { min: 8, message: "Minimum 8 characters" }]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="New password" style={{ borderRadius: 10, height: 44 }} />
            </Form.Item>
            <Form.Item name="confirm" label={<Text strong style={{ fontSize: 13 }}>Confirm Password</Text>}
              dependencies={["password"]}
              rules={[{ required: true }, ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject("Passwords do not match");
                },
              })]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="Confirm password" style={{ borderRadius: 10, height: 44 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large"
              style={{ borderRadius: 10, height: 48, fontWeight: 700 }}>
              Update Password
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
