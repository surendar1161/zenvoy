"use client";

import { Suspense, useState } from "react";
import { Button, Card, Space, Typography, Segmented } from "antd";
import GenerateClient from "@/components/GenerateClient";
import { Page, PageHeader } from "@/components/app/ui";
import dynamic from "next/dynamic";

const ProposalFormSimple = dynamic(() => import("@/components/ProposalFormSimple"), { ssr: false });
const { Title, Text } = Typography;

function GeneratePageClient() {
  const [mode, setMode] = useState<"simple" | "wizard" | "advanced">("simple");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);

  async function handleGenerate(data: any) {
    setLoading(true);
    setProposal("");
    
    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data,
          sections: data.sections || [] // Use defaults
        }),
      });

      if (!res.ok || !res.body) throw new Error("Generation failed");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setProposal(text);
      }

      // Save to Supabase
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: saved } = await supabase
          .from("proposals")
          .insert({
            user_id: user.id,
            client_name: data.clientName,
            client_company: data.clientCompany || null,
            project_type: data.projectType || null,
            project_description: data.projectDescription || null,
            timeline: data.timeline || null,
            tone: data.tone || "professional",
            currency: data.currency,
            total_budget: data.totalBudget,
            deposit_percent: data.depositPercent,
            deposit_amount: data.depositAmount,
            freelancer_name: data.freelancerName || null,
            freelancer_email: data.freelancerEmail || null,
            proposal_text: text,
            status: "draft",
          })
          .select("id")
          .single();

        if (saved) {
          setProposalId(saved.id);
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // If proposal generated, show result
  if (proposal || proposalId) {
    return (
      <Page>
        <PageHeader title="Proposal generated" sub="Review, edit, or send to your client" />
        <Card style={{ borderRadius: 24, border: "1px solid #E4E9F1" }}>
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
              maxHeight: 500,
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: proposal }}
          />

          <Space size={12}>
            <Button onClick={() => { setProposal(""); setProposalId(null); }}>
              ← Start New
            </Button>
            {proposalId && (
              <>
                <Button href={`/editor/proposal/${proposalId}`}>
                  Edit in Document Editor
                </Button>
                <Button type="primary" href={`/proposal/${proposalId}`} target="_blank">
                  Open Full View
                </Button>
              </>
            )}
          </Space>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="New Proposal"
        sub="Create a professional AI-powered proposal in minutes"
      />

      {/* Mode Selector */}
      <Card
        style={{
          borderRadius: 24,
          border: "1px solid #E4E9F1",
          marginBottom: 28,
          background: "#fff",
          boxShadow: "0 1px 2px rgba(11,18,32,.04), 0 4px 16px rgba(11,18,32,.05)",
        }}
        styles={{ body: { padding: 24 } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 14 }}>Choose your path:</Text>
        </div>
        
        <Segmented
          value={mode}
          onChange={(value) => setMode(value as "simple" | "wizard" | "advanced")}
          size="large"
          block
          options={[
            {
              label: (
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Quick Start</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>5 fields, 2-3 min</div>
                </div>
              ),
              value: "simple",
            },
            {
              label: (
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🧙</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Wizard</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Guided steps</div>
                </div>
              ),
              value: "wizard",
            },
            {
              label: (
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⚙️</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Advanced</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>All options</div>
                </div>
              ),
              value: "advanced",
            },
          ]}
        />

        <div style={{ marginTop: 16, padding: "12px 16px", background: "#fff", borderRadius: 10 }}>
          {mode === "simple" && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              ✨ <strong>Recommended for most users.</strong> Get to your proposal in under 3 minutes with just the essentials. You can enhance it after generation.
            </Text>
          )}
          {mode === "wizard" && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              🎯 <strong>Perfect for beginners.</strong> Answer 5 simple questions and we'll build your proposal step-by-step.
            </Text>
          )}
          {mode === "advanced" && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              🔧 <strong>For power users.</strong> Full control over pricing tiers, milestones, sections, and more. Takes 10-15 minutes.
            </Text>
          )}
        </div>
      </Card>

      {/* Render selected mode */}
      {mode === "simple" && (
        <ProposalFormSimple onGenerate={handleGenerate} loading={loading} />
      )}
      
      {mode === "wizard" && (
        <Card style={{ borderRadius: 24, border: "1px solid #E4E9F1", textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧙</div>
          <Title level={4}>Wizard Mode Coming Soon!</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
            The guided wizard is being refined. For now, try Quick Start mode!
          </Text>
          <Button type="primary" onClick={() => setMode("simple")}>
            Use Quick Start Instead
          </Button>
        </Card>
      )}
      
      {mode === "advanced" && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-brand-600 animate-pulse flex items-center gap-3">
                <span className="text-3xl animate-spin inline-block">⚡</span>
                <span className="font-medium text-lg">Loading…</span>
              </div>
            </div>
          }
        >
          <GenerateClient />
        </Suspense>
      )}
    </Page>
  );
}

export default function GeneratePage() {
  return <GeneratePageClient />;
}
