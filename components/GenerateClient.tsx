"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert, Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber,
  Radio, Row, Select, Space, Tabs, Tag, Typography, message,
  Segmented,
} from "antd";
import {
  ThunderboltOutlined, AppstoreOutlined, RocketOutlined,
  UserOutlined, MailOutlined, FileTextOutlined, DollarOutlined,
  CalendarOutlined, BookOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

import type { ProposalFormData, ProposalSection, PricingTier, AddOn, Milestone } from "@/lib/types";
import { DEFAULT_SECTIONS, DEFAULT_TIERS, DEFAULT_ADDONS, DEFAULT_MILESTONES } from "@/lib/types";
import type { Template } from "@/lib/templates";
import { getTemplateById } from "@/lib/templates";
import { FREELANCER_TEMPLATES } from "@/lib/templates-by-type";
import type { BrandKit } from "@/lib/brand";
import { loadBrand } from "@/lib/brand";
import ProposalDisplay from "@/components/ProposalDisplay";
import TemplateSelector from "@/components/TemplateSelector";
import IntakeWizard from "@/components/IntakeWizard";
import SectionLibraryEditor from "@/components/SectionLibraryEditor";
import PricingTiersEditor from "@/components/PricingTiersEditor";
import { AddOnsEditor } from "@/components/AddOnsPanel";
import { MilestoneEditor } from "@/components/MilestoneBuilder";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);
  return user;
}

const defaultForm: ProposalFormData = {
  freelancerName: "", freelancerTitle: "", freelancerEmail: "",
  clientName: "", clientCompany: "",
  projectType: "", projectDescription: "", deliverables: "", timeline: "",
  totalBudget: 5000, depositPercent: 50, currency: "USD", tone: "professional",
};

const CURRENCIES = ["USD", "GBP", "EUR", "AUD", "CAD", "INR", "ILS", "SGD", "AED"];
const PROJECT_TYPES = [
  "Web Design & Development", "Mobile App Development", "Branding & Identity",
  "SEO & Content Marketing", "Social Media Management", "Copywriting",
  "Video Production", "UI/UX Design", "Data Analysis", "Consulting", "Other",
];
const TONE_OPTIONS = [
  { value: "professional", label: "💼 Professional", desc: "Formal & polished" },
  { value: "friendly",     label: "😊 Friendly",     desc: "Warm & conversational" },
  { value: "bold",         label: "🚀 Bold",         desc: "Confident & direct" },
];

