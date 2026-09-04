"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Space, Typography, Segmented, Empty, List, Avatar, Tag, Spin } from "antd";
import {
  ThunderboltOutlined, SafetyCertificateOutlined, RocketOutlined,
  ArrowLeftOutlined, UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getContractType } from "@/lib/contract-types";
import type { ContractType } from "@/lib/contract-types";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

const ContractFormSimple = dynamic(() => import("@/components/ContractFormSimple"), { ssr: false });
const { Title, Text } = Typography;

const CATEGORY_COLORS: Record<string, string> = {
  Employment: "#0ea5e9",
  Confidentiality: "#7c3aed",
  Services: "#0369a1",
  Commerce: "#10b981",
  Business: "#f59e0b",
  Property: "#ef4444",
  Finance: "#6366f1",
  "Legal Waiver": "#64748b",
};

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: string;
}

function ContractGenerateQuickClient() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const contract = getContractType(type);

  const [mode, setMode] = useState<"quick" | "custom">("quick");
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<{
    id: string;
    text: string;
  } | null>(null);

  // Load clients
  useEffect(() => {
    async function loadClients() {
      const supabase = createClient();
      const { data } = await supabase
        .from("clients")
        .select("id, name, company, email, status")
        .eq("status", "active")
        .order("name")
        .limit(10);

      if (data) {
        setClients(data);
      }
      setLoadingClients(false);
    }
    loadClients();
  }, []);

  if (!contract) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 28px", textAlign: "center" }}>
        <Empty
          description="Contract type not found"
          image={<SafetyCertificateOutlined style={{ fontSize: 64, color: "#cbd5e1" }} />}
        >
          <Link href="/contracts">
            <Button type="primary">Browse Contract Types</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const color = CATEGORY_COLORS[contract.category] ?? "#0ea5e9";

  async function handleQuickGenerate(clientId: string) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    setGenerating(true);
    try {
      // Get user info
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Generate contract with minimal data
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractTypeId: contract.id,
          state: "United States", // Default
          partyA: {
            name: user?.user_metadata?.company || user?.user_metadata?.full_name || "Your Company",
            role: "Company",
            address: "",
          },
          partyB: {
            name: client.name + (client.company ? ` (${client.company})` : ""),
            role: "Client",
            address: "",
          },
          fields: {}, // Use defaults
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
      }

      // Save to database
      const { data: saved } = await supabase
        .from("contracts")
        .insert({
          user_id: user!.id,
          contract_type_id: contract.id,
          contract_type_name: contract.name,
          category: contract.category,
          governing_law: "United States",
          party_a_name: user?.user_metadata?.company || user?.user_metadata?.full_name || "Your Company",
          party_b_name: client.name,
          contract_text: text,
          status: "draft",
        })
        .select("id")
        .single();

      if (saved) {
        setGeneratedContract({ id: saved.id, text });
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setGenerating(false);
    }
  }

  async function handleCustomGenerate(data: any) {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok || !res.body) throw new Error("Generation failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }

      // Save to database
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: saved } = await supabase
        .from("contracts")
        .insert({
          user_id: user!.id,
          contract_type_id: contract.id,
          contract_type_name: contract.name,
          category: contract.category,
          governing_law: data.state,
          governing_country: data.governingCountry,
          governing_state: data.governingState,
          party_a_name: data.partyA.name,
          party_a_role: data.partyA.role,
          party_b_name: data.partyB.name,
          party_b_role: data.partyB.role,
          contract_fields: data.fields,
          contract_text: text,
          status: "draft",
        })
        .select("id")
        .single();

      if (saved) {
        setGeneratedContract({ id: saved.id, text });
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setGenerating(false);
    }
  }

  // If contract generated, show result
  if (generatedContract) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px" }}>
        <Card style={{ borderRadius: 16 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={3}>✅ Contract Generated!</Title>
            <Text type="secondary">Review, edit, or send to your client</Text>
          </div>

          <Space size={12}>
            <Button
              onClick={() => {
                setGeneratedContract(null);
                setMode("quick");
              }}
            >
              ← Start New
            </Button>
            <Button href={`/editor/contract/${generatedContract.id}`}>
              Edit in Document Editor
            </Button>
            <Button type="primary" href={`/contract/${generatedContract.id}`} target="_blank">
              Open Full View
            </Button>
            <Link href="/contracts?tab=my-contracts">
              <Button>My Contracts</Button>
            </Link>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 28px" }}>
      {/* Back Button */}
      <Link href="/contracts">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: 16, padding: "4px 0", color: "#64748b" }}
        >
          All Contracts
        </Button>
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {contract.icon}
          </div>
          <div>
            <Space align="center">
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                {contract.name}
              </Title>
              <Tag style={{ borderRadius: 20, color, border: "none", background: `${color}15` }}>
                {contract.category}
              </Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {contract.description}
            </Text>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <Card
        style={{
          borderRadius: 16,
          border: "2px solid #e2e8f0",
          marginBottom: 28,
          background: "linear-gradient(135deg, #fef3c7 0%, #fff 100%)",
        }}
        styles={{ body: { padding: 24 } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 14 }}>Choose your path:</Text>
        </div>

        <Segmented
          value={mode}
          onChange={(value) => setMode(value as "quick" | "custom")}
          size="large"
          block
          options={[
            {
              label: (
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Quick Contract</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>1-click, existing client</div>
                </div>
              ),
              value: "quick",
            },
            {
              label: (
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⚙️</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Custom</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Full control, 3-5 min</div>
                </div>
              ),
              value: "custom",
            },
          ]}
        />

        <div style={{ marginTop: 16, padding: "12px 16px", background: "#fff", borderRadius: 10 }}>
          {mode === "quick" && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              ⚡ <strong>Fastest way.</strong> Generate a contract with an existing client in seconds using smart defaults.
            </Text>
          )}
          {mode === "custom" && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              ⚙️ <strong>Full customization.</strong> Choose jurisdiction, add specific terms, and configure all details.
            </Text>
          )}
        </div>
      </Card>

      {/* Quick Contract Mode */}
      {mode === "quick" && (
        <Card
          title={
            <Space>
              <RocketOutlined style={{ color }} />
              <span>Quick Contract — Select Client</span>
            </Space>
          }
          style={{ borderRadius: 16 }}
          styles={{ body: { padding: 24 } }}
        >
          {loadingClients ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : clients.length === 0 ? (
            <Empty
              description="No active clients yet"
              image={<UserOutlined style={{ fontSize: 48, color: "#cbd5e1" }} />}
            >
              <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                You need at least one active client to use Quick Contract
              </Text>
              <Space>
                <Link href="/clients">
                  <Button type="primary">Add Client</Button>
                </Link>
                <Button onClick={() => setMode("custom")}>
                  Use Custom Mode
                </Button>
              </Space>
            </Empty>
          ) : (
            <>
              <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                Select a client to generate a {contract.name} with smart defaults:
              </Text>
              <List
                dataSource={clients}
                loading={generating}
                renderItem={(client) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        onClick={() => handleQuickGenerate(client.id)}
                        loading={generating}
                        style={{ background: color, borderColor: color }}
                      >
                        Generate
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: color }}
                          size="large"
                        >
                          {client.name[0]?.toUpperCase()}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{client.name}</Text>
                          {client.company && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              • {client.company}
                            </Text>
                          )}
                        </Space>
                      }
                      description={client.email || "No email"}
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>
      )}

      {/* Custom Mode */}
      {mode === "custom" && (
        <ContractFormSimple
          contractType={contract}
          onGenerate={handleCustomGenerate}
          loading={generating}
        />
      )}
    </div>
  );
}

export default function ContractGenerateQuickPage() {
  return <ContractGenerateQuickClient />;
}
