"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert, Button, Card, Col, DatePicker, Form, Input, InputNumber, Radio,
  Row, Select, Space, Steps, Switch, Tag, Typography, message,
} from "antd";
import {
  ArrowLeftOutlined, ArrowRightOutlined, ThunderboltOutlined,
  CopyOutlined, DownloadOutlined, SafetyCertificateOutlined, WarningOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getContractType } from "@/lib/contract-types";
const DocumentEditor = dynamic(() => import("@/components/DocumentEditor"), { ssr: false });
import type { ContractType } from "@/lib/contract-types";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import { loadCountries, loadUSStates, saveContract } from "@/lib/db";
import type { Country } from "@/lib/db";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CATEGORY_COLORS: Record<string, string> = {
  Employment: "#0ea5e9", Confidentiality: "#7c3aed", Services: "#0369a1",
  Commerce: "#10b981", Business: "#f59e0b", Property: "#ef4444",
  Finance: "#6366f1", "Legal Waiver": "#64748b",
};

const STEP_TITLES = ["Jurisdiction & Parties", "Contract Details", "Review & Generate", "Your Contract"];

export default function ContractGeneratePage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const contract: ContractType | undefined = getContractType(type);

  const [currentStep, setCurrentStep] = useState(0);
  const [jurisdiction, setJurisdiction] = useState("");
  const [jurisdictionCountry, setJurisdictionCountry] = useState("");
  const [partyA, setPartyA] = useState({ name: "", address: "", role: "" });
  const [partyB, setPartyB] = useState({ name: "", address: "", role: "" });
  const [fields, setFields] = useState<Record<string, string>>({});
  const [contractText, setContractText] = useState("");
  const [savedContractId, setSavedContractId] = useState<string | null>(null);
  const [contractViewMode, setContractViewMode] = useState<"editor" | "raw">("editor");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [usStates, setUsStates] = useState<{ code: string; name: string }[]>([]);
  const [isUSJurisdiction, setIsUSJurisdiction] = useState(false);
  const [msgApi, ctx] = message.useMessage();
  const textRef = useRef<HTMLDivElement>(null);

  const [formA] = Form.useForm();
  const [formB] = Form.useForm();
  const [formDetails] = Form.useForm();

  useEffect(() => {
    if (!contract) router.push("/contracts");
    // Load countries and US states from Supabase
    loadCountries().then(setCountries);
    loadUSStates().then(setUsStates);
  }, [contract, router]);

  if (!contract) return null;
  const safeContract = contract;

  const color = CATEGORY_COLORS[contract.category] ?? "#0ea5e9";

  function setField(key: string, value: string | boolean | number) {
    setFields(f => ({ ...f, [key]: String(value) }));
  }

  async function generate() {
    setLoading(true);
    setContractText("");
    setCurrentStep(3);

    try {
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractTypeId: safeContract.id,
          state: jurisdiction,
          partyA: { ...partyA, role: partyA.role || "Party A" },
          partyB: { ...partyB, role: partyB.role || "Party B" },
          fields,
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
        setContractText(text);
      }

      // Save to Supabase
      const id = await saveContract({
        contractTypeId: safeContract.id,
        contractTypeName: safeContract.name,
        category: safeContract.category,
        governingLaw: jurisdiction,
        governingCountry: jurisdictionCountry || undefined,
        governingState: isUSJurisdiction ? jurisdiction : undefined,
        partyAName: partyA.name,
        partyARole: partyA.role,
        partyAAddress: partyA.address,
        partyBName: partyB.name,
        partyBRole: partyB.role,
        partyBAddress: partyB.address,
        contractFields: fields,
        contractText: text,
      });
      if (id) setSavedContractId(id);
    } catch {
      msgApi.error("Contract generation failed. Please try again.");
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  }

  function copyContract() {
    navigator.clipboard.writeText(contractText);
    msgApi.success("Contract copied to clipboard!");
  }

  function downloadContract() {
    const blob = new Blob([contractText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeContract.name.replace(/\s+/g, "_")}_${jurisdiction}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const canProceedStep0 = jurisdictionCountry && (isUSJurisdiction ? jurisdiction : true) && partyA.name && partyB.name;
  const canProceedStep1 = contract.fields.filter(f => f.required).every(f => fields[f.key]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}

      {/* Back + header */}
      <div style={{ marginBottom: 28 }}>
        <Link href="/contracts">
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ padding: "4px 0", color: "#64748b", marginBottom: 12 }}>
            All Contracts
          </Button>
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            {contract.icon}
          </div>
          <div>
            <Space align="center">
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{contract.name}</Title>
              {contract.badge && <Tag color={contract.badge === "Hot" ? "red" : "green"}>{contract.badge}</Tag>}
              <Tag style={{ borderRadius: 20, color, border: "none", background: `${color}15` }}>{contract.category}</Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: 13 }}>{contract.description.slice(0, 100)}…</Text>
          </div>
        </div>
      </div>

      {/* Steps */}
      <Steps
        current={currentStep}
        style={{ marginBottom: 32 }}
        size="small"
        items={STEP_TITLES.map((t, i) => ({
          title: t,
          status: currentStep > i ? "finish" : currentStep === i ? "process" : "wait",
        }))}
      />

      {/* Legal notes */}
      {contract.legalNotes.length > 0 && currentStep < 3 && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message="Jurisdiction & Compliance Notes"
          description={
            <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
              {contract.legalNotes.map((n, i) => <li key={i} style={{ fontSize: 13 }}>{n}</li>)}
            </ul>
          }
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* ── STEP 0: Jurisdiction & Parties ── */}
      {currentStep === 0 && (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} bodyStyle={{ padding: 32 }}>
          <Title level={5} style={{ margin: "0 0 20px" }}>
            <SafetyCertificateOutlined style={{ color, marginRight: 8 }} />
            Jurisdiction & Parties
          </Title>

          <Form layout="vertical" size="large">
            {/* Country selector */}
            <Form.Item label={<Text strong>Governing Country</Text>} required>
              <Select
                showSearch placeholder="🌍 Select country…"
                value={jurisdictionCountry || undefined}
                onChange={v => {
                  setJurisdictionCountry(v);
                  setIsUSJurisdiction(v === "US");
                  if (v !== "US") setJurisdiction(countries.find(c => c.code === v)?.name ?? v);
                }}
                style={{ width: "100%" }}
                filterOption={(input, opt) => String(opt?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                optionFilterProp="label"
                options={
                  ["Africa","Americas","Asia","Europe","Oceania"].flatMap(region => [
                    { label: region, options: [] as { value: string; label: string }[] },
                    ...countries
                      .filter(c => c.region === region)
                      .map(c => ({ value: c.code, label: `${c.flag_emoji} ${c.name}` })),
                  ]).filter(g => !("options" in g) || (g as { options: unknown[] }).options.length > 0)
                }
                loading={countries.length === 0}
              />
            </Form.Item>

            {/* US state picker (shown only for US) */}
            {isUSJurisdiction && (
              <Form.Item label={<Text strong>Governing State</Text>} required extra={<Text type="secondary" style={{ fontSize: 12 }}>US state law governs interpretation and enforcement.</Text>}>
                <Select
                  showSearch placeholder="Select state…"
                  value={jurisdiction || undefined}
                  onChange={v => setJurisdiction(v)}
                  style={{ width: "100%" }}
                  filterOption={(input, opt) => String(opt?.value ?? "").toLowerCase().includes(input.toLowerCase())}
                  loading={usStates.length === 0}
                >
                  {usStates.map(s => <Option key={s.code} value={s.name}>{s.name}</Option>)}
                </Select>
              </Form.Item>
            )}
          </Form>

          <Row gutter={24} style={{ marginTop: 8 }}>
            {([
              { label: "Party A", party: partyA, setParty: setPartyA, defaultRole: contract.id === "nda" ? "Disclosing Party" : contract.id === "lease" ? "Landlord" : contract.id === "loan" ? "Lender" : "Company", showClientSelect: false },
              { label: "Party B", party: partyB, setParty: setPartyB, defaultRole: contract.id === "nda" ? "Receiving Party" : contract.id === "lease" ? "Tenant" : contract.id === "loan" ? "Borrower" : "Counterparty", showClientSelect: true },
            ] as { label: string; party: typeof partyA; setParty: typeof setPartyA; defaultRole: string; showClientSelect: boolean }[]).map(({ label, party, setParty, defaultRole, showClientSelect }) => (
              <Col key={label} xs={24} sm={12}>
                <Card size="small" style={{ borderRadius: 12, border: `1px solid ${showClientSelect ? `${color}30` : "#e2e8f0"}`, background: "#fafafa" }} bodyStyle={{ padding: 16 }}>
                  <Text strong style={{ display: "block", marginBottom: 14, color }}>{label}</Text>

                  {/* Client selector — shown for Party B (the counterparty / client) */}
                  {showClientSelect && (
                    <Form layout="vertical" size="middle">
                      <Form.Item label="Select from your clients" style={{ marginBottom: 12 }}>
                        <ClientSelect
                          onSelect={(client: ClientOption | null) => {
                            if (client) {
                              setParty({
                                name:    client.name + (client.company ? ` (${client.company})` : ""),
                                role:    defaultRole,
                                address: "",
                              });
                            }
                          }}
                          placeholder="Choose a client…"
                          size="middle"
                          allowNew={false}
                        />
                      </Form.Item>
                    </Form>
                  )}

                  <Form layout="vertical" size="middle">
                    <Form.Item label="Role / Title" style={{ marginBottom: 10 }}>
                      <Input placeholder={defaultRole} value={party.role}
                        onChange={e => setParty(p => ({ ...p, role: e.target.value }))}
                        style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="Full Name / Entity Name" required style={{ marginBottom: 10 }}>
                      <Input placeholder="Acme Corp, Inc." value={party.name}
                        onChange={e => setParty(p => ({ ...p, name: e.target.value }))}
                        style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="Address" style={{ marginBottom: 0 }}>
                      <TextArea rows={2} placeholder="123 Main St, City, State, ZIP"
                        value={party.address}
                        onChange={e => setParty(p => ({ ...p, address: e.target.value }))}
                        style={{ borderRadius: 8 }} />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <Button type="primary" icon={<ArrowRightOutlined />} disabled={!canProceedStep0}
              onClick={() => setCurrentStep(1)} style={{ borderRadius: 10, fontWeight: 600, height: 44 }}>
              Next: Contract Details
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 1: Contract-specific fields ── */}
      {currentStep === 1 && (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} bodyStyle={{ padding: 32 }}>
          <Title level={5} style={{ margin: "0 0 24px" }}>
            {contract.icon} Contract Details
          </Title>
          <Form layout="vertical" size="large">
            <Row gutter={[20, 4]}>
              {contract.fields.map(f => (
                <Col key={f.key} xs={24} sm={f.type === "textarea" ? 24 : 12}>
                  <Form.Item
                    label={<Space size={4}><Text strong style={{ fontSize: 13 }}>{f.label}</Text>{f.required && <Text type="danger">*</Text>}</Space>}
                    extra={f.hint ? <Text type="secondary" style={{ fontSize: 11 }}>{f.hint}</Text> : undefined}
                  >
                    {f.type === "text" && (
                      <Input placeholder={f.placeholder} value={fields[f.key] ?? ""} style={{ borderRadius: 8 }}
                        onChange={e => setField(f.key, e.target.value)} />
                    )}
                    {f.type === "textarea" && (
                      <TextArea rows={3} placeholder={f.placeholder} value={fields[f.key] ?? ""} style={{ borderRadius: 8 }}
                        onChange={e => setField(f.key, e.target.value)} />
                    )}
                    {f.type === "number" && (
                      <InputNumber style={{ width: "100%", borderRadius: 8 }} placeholder={f.placeholder}
                        value={fields[f.key] ? Number(fields[f.key]) : undefined}
                        onChange={v => setField(f.key, String(v ?? ""))} />
                    )}
                    {f.type === "select" && (
                      <Select placeholder={`Select…`} value={fields[f.key] || undefined} style={{ width: "100%" }}
                        onChange={v => setField(f.key, v)}>
                        {f.options?.map(o => <Option key={o} value={o}>{o}</Option>)}
                      </Select>
                    )}
                    {f.type === "date" && (
                      <DatePicker style={{ width: "100%", borderRadius: 8 }}
                        value={fields[f.key] ? dayjs(fields[f.key]) : undefined}
                        onChange={(_, s) => setField(f.key, s as string)} />
                    )}
                    {f.type === "toggle" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Switch checked={fields[f.key] === "true"}
                          onChange={v => setField(f.key, v)} />
                        {f.placeholder && <Text type="secondary" style={{ fontSize: 12 }}>{f.placeholder}</Text>}
                      </div>
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(0)} style={{ borderRadius: 10, height: 44 }}>Back</Button>
            <Button type="primary" icon={<ArrowRightOutlined />} disabled={!canProceedStep1}
              onClick={() => setCurrentStep(2)} style={{ borderRadius: 10, fontWeight: 600, height: 44 }}>
              Review & Generate
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 2: Review ── */}
      {currentStep === 2 && (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} bodyStyle={{ padding: 32 }}>
          <Title level={5} style={{ margin: "0 0 20px" }}>Review Before Generating</Title>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>GOVERNING LAW</Text>
                <Text strong>{jurisdiction}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>CONTRACT TYPE</Text>
                <Text strong>{contract.name}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>PARTY A</Text>
                <Text strong>{partyA.name || "—"}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{partyA.role || "Party A"}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>PARTY B</Text>
                <Text strong>{partyB.name || "—"}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{partyB.role || "Party B"}</Text>
              </div>
            </Col>
          </Row>

          {Object.entries(fields).filter(([, v]) => v && v !== "false").length > 0 && (
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 10 }}>CONTRACT DETAILS</Text>
              <Row gutter={[12, 8]}>
                {Object.entries(fields).filter(([, v]) => v && v !== "false").map(([k, v]) => {
                  const fieldDef = contract.fields.find(f => f.key === k);
                  return (
                    <Col key={k} xs={24} sm={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>{fieldDef?.label ?? k}: </Text>
                      <Text style={{ fontSize: 13 }}>{v === "true" ? "Yes" : v}</Text>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}

          <Alert
            type="info"
            showIcon
            message="AI will generate a complete, formatted contract"
            description={`Claude Opus 4.6 will write a full ${contract.name} with all required clauses, ${jurisdiction} law provisions, and a signature block. Generation takes ~30–60 seconds.`}
            style={{ marginBottom: 24, borderRadius: 10 }}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(1)} style={{ borderRadius: 10, height: 44 }}>Back</Button>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={generate}
              style={{ borderRadius: 10, fontWeight: 700, height: 44, background: color, borderColor: color, paddingInline: 28 }}>
              Generate Contract with AI
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 3: Generated Contract ── */}
      {currentStep === 3 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <Space>
              {loading && !contractText && (
                <Space style={{ color }}>
                  <span style={{ fontSize: 20 }}>⚡</span>
                  <Text style={{ color }}>Claude is drafting your {contract.name}…</Text>
                </Space>
              )}
            </Space>
            <Button onClick={() => { setCurrentStep(0); setContractText(""); setSavedContractId(null); }} style={{ borderRadius: 8 }}>
              ← Start New
            </Button>
          </div>

          {/* Streaming raw text (while generating) */}
          {loading && (
            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 32 } }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color, marginBottom: 16 }}>
                <span>⚡</span>
                <Text style={{ color, fontSize: 14 }}>Writing — editing available when complete…</Text>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.8, color: "#1e293b", maxHeight: 400, overflow: "auto" }}>
                {contractText}
              </pre>
            </Card>
          )}

          {/* Document Editor — shown when generation is done */}
          {!loading && contractText && (
            <>
              <div style={{ height: "calc(100vh - 260px)", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 16 }}>
                <DocumentEditor
                  content={contractText}
                  documentId={savedContractId}
                  documentType="contract"
                  title={`${contract.name} — ${partyA.name} & ${partyB.name}`}
                  onSave={async (html) => {
                    if (!savedContractId) return;
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient();
                    await supabase
                      .from("contracts")
                      .update({ contract_text: html })
                      .eq("id", savedContractId);
                  }}
                />
              </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <Button icon={<CopyOutlined />} onClick={copyContract}>Copy</Button>
                <Button icon={<DownloadOutlined />} onClick={downloadContract}>Download .txt</Button>
                <Link href="/contracts?tab=my-contracts">
                  <Button type="primary" icon={<SafetyCertificateOutlined />}>View in My Contracts</Button>
                </Link>
              </div>

            <Alert
                type="warning"
                showIcon
                message="Legal Review Required"
                description="This AI-generated contract is for informational purposes only. Have it reviewed by a licensed attorney before signing."
                style={{ borderRadius: 10 }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
