"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Badge, Button, Card, Col, Empty, Input, Modal, Row, Select, Space,
  Spin, Tag, Tabs, Typography, Tooltip, message, Form, Divider,
} from "antd";
import {
  SearchOutlined, ArrowRightOutlined, SafetyCertificateOutlined,
  DeleteOutlined, EyeOutlined, FileTextOutlined, EditOutlined,
  CheckCircleOutlined, PlusOutlined, ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CONTRACT_TYPES, CONTRACT_CATEGORIES } from "@/lib/contract-types";
import { listContracts, deleteContract, signContract, updateContractStatus } from "@/lib/db";

const { Title, Text } = Typography;

const CATEGORY_COLORS: Record<string, string> = {
  Employment:      "#0ea5e9",
  Confidentiality: "#7c3aed",
  Services:        "#0369a1",
  Commerce:        "#10b981",
  Business:        "#f59e0b",
  Property:        "#ef4444",
  Finance:         "#6366f1",
  "Legal Waiver":  "#64748b",
};

const STATUS_COLORS: Record<string, string> = {
  draft:      "default",
  reviewed:   "blue",
  signed:     "green",
  expired:    "orange",
  terminated: "red",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft:      <FileTextOutlined />,
  reviewed:   <EyeOutlined />,
  signed:     <CheckCircleOutlined />,
  expired:    <ClockCircleOutlined />,
  terminated: <DeleteOutlined />,
};

type Contract = {
  id: string;
  contract_type_name: string;
  contract_type_id: string;
  category: string;
  governing_law: string;
  party_a_name: string;
  party_a_role: string | null;
  party_b_name: string;
  party_b_role: string | null;
  status: string;
  signed_at: string | null;
  signer_name: string | null;
  created_at: string;
  contract_text: string | null;
};

export default function ContractsPageWrapper() {
  return <Suspense><ContractsPage /></Suspense>;
}

function ContractsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "my-contracts" ? "my-contracts" : "templates");

  // My Contracts state
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [signTarget, setSignTarget] = useState<Contract | null>(null);
  const [signing, setSigning] = useState(false);
  const [signForm] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => {
    if (activeTab === "my-contracts") fetchContracts();
  }, [activeTab]);

  // Also fetch on mount if starting on my-contracts tab
  useEffect(() => {
    if (activeTab === "my-contracts") fetchContracts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchContracts() {
    setLoading(true);
    const rows = await listContracts();
    setContracts(rows as Contract[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    Modal.confirm({
      title: "Delete contract?",
      content: "This cannot be undone.",
      okText: "Delete", okType: "danger",
      onOk: async () => {
        await deleteContract(id);
        setContracts(prev => prev.filter(c => c.id !== id));
        msgApi.success("Contract deleted");
      },
    });
  }

  async function handleStatusChange(id: string, status: string) {
    await updateContractStatus(id, status);
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    msgApi.success(`Status updated to ${status}`);
  }

  async function handleSign() {
    if (!signTarget) return;
    try {
      const values = await signForm.validateFields();
      setSigning(true);
      const result = await signContract(signTarget.id, {
        signerName: values.signerName,
        signerEmail: values.signerEmail ?? undefined,
        signatureData: values.signerName,
        signatureType: "typed",
      });
      if (result) {
        setContracts(prev => prev.map(c =>
          c.id === signTarget.id
            ? { ...c, status: "signed", signer_name: values.signerName, signed_at: new Date().toISOString() }
            : c
        ));
        msgApi.success(`Signed by ${values.signerName}`);
        setSignTarget(null);
        signForm.resetFields();
      } else {
        msgApi.error("Signing failed. Please try again.");
      }
    } catch { /* validation error */ }
    finally { setSigning(false); }
  }

  // Template browser filter
  const filtered = CONTRACT_TYPES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <SafetyCertificateOutlined style={{ fontSize: 26, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Contracts</Title>
            <Tag color="blue" style={{ borderRadius: 20, fontWeight: 700 }}>15 types</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>
            AI-generated contracts with jurisdiction-aware clauses and e-signature.
          </Text>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginBottom: 8 }}
        items={[
          {
            key: "templates",
            label: "New Contract",
            icon: <PlusOutlined />,
            children: <TemplatesBrowser
              search={search} setSearch={setSearch}
              activeCategory={activeCategory} setActiveCategory={setActiveCategory}
              filtered={filtered}
            />,
          },
          {
            key: "my-contracts",
            label: `My Contracts${contracts.length ? ` (${contracts.length})` : ""}`,
            icon: <FileTextOutlined />,
            children: loading ? (
              <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
            ) : contracts.length === 0 ? (
              <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
                <Empty
                  image={<SafetyCertificateOutlined style={{ fontSize: 64, color: "#cbd5e1" }} />}
                  imageStyle={{ height: 80 }}
                  description={
                    <div>
                      <Title level={4} style={{ color: "#64748b", marginBottom: 8 }}>No contracts yet</Title>
                      <Text type="secondary">Generate your first AI contract to see it here.</Text>
                    </div>
                  }
                >
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setActiveTab("templates")}>
                    Browse Contract Types
                  </Button>
                </Empty>
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {contracts.map(c => (
                  <Col key={c.id} xs={24} sm={12} lg={8}>
                    <Card
                      hoverable
                      style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                      styles={{ body: { padding: 22 } }}
                      actions={[
                        <Tooltip key="view" title="View contract">
                          <Link href={`/contract/${c.id}`} target="_blank">
                            <Button type="text" icon={<EyeOutlined />} />
                          </Link>
                        </Tooltip>,
                        <Tooltip key="sign" title={c.status === "signed" ? `Signed by ${c.signer_name}` : "Sign contract"}>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            disabled={c.status === "signed"}
                            onClick={() => { setSignTarget(c); signForm.resetFields(); }}
                          />
                        </Tooltip>,
                        <Tooltip key="del" title="Delete">
                          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(c.id)} />
                        </Tooltip>,
                      ]}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ minWidth: 0 }}>
                            <Text strong style={{ fontSize: 14, display: "block" }}>{c.contract_type_name}</Text>
                            <Tag
                              color={CATEGORY_COLORS[c.category]}
                              style={{ borderRadius: 20, fontSize: 10, border: "none", background: `${CATEGORY_COLORS[c.category] ?? "#0ea5e9"}15`, color: CATEGORY_COLORS[c.category] ?? "#0ea5e9", marginTop: 4 }}
                            >
                              {c.category}
                            </Tag>
                          </div>
                          <Tag
                            color={STATUS_COLORS[c.status]}
                            icon={STATUS_ICONS[c.status]}
                            style={{ borderRadius: 20, fontSize: 11, textTransform: "capitalize", flexShrink: 0 }}
                          >
                            {c.status}
                          </Tag>
                        </div>

                        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>Parties</Text>
                          <Text style={{ fontSize: 12, display: "block" }}>
                            {c.party_a_name} ↔ {c.party_b_name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 2 }}>
                            {c.governing_law}
                          </Text>
                        </div>

                        {c.status === "signed" && c.signer_name && (
                          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "6px 12px", border: "1px solid #bbf7d0" }}>
                            <Text style={{ fontSize: 11, color: "#16a34a" }}>
                              ✅ Signed by {c.signer_name}
                              {c.signed_at && ` · ${new Date(c.signed_at).toLocaleDateString()}`}
                            </Text>
                          </div>
                        )}

                        <Select
                          size="small"
                          value={c.status}
                          style={{ width: "100%" }}
                          onChange={v => handleStatusChange(c.id, v)}
                          disabled={c.status === "signed"}
                          options={[
                            { value: "draft",      label: "📝 Draft" },
                            { value: "reviewed",   label: "👁 Reviewed" },
                            { value: "signed",     label: "✅ Signed", disabled: true },
                            { value: "expired",    label: "⏰ Expired" },
                            { value: "terminated", label: "❌ Terminated" },
                          ]}
                        />

                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Created {new Date(c.created_at).toLocaleDateString()}
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />

      {/* E-Signature Modal */}
      <Modal
        open={!!signTarget}
        onCancel={() => { setSignTarget(null); signForm.resetFields(); }}
        onOk={handleSign}
        okText="Sign Contract"
        okButtonProps={{ loading: signing, type: "primary", icon: <CheckCircleOutlined /> }}
        title={
          <Space>
            <CheckCircleOutlined style={{ color: "#10b981" }} />
            <span>Sign: {signTarget?.contract_type_name}</span>
          </Space>
        }
        width={520}
      >
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 16px", marginBottom: 20, border: "1px solid #bbf7d0" }}>
          <Text style={{ fontSize: 13, color: "#166534" }}>
            By signing, you agree to be legally bound by the terms of this contract. Your typed name constitutes a legally binding e-signature under ESIGN/UETA.
          </Text>
        </div>

        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>CONTRACT</Text>
          <Text strong style={{ fontSize: 13 }}>{signTarget?.contract_type_name}</Text>
          <Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 2 }}>
            {signTarget?.party_a_name} ↔ {signTarget?.party_b_name} · {signTarget?.governing_law}
          </Text>
        </div>

        <Form form={signForm} layout="vertical" size="large">
          <Form.Item
            label={<Text strong>Full Legal Name <Text type="danger">*</Text></Text>}
            name="signerName"
            rules={[{ required: true, message: "Please enter your full legal name" }]}
            extra={<Text type="secondary" style={{ fontSize: 11 }}>Type exactly as it appears in your legal documents.</Text>}
          >
            <Input placeholder="Jane Smith" style={{ borderRadius: 8, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16 }} />
          </Form.Item>
          <Form.Item
            label="Email (optional — for records)"
            name="signerEmail"
          >
            <Input type="email" placeholder="jane@company.com" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>

        <Divider style={{ margin: "16px 0 12px" }} />
        <Text type="secondary" style={{ fontSize: 11 }}>
          Timestamp: {new Date().toLocaleString()} · Your IP address will be recorded with this signature.
        </Text>
      </Modal>
    </div>
  );
}

