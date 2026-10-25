"use client";

import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthCard, AuthHeading } from "@/components/auth/AuthShell";

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
    <AuthShell variant="recover">
      <AuthHeading title="Set a new password" sub="Choose a strong password for your account." />

      <AuthCard>
        {error && <Alert type="error" showIcon message={error} className="mb-5" />}
        <Form layout="vertical" size="large" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item name="password" label="New password" rules={[{ required: true, message: "Enter a new password" }, { min: 8, message: "Minimum 8 characters" }]}>
            <Input.Password prefix={<LockOutlined className="text-ink-300" />} placeholder="Min. 8 characters" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="confirm" label="Confirm password" dependencies={["password"]}
            rules={[{ required: true, message: "Confirm your password" }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) return Promise.resolve();
                return Promise.reject("Passwords do not match");
              },
            })]}>
            <Input.Password prefix={<LockOutlined className="text-ink-300" />} placeholder="Repeat your password" autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">Update password</Button>
        </Form>
      </AuthCard>
    </AuthShell>
  );
}
