"use client";

import { Suspense, useState } from "react";
import { Button, Card, Space, Typography, Segmented } from "antd";
import {
  ThunderboltOutlined, AppstoreOutlined, RocketOutlined,
} from "@ant-design/icons";
import GenerateClient from "@/components/GenerateClient";
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
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px" }}>
        <Card style={{ borderRadius: 16 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={3}>✅ Proposal Generated!</Title>
            <Text type="secondary">Review, edit, or send to your client</Text>
          </div>
          
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
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 28px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Space direction="vertical" size={8}>
          <RocketOutlined style={{ fontSize: 42, color: "#0ea5e9" }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
            New Proposal
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Create a professional AI-powered proposal in minutes
          </Text>
        </Space>
      </div>

      {/* Mode Selector */}
      <Card
        style={{
          borderRadius: 16,
          border: "2px solid #e2e8f0",
          marginBottom: 28,
          background: "linear-gradient(135deg, #eff6ff 0%, #fff 100%)",
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
        <Card style={{ borderRadius: 16, textAlign: "center", padding: 40 }}>
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
    </div>
  );
}

export default function GeneratePage() {
  return <GeneratePageClient />;
}