function TemplatesBrowser({
  search, setSearch, activeCategory, setActiveCategory, filtered,
}: {
  search: string;
  setSearch: (v: string) => void;
  activeCategory: string | null;
  setActiveCategory: (v: string | null) => void;
  filtered: typeof CONTRACT_TYPES;
}) {
  return (
    <div>
      {/* Disclaimer */}
      <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "12px 18px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <Text style={{ fontSize: 13, color: "#92400e" }}>
          <strong>Legal Disclaimer:</strong> AI-generated contracts are for informational purposes only. Always have contracts reviewed by a licensed attorney before signing or relying on them.
        </Text>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search contract types…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320, borderRadius: 10, height: 40 }}
          allowClear
        />
        <Space wrap>
          <Tag
            style={{ cursor: "pointer", borderRadius: 20, padding: "4px 14px", fontWeight: !activeCategory ? 700 : 400, background: !activeCategory ? "#0ea5e9" : "#fff", color: !activeCategory ? "#fff" : "#374151", border: `1.5px solid ${!activeCategory ? "#0ea5e9" : "#e2e8f0"}` }}
            onClick={() => setActiveCategory(null)}
          >
            All
          </Tag>
          {CONTRACT_CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            const color = CATEGORY_COLORS[cat.id];
            return (
              <Tag
                key={cat.id}
                style={{ cursor: "pointer", borderRadius: 20, padding: "4px 14px", fontWeight: active ? 700 : 400, background: active ? color : "#fff", color: active ? "#fff" : "#374151", border: `1.5px solid ${active ? color : "#e2e8f0"}` }}
                onClick={() => setActiveCategory(active ? null : cat.id)}
              >
                {cat.icon} {cat.id}
              </Tag>
            );
          })}
        </Space>
      </div>

      {/* Grid */}
      {!search && !activeCategory ? (
        CONTRACT_CATEGORIES.map(cat => {
          const items = CONTRACT_TYPES.filter(c => c.category === cat.id);
          if (!items.length) return null;
          const color = CATEGORY_COLORS[cat.id];
          return (
            <div key={cat.id} style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {cat.icon}
                </div>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{cat.label}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>{cat.description}</Text>
                </div>
                <Tag style={{ marginLeft: "auto", borderRadius: 20 }}>{items.length}</Tag>
              </div>
              <Row gutter={[14, 14]}>
                {items.map(c => <ContractCard key={c.id} contract={c} color={color} />)}
              </Row>
              <Divider style={{ margin: "28px 0 0" }} />
            </div>
          );
        })
      ) : (
        <Row gutter={[14, 14]}>
          {filtered.map(c => (
            <ContractCard key={c.id} contract={c} color={CATEGORY_COLORS[c.category]} />
          ))}
        </Row>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Text type="secondary" style={{ fontSize: 16 }}>No contracts match &ldquo;{search}&rdquo;</Text>
        </div>
      )}
    </div>
  );
}

function ContractCard({ contract, color }: { contract: (typeof CONTRACT_TYPES)[0]; color: string }) {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Link href={`/contracts/generate/${contract.id}`}>
        <Card
          hoverable
          size="small"
          style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer", height: "100%" }}
          styles={{ body: { padding: 20 } }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {contract.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Text strong style={{ fontSize: 14 }}>{contract.name}</Text>
                {contract.badge && (
                  <Badge
                    count={contract.badge}
                    style={{ background: contract.badge === "Hot" ? "#ef4444" : "#10b981", fontSize: 10, height: 18, lineHeight: "18px", borderRadius: 9 }}
                  />
                )}
              </div>
              <Tag color={color} style={{ marginTop: 4, borderRadius: 20, fontSize: 11, border: "none", background: `${color}15`, color }}>
                {contract.category}
              </Tag>
            </div>
          </div>

          <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5, display: "block", marginBottom: 12 }}>
            {contract.description.slice(0, 110)}…
          </Text>

          <Space wrap style={{ marginBottom: 12 }}>
            {contract.features.slice(0, 3).map(f => (
              <Tag key={f} style={{ borderRadius: 20, fontSize: 10, padding: "1px 8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>{f}</Tag>
            ))}
            {contract.features.length > 3 && (
              <Tag style={{ borderRadius: 20, fontSize: 10, padding: "1px 8px" }}>+{contract.features.length - 3} more</Tag>
            )}
          </Space>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color, fontWeight: 600 }}>
              Generate <ArrowRightOutlined />
            </Text>
            <Button type="primary" size="small" style={{ background: color, borderColor: color, borderRadius: 8, fontSize: 12 }}>
              Use →
            </Button>
          </div>
        </Card>
      </Link>
    </Col>
  );
}
