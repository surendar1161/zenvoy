"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Spin, Result, Button } from "antd";
import { createClient } from "@/lib/supabase/client";
import BrandedProposalView from "@/components/BrandedProposalView";
import type { ProposalData } from "@/components/BrandedProposalView";
import { DEFAULT_BRAND } from "@/lib/brand";

export default function ProposalViewPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expired, setExpired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const startTime = useRef(Date.now());
  const tracked = useRef(false);

  // Load proposal from Supabase (with localStorage fallback)
  useEffect(() => {
    async function load() {
      // Try Supabase first
      const supabase = createClient();
      const { data: row } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (row) {
        // Check expiry
        if (row.expires_at && new Date(row.expires_at) < new Date()) {
          setExpired(true); setLoading(false); return;
        }
        // Check password
        if (row.view_password) {
          setPasswordRequired(true); setLoading(false); return;
        }
        // If no per-proposal scheduling link, fall back to freelancer's profile link
        if (!row.scheduling_link && row.user_id) {
          const { data: profile } = await supabase.from("profiles").select("scheduling_enabled, scheduling_link").eq("id", row.user_id).maybeSingle();
          if (profile?.scheduling_enabled && profile?.scheduling_link) {
            row.scheduling_link = profile.scheduling_link;
          }
        }
        setData(buildFromRow(row));
        setLoading(false);
        return;
      }

      // Fallback to localStorage
      try {
        const raw = localStorage.getItem(`dealpilot_full_${id}`);
        if (!raw) { setError(true); setLoading(false); return; }
        setData(JSON.parse(raw));
      } catch { setError(true); }
      setLoading(false);
    }
    load();
  }, [id]);

  // Track view on mount and track section time on unmount
  useEffect(() => {
    if (!data || tracked.current) return;
    tracked.current = true;
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: id, documentType: "proposal", durationSec: 0 }),
    });

    return () => {
      const sec = Math.round((Date.now() - startTime.current) / 1000);
      navigator.sendBeacon("/api/track-view", JSON.stringify({
        documentId: id, documentType: "proposal", durationSec: sec,
      }));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function checkPassword() {
    const supabase = createClient();
    const { data: row } = await supabase.from("proposals").select("*").eq("id", id).maybeSingle();
    if (row?.view_password === password) {
      setPasswordRequired(false);
      setData(buildFromRow(row));
    } else {
      setPasswordError(true);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (expired) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Result status="warning" title="This proposal has expired"
          subTitle="The sender set an expiry date. Contact them for a new link."
          extra={<Button href="/">DealPilot</Button>} />
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 24 }}>
        <div style={{ maxWidth: 360, width: "100%", background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <h2 style={{ margin: 0, fontWeight: 800 }}>Password Required</h2>
            <p style={{ color: "#64748b", marginTop: 8 }}>This proposal is password protected.</p>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
            onKeyDown={e => e.key === "Enter" && checkPassword()}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${passwordError ? "#ef4444" : "#e2e8f0"}`, marginBottom: 12, fontSize: 15, boxSizing: "border-box" }}
          />
          {passwordError && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>Incorrect password</p>}
          <Button type="primary" block size="large" onClick={checkPassword}
            style={{ borderRadius: 10, height: 48, fontWeight: 700 }}>
            View Proposal
          </Button>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Result status="404" title="Proposal not found"
          subTitle="This link may have expired or the proposal was deleted. Contact the sender for a new link."
          extra={<Button href="/">Go to DealPilot</Button>} />
      </div>
    );
  }

  return <BrandedProposalView data={data} />;
}

function buildFromRow(row: Record<string, unknown>): ProposalData {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    proposalText: (row.proposal_text ?? "") as string,
    freelancerName: (row.freelancer_name ?? "") as string,
    freelancerTitle: (row.freelancer_title ?? "") as string,
    freelancerEmail: (row.freelancer_email ?? "") as string,
    clientName: (row.client_name ?? "") as string,
    clientCompany: (row.client_company ?? "") as string,
    projectType: (row.project_type ?? "") as string,
    currency: (row.currency ?? "USD") as string,
    totalBudget: (row.total_budget ?? 0) as number,
    depositAmount: (row.deposit_amount ?? 0) as number,
    paymentLink: (row.payment_link ?? null) as string | null,
    tiers: (row.tiers ?? []) as [],
    addOns: (row.add_ons ?? []) as [],
    milestones: (row.milestones ?? []) as [],
    brand: (row.brand_snapshot ?? DEFAULT_BRAND) as typeof DEFAULT_BRAND,
    // Extra fields from DB
    expiresAt: row.expires_at as string | undefined,
    alreadySigned: !!(row.signed_at || row.accepted_at),
    signedAt: (row.signed_at ?? row.accepted_at) as string | undefined,
    signerName: (row.signer_name ?? undefined) as string | undefined,
    schedulingLink: (row.scheduling_link ?? null) as string | null,
    showScheduling: row.show_scheduling !== false,
  };
}
