"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button, Card, Col, Input, Modal, Row, Select, Space,
  Tag, Tabs, Typography, Tooltip, message, Form, Divider,
} from "antd";
import {
  SearchOutlined, ArrowRightOutlined, SafetyCertificateOutlined,
  DeleteOutlined, EyeOutlined, FileTextOutlined, EditOutlined,
  CheckCircleOutlined, PlusOutlined, FormOutlined, DownloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CONTRACT_TYPES, CONTRACT_CATEGORIES } from "@/lib/contract-types";
import { listContracts, deleteContract, signContract, updateContractStatus } from "@/lib/db";
import { Page, PageHeader, EmptyState, StatusPill, Banner } from "@/components/app/ui";
import { Button as BrandButton } from "@/components/site/ui";

const { Text } = Typography;

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
    <Page wide>
      {ctx}

      <PageHeader
        title="Contracts"
        sub="AI-generated contracts with jurisdiction-aware clauses and e-signature."
        count="15 types"
      />

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map(i => <div key={i} className="dp-skel h-52 rounded-3xl" />)}
              </div>
            ) : contracts.length === 0 ? (
              <EmptyState icon={<SafetyCertificateOutlined />} title="No contracts yet" body="Generate your first AI contract and it will show up here.">
                <BrandButton onClick={() => setActiveTab("templates")}><PlusOutlined /> Browse contract types</BrandButton>
              </EmptyState>
            ) : (
              <Row gutter={[16, 16]}>
                {contracts.map(c => (
                  <Col key={c.id} xs={24} sm={12} lg={8}>
                    <Card
                      hoverable
                      className="h-full"
                      styles={{ body: { padding: 22 } }}
                      actions={[
                        <Tooltip key="view" title="View contract">
                          <Link href={`/contract/${c.id}`} target="_blank">
                            <Button type="text" icon={<EyeOutlined />} />
                          </Link>
                        </Tooltip>,
                        <Tooltip key="edit" title="Edit in document editor">
                          <Link href={`/editor/contract/${c.id}`} target="_blank">
                            <Button type="text" icon={<EditOutlined />} />
                          </Link>
                        </Tooltip>,
                        <Tooltip key="sign" title={c.status === "signed" ? `Signed by ${c.signer_name}` : "Sign contract"}>
                          <Button
                            type="text"
                            icon={<FormOutlined />}
                            disabled={c.status === "signed"}
                            onClick={() => { setSignTarget(c); signForm.resetFields(); }}
                          />
                        </Tooltip>,
                        <Tooltip key="pdf" title="Download PDF">
                          <Button type="text" icon={<DownloadOutlined />}
                            onClick={() => window.open(`/api/pdf/contract/${c.id}`, "_blank")} />
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
                          <StatusPill status={c.status} />
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
    </Page>
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
      <Banner
        tone="amber"
        title="Legal disclaimer"
        body="AI-generated contracts are for informational purposes only. Have a licensed attorney review them before you sign or rely on them."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          prefix={<SearchOutlined className="text-ink-300" />}
          placeholder="Search contract types…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="!h-10 !max-w-xs"
          allowClear
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${!activeCategory ? "bg-ink text-white" : "border border-line bg-white text-ink-500 hover:text-ink"}`}
          >
            All
          </button>
          {CONTRACT_CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(active ? null : cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${active ? "bg-ink text-white" : "border border-line bg-white text-ink-500 hover:text-ink"}`}
              >
                {cat.icon} {cat.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {!search && !activeCategory ? (
        CONTRACT_CATEGORIES.map(cat => {
          const items = CONTRACT_TYPES.filter(c => c.category === cat.id);
          if (!items.length) return null;
          const color = CATEGORY_COLORS[cat.id];
          return (
            <div key={cat.id} className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl text-[18px]" style={{ background: `${color}18` }}>
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[16px] font-bold text-ink">{cat.label}</div>
                  <div className="text-[12.5px] text-ink-400">{cat.description}</div>
                </div>
                <span className="ml-auto rounded-full bg-canvas px-2.5 py-1 text-[12px] font-bold text-ink-500">{items.length}</span>
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
        <EmptyState icon={<SearchOutlined />} title="No matching types" body={search ? `Nothing matches “${search}”.` : "No contract types in this category."} />
      )}
    </div>
  );
}

function ContractCard({ contract, color }: { contract: (typeof CONTRACT_TYPES)[0]; color: string }) {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Link href={`/contracts/generate-quick/${contract.id}`}>
        <Card hoverable className="h-full" styles={{ body: { padding: 20 } }}>
          <div className="mb-3 flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[20px]" style={{ background: `${color}18` }}>
              {contract.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[14px] font-semibold text-ink">{contract.name}</span>
                {contract.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${contract.badge === "Hot" ? "bg-rose-500" : "bg-emerald-500"}`}>
                    {contract.badge}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[12px] font-semibold" style={{ color }}>{contract.category}</div>
            </div>
          </div>

          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-400">
            {contract.description.slice(0, 110)}…
          </p>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {contract.features.slice(0, 3).map(f => (
              <span key={f} className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[10.5px] font-medium text-ink-500">{f}</span>
            ))}
            {contract.features.length > 3 && (
              <span className="rounded-full border border-line px-2 py-0.5 text-[10.5px] font-medium text-ink-400">+{contract.features.length - 3} more</span>
            )}
          </div>

          <div className="flex items-center justify-between text-[12.5px] font-semibold" style={{ color }}>
            <span className="inline-flex items-center gap-1">Generate <ArrowRightOutlined /></span>
            <span>Use →</span>
          </div>
        </Card>
      </Link>
    </Col>
  );
}
