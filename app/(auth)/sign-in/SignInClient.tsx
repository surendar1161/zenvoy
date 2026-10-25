"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Divider, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthCard, AuthHeading } from "@/components/auth/AuthShell";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export default function SignInClient() {
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
    <AuthShell variant="signin">
      {ctx}
      <AuthHeading title="Welcome back" sub="Sign in to your DealPilot workspace." />

      <AuthCard>
        {!hasSupabase && (
          <Alert type="warning" showIcon className="mb-6" message="Demo mode: Supabase not configured"
            description={<>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code></>} />
        )}

        <Button block size="large" icon={<GoogleOutlined />} loading={googleLoading} onClick={signInWithGoogle}>
          Continue with Google
        </Button>

        <Divider plain className="!my-6 !text-[12px] !text-ink-300">or sign in with email</Divider>

        {error && <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-5" />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item name="email" label="Email address"
            rules={[{ required: true, message: "Enter your email" }, { type: "email" }]}>
            <Input prefix={<MailOutlined className="text-ink-300" />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter your password" }]}
            extra={<div className="mt-2 text-right"><Link href="/forgot-password" className="text-[13px] font-medium text-brand-600 hover:text-brand-700">Forgot password?</Link></div>}>
            <Input.Password prefix={<LockOutlined className="text-ink-300" />} placeholder="Your password" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading} className="!mt-2">
            Sign in
          </Button>
        </Form>
      </AuthCard>

      <p className="mt-6 text-center text-[14px] text-ink-500">
        New to DealPilot?{" "}
        <Link href="/sign-up" className="font-semibold text-brand-600 hover:text-brand-700">Create a free account</Link>
      </p>
    </AuthShell>
  );
}