export default function GenerateClient() {
  const searchParams = useSearchParams();
  const user = useSupabaseUser();
  const [msgApi, ctx] = message.useMessage();

  const [form, setForm] = useState<ProposalFormData>(defaultForm);
  const [antForm] = Form.useForm();
  const [sections, setSections] = useState<ProposalSection[]>(DEFAULT_SECTIONS);
  const [tiers, setTiers] = useState<PricingTier[]>(DEFAULT_TIERS);
  const [addOns, setAddOns] = useState<AddOn[]>(DEFAULT_ADDONS);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [brand, setBrand] = useState<BrandKit>({ logoUrl: null, primaryColor: "#0ea5e9", secondaryColor: "#0369a1", fontFamily: "Inter", companyName: "" });

  const [proposal, setProposal] = useState("");
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [linkedMilestones, setLinkedMilestones] = useState<Milestone[]>([]);
  const [linkedTiers, setLinkedTiers] = useState<PricingTier[]>([]);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");
  const [activeTab, setActiveTab] = useState("details");

  const [showTemplates, setShowTemplates] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [jobPost, setJobPost] = useState("");
  const [parsingJob, setParsingJob] = useState(false);

  const depositAmount = Math.round(form.totalBudget * form.depositPercent / 100);

  // Load brand + prefill from URL/user
  useEffect(() => { setBrand(loadBrand()); }, []);
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        freelancerName: f.freelancerName || (user.user_metadata?.full_name as string) || "",
        freelancerEmail: f.freelancerEmail || user.email || "",
      }));
    }
  }, [user]);
  useEffect(() => {
    const tplId = searchParams.get("template");
    const ftype = searchParams.get("ftype");
    const wizard = searchParams.get("wizard");
    const client = searchParams.get("client");
    const company = searchParams.get("company");
    if (tplId) { const tpl = getTemplateById(tplId); if (tpl) applyTemplate(tpl); }
    if (ftype) {
      const ft = FREELANCER_TEMPLATES.find(t => t.id === ftype);
      if (ft) { setForm(f => ({ ...f, ...ft.defaults })); setActiveTemplate(`${ft.icon} ${ft.type} Template`); }
    }
    if (wizard === "1") setShowWizard(true);
    if (client) setForm(f => ({ ...f, clientName: client, clientCompany: company ?? "" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field: keyof ProposalFormData, value: string | number) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function applyTemplate(template: Template) {
    setForm(f => ({ ...f, ...template.defaults }));
    setActiveTemplate(template.name);
    if (template.defaults.totalBudget) {
      const base = template.defaults.totalBudget;
      setTiers(prev => prev.map((t, i) => ({ ...t, price: Math.round(base * [0.7, 1, 1.4][i]) })));
    }
  }

  async function handleParseJobPost() {
    if (!jobPost.trim()) return;
    setParsingJob(true);
    try {
      const res = await fetch("/api/parse-job-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobPost }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.projectType) set("projectType", data.projectType.replace(/^[^|]+\| ?/, "").trim());
      if (data.clientCompany) set("clientCompany", data.clientCompany);
      if (data.projectDescription) set("projectDescription", data.projectDescription + (data.painPoints ? `\n\nClient goals: ${data.painPoints}` : ""));
      if (data.deliverables) set("deliverables", data.deliverables);
      if (data.timeline) set("timeline", data.timeline);
      if (data.budget && data.budget > 0) set("totalBudget", data.budget);
      msgApi.success("Form auto-filled from job post!");
    } catch { msgApi.error("Couldn't parse — fill the form manually."); }
    finally { setParsingJob(false); }
  }

  function handleWizardComplete(data: ProposalFormData) {
    setForm(data); setShowWizard(false); setActiveTemplate(null);
    setTimeout(() => document.getElementById("generate-btn")?.click(), 100);
  }

  async function handleGenerate() {
    // validate required fields
    if (!form.freelancerName || !form.freelancerEmail || !form.clientName || !form.projectType || !form.projectDescription || !form.deliverables || !form.timeline) {
      msgApi.error("Please fill in all required fields in the Project Details tab.");
      setActiveTab("details");
      return;
    }
    setLoading(true);
    setProposal(""); setPaymentLink(null); setLinkedMilestones([]); setLinkedTiers([]);
    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sections: sections.filter(s => s.included) }),
      });
      if (!res.ok || !res.body) throw new Error("Generation failed");
      setStep("result");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setProposal(text);
      }
      // Save to Supabase directly
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      let pid = `local_${Date.now()}`;
      if (user) {
        const { data: saved, error: saveErr } = await supabase
          .from("proposals")
          .insert({
            user_id:             user.id,
            client_name:         form.clientName,
            client_company:      form.clientCompany || null,
            project_type:        form.projectType || null,
            project_description: form.projectDescription || null,
            deliverables:        form.deliverables || null,
            timeline:            form.timeline || null,
            tone:                form.tone,
            currency:            form.currency,
            total_budget:        form.totalBudget,
            deposit_percent:     form.depositPercent,
            deposit_amount:      depositAmount,
            freelancer_name:     form.freelancerName || null,
            freelancer_title:    form.freelancerTitle || null,
            freelancer_email:    form.freelancerEmail || null,
            proposal_text:       text,
            tiers:               tiers,
            add_ons:             addOns,
            milestones:          milestones,
            brand_snapshot:      brand,
            status:              "draft",
            view_count:          0,
          })
          .select("id")
          .single();

        if (saveErr) {
          console.error("Save proposal error:", saveErr.message);
          msgApi.warning("Proposal generated but not saved: " + saveErr.message);
        } else {
          pid = saved!.id;
          console.log("✅ Proposal saved:", pid);
        }
      } else {
        msgApi.warning("Not signed in — proposal generated but not saved to your account.");
      }
      setProposalId(pid);
      try {
        localStorage.setItem(`zenvoy_full_${pid}`, JSON.stringify({
          id: pid, createdAt: new Date().toISOString(), proposalText: text,
          freelancerName: form.freelancerName, freelancerTitle: form.freelancerTitle,
          freelancerEmail: form.freelancerEmail, clientName: form.clientName, clientCompany: form.clientCompany,
          projectType: form.projectType, currency: form.currency, totalBudget: form.totalBudget,
          depositAmount, paymentLink: null, tiers, addOns, milestones, brand,
        }));
      } catch { /* storage full */ }
      setLoadingPayment(true);
      await Promise.allSettled([createDepositLink(), createMilestoneLinks(), createTierLinks()]);
    } catch (err) {
      msgApi.error(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    } finally { setLoading(false); setLoadingPayment(false); }
  }

  async function createDepositLink() {
    try {
      const res = await fetch("/api/create-payment-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: depositAmount, currency: form.currency, description: `${form.projectType} Deposit`, freelancerName: form.freelancerName, clientName: form.clientName }) });
      if (res.ok) { const { url } = await res.json(); setPaymentLink(url); }
    } catch { /* optional */ }
  }
  async function createMilestoneLinks() {
    try {
      const res = await fetch("/api/create-milestone-links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ milestones, totalBudget: form.totalBudget, currency: form.currency, freelancerName: form.freelancerName, clientName: form.clientName }) });
      if (res.ok) { const { milestones: linked } = await res.json(); setLinkedMilestones(linked); }
    } catch { /* optional */ }
  }
  async function createTierLinks() {
    const enabled = tiers.filter(t => t.price > 0);
    if (!enabled.length) return;
    try {
      const linked = await Promise.all(enabled.map(async tier => {
        const deposit = Math.round(tier.price * tier.depositPercent / 100);
        const res = await fetch("/api/create-payment-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: deposit, currency: form.currency, description: `${tier.name} Deposit`, freelancerName: form.freelancerName, clientName: form.clientName }) });
        if (res.ok) { const { url } = await res.json(); return { ...tier, paymentLink: url }; }
        return tier;
      }));
      setLinkedTiers(linked);
    } catch { /* optional */ }
  }

  if (step === "result") {
    return (
      <ProposalDisplay
        proposal={proposal} loading={loading} paymentLink={paymentLink}
        loadingPayment={loadingPayment} depositAmount={depositAmount}
        currency={form.currency} freelancerEmail={form.freelancerEmail}
        tone={form.tone} freelancerName={form.freelancerName} clientName={form.clientName}
        tiers={linkedTiers.length ? linkedTiers : tiers.filter(t => t.price > 0)}
        addOns={addOns}
        milestones={linkedMilestones.length ? linkedMilestones : milestones}
        totalBudget={form.totalBudget} proposalId={proposalId} brand={brand}
        onBack={() => { setStep("form"); setProposal(""); setPaymentLink(null); setProposalId(null); }}
      />
    );
  }

  // ── Tab items ───────────────────────────────────────────────
  const tabItems = [
    {
      key: "details",
      label: <Space size={4}><FileTextOutlined />Project Details</Space>,
      children: (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>

          {/* Job post paste */}
          <Card size="small" style={{ borderRadius: 12, border: "1.5px dashed #e2e8f0", background: "#fafafa" }}>
            <Space style={{ marginBottom: 12 }}>
              <BookOutlined style={{ color: "#0ea5e9" }} />
              <Text strong>Paste Job Post</Text>
              <Tag color="blue" style={{ borderRadius: 20, fontSize: 11 }}>Auto-fill</Tag>
            </Space>
            <TextArea rows={3} value={jobPost} onChange={e => setJobPost(e.target.value)}
              placeholder="Paste client's job post, Upwork listing, or brief — AI will read and auto-fill the form below…"
              style={{ borderRadius: 8, marginBottom: 10, fontFamily: "monospace", fontSize: 12 }} />
            {jobPost.trim() && (
              <Button icon={<ThunderboltOutlined />} loading={parsingJob} onClick={handleParseJobPost}
                style={{ borderRadius: 8, fontWeight: 600 }}>
                Auto-fill from job post
              </Button>
            )}
          </Card>

          {/* Freelancer details */}
          <Card size="small" title={<Space><UserOutlined style={{ color: "#0ea5e9" }} />Your Details</Space>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Your Name <Text type="danger">*</Text></Text>}>
                  <Input size="large" placeholder="Alex Johnson" value={form.freelancerName}
                    onChange={e => set("freelancerName", e.target.value)} style={{ borderRadius: 8 }}
                    prefix={<UserOutlined style={{ color: "#94a3b8" }} />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Your Title <Text type="danger">*</Text></Text>}>
                  <Input size="large" placeholder="Full-Stack Developer" value={form.freelancerTitle}
                    onChange={e => set("freelancerTitle", e.target.value)} style={{ borderRadius: 8 }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Your Email <Text type="danger">*</Text></Text>} style={{ marginBottom: 0 }}>
                  <Input size="large" type="email" placeholder="you@example.com" value={form.freelancerEmail}
                    onChange={e => set("freelancerEmail", e.target.value)} style={{ borderRadius: 8 }}
                    prefix={<MailOutlined style={{ color: "#94a3b8" }} />} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Client details */}
          <Card size="small" title={<Space><UserOutlined style={{ color: "#7c3aed" }} />Client Details</Space>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Form.Item
              label={<Text strong style={{ fontSize: 13 }}>Select Client <Text type="danger">*</Text></Text>}
              style={{ marginBottom: form.clientName ? 12 : 0 }}
            >
              <ClientSelect
                value={form.clientName ? undefined : undefined}
                onSelect={(client: ClientOption | null) => {
                  if (client) {
                    set("clientName", client.name);
                    set("clientCompany", client.company ?? "");
                  } else {
                    set("clientName", "");
                    set("clientCompany", "");
                  }
                }}
                placeholder="Choose an existing client…"
              />
            </Form.Item>

            {/* Show selected client summary or allow manual override */}
            {form.clientName ? (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space size={10}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                    {form.clientName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <Text strong style={{ display: "block", fontSize: 14 }}>{form.clientName}</Text>
                    {form.clientCompany && <Text type="secondary" style={{ fontSize: 12 }}>{form.clientCompany}</Text>}
                  </div>
                </Space>
                <Button type="text" size="small" onClick={() => { set("clientName", ""); set("clientCompany", ""); }}
                  style={{ color: "#94a3b8", fontSize: 12 }}>Change</Button>
              </div>
            ) : null}
          </Card>

          {/* Project details */}
          <Card size="small"
            title={<Space><FileTextOutlined style={{ color: "#10b981" }} />Project Details</Space>}
            extra={<Button type="link" size="small" onClick={() => setShowTemplates(true)} style={{ padding: 0 }}>Use a template →</Button>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Project Type <Text type="danger">*</Text></Text>} style={{ marginBottom: 0 }}>
                <Select size="large" placeholder="Select project type…" value={form.projectType || undefined}
                  onChange={v => set("projectType", v)} style={{ width: "100%" }}>
                  {PROJECT_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Project Description <Text type="danger">*</Text></Text>} style={{ marginBottom: 0 }}>
                <TextArea rows={4} placeholder="Describe what the client needs — the more detail, the better the proposal…"
                  value={form.projectDescription} onChange={e => set("projectDescription", e.target.value)} style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Key Deliverables <Text type="danger">*</Text></Text>} style={{ marginBottom: 0 }}>
                <TextArea rows={4} placeholder={"• Responsive website (5 pages)\n• CMS integration\n• 3 rounds of revisions"}
                  value={form.deliverables} onChange={e => set("deliverables", e.target.value)} style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ fontSize: 13 }}>Project Timeline <Text type="danger">*</Text></Text>}
                extra={<Text type="secondary" style={{ fontSize: 11 }}>Select project start and end dates</Text>}
                style={{ marginBottom: 0 }}
              >
                <DatePicker.RangePicker
                  size="large"
                  style={{ width: "100%", borderRadius: 8 }}
                  format="MMM D, YYYY"
                  disabledDate={d => d && d < dayjs().startOf("day")}
                  value={
                    form.timeline && form.timeline.includes(" → ")
                      ? [dayjs(form.timeline.split(" → ")[0], "MMM D, YYYY"), dayjs(form.timeline.split(" → ")[1], "MMM D, YYYY")]
                      : null
                  }
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      set("timeline", `${dates[0].format("MMM D, YYYY")} → ${dates[1].format("MMM D, YYYY")}`);
                    } else {
                      set("timeline", "");
                    }
                  }}
                  placeholder={["Start date", "End date"]}
                  separator="→"
                />
              </Form.Item>
            </Space>
          </Card>

          {/* Pricing */}
          <Card size="small" title={<Space><DollarOutlined style={{ color: "#f59e0b" }} />Base Pricing</Space>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Currency</Text>}>
                  <Select size="large" value={form.currency} onChange={v => set("currency", v)} style={{ width: "100%" }}>
                    {CURRENCIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Total Budget <Text type="danger">*</Text></Text>}>
                  <InputNumber size="large" min={100} value={form.totalBudget} onChange={v => set("totalBudget", v ?? 0)}
                    style={{ width: "100%", borderRadius: 8 }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={<Text strong style={{ fontSize: 13 }}>Deposit %</Text>}>
                  <Select size="large" value={form.depositPercent} onChange={v => set("depositPercent", v)} style={{ width: "100%" }}>
                    {[25, 30, 40, 50, 60, 100].map(p => <Option key={p} value={p}>{p}%</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <Text style={{ color: "#1d4ed8" }}>
                Deposit: <strong>{form.currency} {depositAmount.toLocaleString()}</strong>
              </Text>
              <Text style={{ color: "#3b82f6" }}>
                Balance on completion: <strong>{form.currency} {(form.totalBudget - depositAmount).toLocaleString()}</strong>
              </Text>
            </div>
          </Card>

          {/* Tone selector */}
          <Card size="small" title="Proposal Tone" style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <Radio.Group value={form.tone} onChange={e => set("tone", e.target.value)} style={{ width: "100%" }}>
              <Row gutter={[12, 12]}>
                {TONE_OPTIONS.map(t => (
                  <Col key={t.value} xs={24} sm={8}>
                    <Radio.Button value={t.value} style={{
                      width: "100%", textAlign: "center", borderRadius: 12, height: "auto",
                      padding: "16px 8px", border: `1.5px solid ${form.tone === t.value ? "#0ea5e9" : "#e2e8f0"}`,
                      background: form.tone === t.value ? "#eff6ff" : "#fff",
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{t.label.split(" ")[0]}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: form.tone === t.value ? "#1d4ed8" : "#374151" }}>
                        {t.label.split(" ").slice(1).join(" ")}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{t.desc}</div>
                    </Radio.Button>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, borderLeft: "3px solid #0ea5e9" }}>
              <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                {form.tone === "professional" && '"We will deliver a comprehensive solution aligned with your business objectives…"'}
                {form.tone === "friendly" && '"I\'d love to help you with this — here\'s exactly how I\'ll make it happen…"'}
                {form.tone === "bold" && '"This project will transform your results. Here\'s the plan to make it happen fast…"'}
              </Text>
            </div>
          </Card>
        </Space>
      ),
    },
    {
      key: "sections",
      label: <Space size={4}><BookOutlined />Sections</Space>,
      children: (
        <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
          <SectionLibraryEditor sections={sections} onChange={setSections} formData={form} />
        </Card>
      ),
    },
    {
      key: "pricing",
      label: <Space size={4}><DollarOutlined />Pricing</Space>,
      children: (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <Card title={<Space><span>🥇</span>Good / Better / Best</Space>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
            <PricingTiersEditor tiers={tiers} currency={form.currency} onChange={setTiers} />
          </Card>
          <Card title={<Space><span>➕</span>Optional Add-ons</Space>}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
            <AddOnsEditor addOns={addOns} currency={form.currency} onChange={setAddOns} />
          </Card>
        </Space>
      ),
    },
    {
      key: "schedule",
      label: <Space size={4}><CalendarOutlined />Schedule</Space>,
      children: (
        <Card title={<Space><CalendarOutlined style={{ color: "#0ea5e9" }} />Milestone Payment Schedule</Space>}
          style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 24 } }}>
          <MilestoneEditor milestones={milestones} totalBudget={form.totalBudget} currency={form.currency} onChange={setMilestones} />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
      {ctx}

      {showWizard && <IntakeWizard onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />}
      {showTemplates && <TemplateSelector onSelect={applyTemplate} onClose={() => setShowTemplates(false)} />}

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: "0 0 4px", fontWeight: 800 }}>New Proposal</Title>
        <Text type="secondary">Build a professional proposal with AI — include pricing tiers, add-ons, and a Stripe payment link.</Text>
      </div>

      {/* Quick-start cards */}
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12}>
          <Card hoverable onClick={() => setShowWizard(true)}
            style={{ borderRadius: 14, border: "2px solid #bfdbfe", background: "#eff6ff", cursor: "pointer" }}
            styles={{ body: { padding: 18 } }}>
            <Space>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧙</div>
              <div>
                <Text strong style={{ display: "block", color: "#1d4ed8" }}>Quick Wizard</Text>
                <Text style={{ fontSize: 12, color: "#3b82f6" }}>5 questions → full proposal</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card hoverable onClick={() => setShowTemplates(true)}
            style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer" }}
            styles={{ body: { padding: 18 } }}>
            <Space>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AppstoreOutlined style={{ color: "#64748b", fontSize: 18 }} />
              </div>
              <div>
                <Text strong style={{ display: "block" }}>Industry Templates</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>19 pre-filled templates</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Active template banner */}
      {activeTemplate && (
        <Alert
          message={<Space><Text strong>Template applied:</Text><Text>{activeTemplate}</Text></Space>}
          type="success"
          showIcon
          closable
          onClose={() => { setForm(defaultForm); setActiveTemplate(null); }}
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      {/* Tabs + Form */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="line"
        size="middle"
        style={{ marginBottom: 24 }}
      />

      {/* Generate button */}
      <Button
        id="generate-btn"
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleGenerate}
        icon={<ThunderboltOutlined />}
        style={{ height: 52, borderRadius: 12, fontWeight: 700, fontSize: 16, marginTop: 8 }}
      >
        {loading ? "Generating your proposal…" : "Generate Proposal + Payment Link"}
      </Button>
      <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 10, fontSize: 12 }}>
        Powered by Claude Opus 4.6 · Takes ~20–40 seconds
      </Text>
    </div>
  );
}
