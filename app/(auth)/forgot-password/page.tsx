"use client";

import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { MailOutlined, ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthCard, AuthHeading } from "@/components/auth/AuthShell";

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
    <AuthShell variant="recover">
      <AuthHeading title="Reset your password" sub="Enter your email and we'll send you a secure reset link." />

      <AuthCard>
        {sent ? (
          <div className="py-2 text-center" role="status">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-[28px] text-brand-600"><SendOutlined /></span>
            <h3 className="mt-5 text-[22px] font-extrabold text-ink">Check your inbox</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">We&rsquo;ve sent a password reset link to your email. It expires in 1 hour.</p>
            <Link href="/sign-in"><Button type="primary" block size="large" className="!mt-6">Back to sign in</Button></Link>
          </div>
        ) : (
          <>
            {error && <Alert type="error" showIcon message={error} className="mb-5" />}
            <Form layout="vertical" size="large" onFinish={handleSubmit} requiredMark={false}>
              <Form.Item name="email" label="Email address" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                <Input prefix={<MailOutlined className="text-ink-300" />} placeholder="you@example.com" autoComplete="email" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">Send reset link</Button>
            </Form>
            <div className="mt-5 text-center">
              <Link href="/sign-in" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-500 hover:text-brand-600">
                <ArrowLeftOutlined className="text-[12px]" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </AuthCard>
    </AuthShell>
  );
}
