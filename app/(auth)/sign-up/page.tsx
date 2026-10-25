"use client";

import { useState } from "react";
import { Alert, Button, Divider, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined, CheckCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import AuthShell, { AuthCard, AuthHeading } from "@/components/auth/AuthShell";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

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
      trackEvent("signup_email");
      // Seed demo data in background — don't block the UI
      fetch("/api/seed-demo", { method: "POST" }).catch(() => {});
      setSignedUpEmail(email);
      setDone(true);
    }
  }

  async function signInWithGoogle() {
    if (!hasSupabase) { msgApi.warning("Supabase not configured."); return; }
    setGoogleLoading(true);
    trackEvent("signup_google");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <AuthShell variant="signup">
        <AuthCard>
          <div className="py-4 text-center" role="status">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-[34px] text-emerald-500"><CheckCircleFilled /></span>
            <h2 className="mt-5 text-[26px] font-extrabold text-ink">Check your inbox</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              We sent a confirmation link to <b className="text-ink">{signedUpEmail}</b>. Click it to activate your account and generate your first proposal.
            </p>
            <Link href="/sign-in"><Button type="primary" size="large" block className="!mt-7">Go to sign in</Button></Link>
          </div>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell variant="signup">
      {ctx}
      <AuthHeading title="Create your free account" sub="Start closing deals in minutes. No credit card needed." />

      <AuthCard>
        {!hasSupabase && (
          <Alert type="warning" showIcon className="mb-5" message="Demo mode"
            description={<span>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>.</span>} />
        )}

        <Button block size="large" icon={<GoogleOutlined />} loading={googleLoading} onClick={signInWithGoogle}>
          Continue with Google
        </Button>

        <Divider plain className="!my-6 !text-[12px] !text-ink-300">or sign up with email</Divider>

        {error && <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} className="mb-5" />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item name="fullName" label="Full name" rules={[{ required: true, message: "Enter your name" }]}>
            <Input prefix={<UserOutlined className="text-ink-300" />} placeholder="Alex Johnson" autoComplete="name" />
          </Form.Item>

          <Form.Item name="email" label="Email address"
            rules={[{ required: true, message: "Enter your email" }, { type: "email" }]}>
            <Input prefix={<MailOutlined className="text-ink-300" />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" label="Password"
            rules={[{ required: true, message: "Enter a password" }, { min: 8, message: "Minimum 8 characters" }]}>
            <Input.Password prefix={<LockOutlined className="text-ink-300" />} placeholder="Min. 8 characters" autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="confirm" label="Confirm password" dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject("Passwords do not match");
                },
              }),
            ]}>
            <Input.Password prefix={<LockOutlined className="text-ink-300" />} placeholder="Repeat your password" autoComplete="new-password" />
          </Form.Item>

          <p className="mb-4 text-[12.5px] leading-relaxed text-ink-400">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>Create free account</Button>
        </Form>
      </AuthCard>

      <p className="mt-6 text-center text-[14px] text-ink-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
      </p>
    </AuthShell>
  );
}
