"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Avatar, Button, Card, Col, ColorPicker, Descriptions, Divider,
  Form, Input, Modal, Radio, Row, Select, Space, Switch, Table,
  Tabs, Tag, Typography, Upload, message,
} from "antd";
import type { Color } from "antd/es/color-picker";
import type { TableColumnsType } from "antd";
import {
  UserOutlined, MailOutlined, LockOutlined, LogoutOutlined,
  CopyOutlined, TeamOutlined, PlusOutlined, DeleteOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined,
  BgColorsOutlined, FontSizeOutlined, UploadOutlined, SaveOutlined,
  EyeOutlined, EyeInvisibleOutlined, ArrowRightOutlined, CheckCircleFilled,
  DollarOutlined, CreditCardOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import type { BrandKit } from "@/lib/brand";
import { DEFAULT_BRAND, FONT_OPTIONS, loadBrand, saveBrand } from "@/lib/brand";
import dynamic from "next/dynamic";
const ProposalCover = dynamic(() => import("@/components/ProposalCover"), { ssr: false });

const PRESET_PALETTES = [
  { name: "Ocean",   primary: "#0ea5e9", secondary: "#0369a1" },
  { name: "Violet",  primary: "#7c3aed", secondary: "#5b21b6" },
  { name: "Emerald", primary: "#059669", secondary: "#065f46" },
  { name: "Rose",    primary: "#e11d48", secondary: "#9f1239" },
  { name: "Slate",   primary: "#334155", secondary: "#0f172a" },
  { name: "Amber",   primary: "#d97706", secondary: "#92400e" },
];
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const { Title, Text } = Typography;

const ROLE_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  freelancer_member: { label: "Team Member", color: "#0ea5e9", desc: "Full dashboard access — proposals, contracts, clients, projects" },
  client_member:     { label: "Client Member", color: "#7c3aed", desc: "Portal access only — can view client portals and communicate" },
  admin:             { label: "Admin", color: "#10b981", desc: "Full access including team management and billing" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  invited:   { label: "Invited",   color: "blue",    icon: <ClockCircleOutlined /> },
  active:    { label: "Active",    color: "green",   icon: <CheckCircleOutlined /> },
  suspended: { label: "Suspended", color: "default", icon: <StopOutlined /> },
};

interface TeamMember {
  id: string; email: string; name: string | null; role: string;
  status: string; invited_at: string; accepted_at: string | null;
  permissions: Record<string, boolean>;
}

const DEFAULT_PERMISSIONS = {
  proposals: true, contracts: true, clients: true,
  projects: true, invoices: true, portals: false,
};

export default function SettingsPageWrapper() {
  return <Suspense><SettingsPage /></Suspense>;
}

function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "profile";
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting]     = useState(false);
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMISSIONS });
  const [msgApi, ctx] = message.useMessage();
  const [form]   = Form.useForm();
  const [pwForm] = Form.useForm();
  const [invForm] = Form.useForm();
  const [brand, setBrand] = useState<BrandKit>(DEFAULT_BRAND);
  const [brandPreview, setBrandPreview] = useState(false);

  function setBrandField<K extends keyof BrandKit>(key: K, value: BrandKit[K]) {
    setBrand(b => ({ ...b, [key]: value }));
  }
  function handleLogoUpload(file: File) {
    if (file.size > 500_000) { msgApi.error("Logo must be under 500 KB"); return false; }
    const reader = new FileReader();
    reader.onload = ev => setBrandField("logoUrl", ev.target?.result as string ?? null);
    reader.readAsDataURL(file);
    return false;
  }
  function saveBrandKit() { saveBrand(brand); msgApi.success("Brand kit saved!"); }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      form.setFieldsValue({ fullName: data.user?.user_metadata?.full_name ?? "", email: data.user?.email });
    });
    setBrand(loadBrand());
    loadMembers();
  }, [form]);

  async function loadMembers() {
    const supabase = createClient();
    const { data } = await supabase.from("team_members").select("*").order("invited_at", { ascending: false });
    setMembers((data ?? []) as TeamMember[]);
  }

  async function updateProfile(values: { fullName: string }) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: values.fullName } });
    if (error) msgApi.error(error.message);
    else { msgApi.success("Profile updated!"); }
    setLoading(false);
  }

  async function updatePassword({ password }: { password: string }) {
    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) msgApi.error(error.message);
    else { msgApi.success("Password updated!"); pwForm.resetFields(); }
    setPwLoading(false);
  }

  async function inviteMember() {
    const values = await invForm.validateFields();
    setInviting(true);
    const supabase = createClient();
    const { data: { user: me } } = await supabase.auth.getUser();
    if (!me) { setInviting(false); return; }

    const { data, error } = await supabase.from("team_members").insert({
      owner_id: me.id,
      email:    values.email,
      name:     values.name ?? null,
      role:     values.role,
      status:   "invited",
      permissions,
    }).select().single();

    setInviting(false);
    if (error) { msgApi.error(error.message); return; }
    setMembers(prev => [data as TeamMember, ...prev]);
    setInviteOpen(false);
    invForm.resetFields();
    setPermissions({ ...DEFAULT_PERMISSIONS });
    msgApi.success(`Invitation created for ${values.email}`);
  }

  async function updateMemberStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("team_members").update({ status }).eq("id", id);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    msgApi.success("Member updated");
  }

  async function removeMember(id: string, email: string) {
    Modal.confirm({
      title: `Remove ${email}?`,
      content: "They will lose all access immediately.",
      okText: "Remove", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("team_members").delete().eq("id", id);
        setMembers(prev => prev.filter(m => m.id !== id));
        msgApi.success("Member removed");
      },
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const columns: TableColumnsType<TeamMember> = [
    {
      title: "Member", key: "member",
      render: (_, m) => (
        <Space size={10}>
          <Avatar style={{ background: ROLE_CONFIG[m.role]?.color + "30", color: ROLE_CONFIG[m.role]?.color, fontWeight: 700 }}>
            {(m.name ?? m.email)[0].toUpperCase()}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>{m.name ?? "—"}</Text>
            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{m.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Role", key: "role", width: 160,
      render: (_, m) => (
        <Tag style={{ borderRadius: 20, fontSize: 12, color: ROLE_CONFIG[m.role]?.color, borderColor: `${ROLE_CONFIG[m.role]?.color}40`, background: `${ROLE_CONFIG[m.role]?.color}12` }}>
          {ROLE_CONFIG[m.role]?.label}
        </Tag>
      ),
    },
    {
      title: "Status", key: "status", width: 120,
      render: (_, m) => (
        <Tag color={STATUS_CONFIG[m.status]?.color} icon={STATUS_CONFIG[m.status]?.icon} style={{ borderRadius: 20, fontSize: 12, textTransform: "capitalize" }}>
          {STATUS_CONFIG[m.status]?.label}
        </Tag>
      ),
    },
    {
      title: "Permissions", key: "permissions",
      render: (_, m) => (
        <Space wrap size={4}>
          {Object.entries(m.permissions ?? {}).filter(([, v]) => v).map(([k]) => (
            <Tag key={k} style={{ borderRadius: 20, fontSize: 10, padding: "0 6px", textTransform: "capitalize" }}>{k}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Invited", key: "invited_at", width: 110,
      render: (_, m) => <Text type="secondary" style={{ fontSize: 12 }}>{new Date(m.invited_at).toLocaleDateString()}</Text>,
    },
    {
      key: "actions", width: 120,
      render: (_, m) => (
        <Space>
          <Select size="small" value={m.status} style={{ width: 110 }}
            onChange={v => updateMemberStatus(m.id, v)}
            options={[
              { value: "invited",   label: "Invited" },
              { value: "active",    label: "Active" },
              { value: "suspended", label: "Suspended" },
            ]} />
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeMember(m.id, m.email)} />
        </Space>
      ),
    },
  ];


  const tabItems = [
    {
      key: "profile",
      label: <Space><UserOutlined />Profile</Space>,
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }} styles={{ body: { padding: 28 } }}>
              <Title level={5} style={{ margin: "0 0 20px" }}><Space><UserOutlined style={{ color: "#0ea5e9" }} />Profile</Space></Title>
              {user && (
                <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
                  <Descriptions.Item label="Email">
                    <Space>
                      <Text>{user.email}</Text>
                      {user.email_confirmed_at && <Tag color="green" style={{ borderRadius: 20 }}>Verified</Tag>}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Account ID">
                    <Text copyable style={{ fontSize: 12, color: "#94a3b8" }}>{user.id.slice(0, 8)}…</Text>
                  </Descriptions.Item>
                </Descriptions>
              )}
              <Form form={form} layout="vertical" onFinish={updateProfile} size="large">
                <Form.Item name="fullName" label={<Text strong style={{ fontSize: 13 }}>Full Name</Text>}>
                  <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="Your name" style={{ borderRadius: 10, height: 44 }} />
                </Form.Item>
                <Form.Item name="email" label={<Text strong style={{ fontSize: 13 }}>Email</Text>}>
                  <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} disabled style={{ borderRadius: 10, height: 44 }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 10, fontWeight: 600 }}>Save Profile</Button>
              </Form>
            </Card>

            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 28 } }}>
              <Title level={5} style={{ margin: "0 0 20px" }}><Space><LockOutlined style={{ color: "#7c3aed" }} />Change Password</Space></Title>
              <Form form={pwForm} layout="vertical" onFinish={updatePassword} size="large">
                <Form.Item name="password" label={<Text strong style={{ fontSize: 13 }}>New Password</Text>}
                  rules={[{ required: true }, { min: 8, message: "Minimum 8 characters" }]}>
                  <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="New password" style={{ borderRadius: 10, height: 44 }} />
                </Form.Item>
                <Form.Item name="confirm" label={<Text strong style={{ fontSize: 13 }}>Confirm Password</Text>}
                  dependencies={["password"]}
                  rules={[{ required: true }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve();
                      return Promise.reject("Passwords do not match");
                    },
                  })]}>
                  <Input.Password prefix={<LockOutlined style={{ color: "#94a3b8" }} />} placeholder="Confirm" style={{ borderRadius: 10, height: 44 }} />
                </Form.Item>
                <Button htmlType="submit" loading={pwLoading} style={{ borderRadius: 10, fontWeight: 600 }}>Update Password</Button>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
              <Title level={5} style={{ margin: "0 0 16px" }}>Account</Title>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                  <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>ACCOUNT ID</Text>
                  <Text copyable style={{ fontSize: 12, fontFamily: "monospace", color: "#374151" }}>{user?.id ?? "—"}</Text>
                </div>
                <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                  <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>MEMBER SINCE</Text>
                  <Text style={{ fontSize: 13 }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  </Text>
                </div>
                <Link href="/subscription">
                  <Button block icon={<CreditCardOutlined />} style={{ borderRadius: 10, fontWeight: 600 }}>
                    Manage Subscription
                  </Button>
                </Link>
              </Space>
            </Card>
            <Card style={{ borderRadius: 16, border: "1px solid #fee2e2", background: "#fff5f5" }} styles={{ body: { padding: 20 } }}>
              <Title level={5} style={{ margin: "0 0 8px", color: "#dc2626" }}><Space><LogoutOutlined />Sign Out</Space></Title>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 14 }}>You will be redirected to the sign-in page.</Text>
              <Button danger block onClick={handleSignOut} icon={<LogoutOutlined />} style={{ borderRadius: 10, fontWeight: 600 }}>Sign Out</Button>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "payments",
      label: <Space><DollarOutlined />Payments</Space>,
      children: (
        <div style={{ maxWidth: 700 }}>
          <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>Stripe Payment Setup</Text>
          <Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 24 }}>
            DealPilot uses your own Stripe account — payments go directly to you. No platform fees.
          </Text>

          {/* How it works */}
          <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>How payment links work</Text>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {[
                { step: "1", title: "Create a Stripe account", desc: "Sign up free at stripe.com. No monthly fees — Stripe charges 2.9% + 30¢ per transaction only when you get paid.", link: "https://stripe.com", linkLabel: "stripe.com →" },
                { step: "2", title: "Create a Payment Link", desc: `Go to Stripe Dashboard → Payment Links → Create link. Set the amount to your deposit amount (e.g. 50% of the project total), give it a name like "Project Deposit".`, link: "https://dashboard.stripe.com/payment-links", linkLabel: "Open Stripe Dashboard →" },
                { step: "3", title: "Copy and paste into DealPilot", desc: "Copy the payment link URL (looks like https://buy.stripe.com/...) and paste it into the Deposit Payment Link field when creating a proposal.", link: null, linkLabel: null },
                { step: "4", title: "Client pays directly to you", desc: "When the client opens your proposal, they see a Pay Now button. Clicking it takes them to your Stripe checkout. Money lands in your Stripe account within 2 business days.", link: null, linkLabel: null },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Text style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{s.step}</Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 14, display: "block", marginBottom: 3 }}>{s.title}</Text>
                    <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>{s.desc}</Text>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 4, fontSize: 13, color: "#0ea5e9", fontWeight: 600 }}>
                        {s.linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </Space>
          </Card>

          {/* Tips */}
          <Card style={{ borderRadius: 14, border: "1px solid #dbeafe", background: "#eff6ff" }} styles={{ body: { padding: 20 } }}>
            <Text strong style={{ color: "#1d4ed8", display: "block", marginBottom: 10 }}>💡 Tips for payment links</Text>
            <Space direction="vertical" size={6}>
              {[
                "Create one payment link per standard deposit amount (e.g. $500, $1000, $2500) and reuse them",
                "Or create a new link for each proposal with the exact deposit amount",
                "You can also create milestone payment links — paste them into the Milestone section of each proposal",
                "For recurring clients, save their payment link in their client profile",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Text style={{ color: "#0369a1", fontSize: 14 }}>•</Text>
                  <Text style={{ fontSize: 13, color: "#1e40af" }}>{tip}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </div>
      ),
    },
    {
      key: "team",
      label: (
        <Space>
          <TeamOutlined />
          Team
          {members.length > 0 && <Tag style={{ borderRadius: 20, fontSize: 10 }}>{members.length}</Tag>}
        </Space>
      ),
      children: (
        <div>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>Team Members</Text>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Invite freelancer collaborators or client team members to your account. Each role has different access levels.
              </Text>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setInviteOpen(true)} style={{ borderRadius: 10, fontWeight: 600 }}>
              Invite Member
            </Button>
          </div>

          {/* Role legend */}
          <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <Col key={key} xs={24} sm={8}>
                <Card style={{ borderRadius: 12, border: `1.5px solid ${cfg.color}25`, background: `${cfg.color}08` }} styles={{ body: { padding: 16 } }}>
                  <Tag style={{ borderRadius: 20, fontSize: 12, color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}15`, marginBottom: 8 }}>{cfg.label}</Tag>
                  <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{cfg.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Members table */}
          <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
            {members.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 40px" }}>
                <TeamOutlined style={{ fontSize: 56, color: "#cbd5e1", marginBottom: 16 }} />
                <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No team members yet</Title>
                <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
                  Invite collaborators to work alongside you, or add client-side members who need portal access.
                </Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setInviteOpen(true)} style={{ borderRadius: 10 }}>
                  Invite First Member
                </Button>
              </div>
            ) : (
              <Table dataSource={members} columns={columns} rowKey="id" pagination={false} />
            )}
          </Card>
        </div>
      ),
    },
    {
      key: "brand",
      label: <Space><BgColorsOutlined />Brand Kit</Space>,
      children: (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>Brand Kit</Text>
              <Text type="secondary" style={{ fontSize: 14 }}>Your logo, colours, and font — applied to every proposal. Clients never see DealPilot branding.</Text>
            </div>
            <Space>
              <Button icon={brandPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setBrandPreview(p => !p)}>
                {brandPreview ? "Hide Preview" : "Preview Cover"}
              </Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={saveBrandKit} style={{ fontWeight: 600 }}>Save Brand Kit</Button>
            </Space>
          </div>

          <Row gutter={[28, 28]}>
            <Col xs={24} lg={brandPreview ? 12 : 16}>
              <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 32 } }}>
                <Form layout="vertical" size="large">
                  {/* Logo */}
                  <Form.Item label={<Space><BgColorsOutlined /><Text strong>Logo</Text></Space>}>
                    <Space align="start" size={16}>
                      <div style={{ width: 80, height: 80, borderRadius: 14, border: "2px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", overflow: "hidden", flexShrink: 0 }}>
                        {brand.logoUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={brand.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                          : <span style={{ fontSize: 28 }}>🏢</span>}
                      </div>
                      <div>
                        <Upload beforeUpload={f => handleLogoUpload(f)} showUploadList={false} accept="image/*">
                          <Button icon={<UploadOutlined />}>{brand.logoUrl ? "Change Logo" : "Upload Logo"}</Button>
                        </Upload>
                        {brand.logoUrl && <Button type="link" danger style={{ padding: "4px 0", display: "block" }} onClick={() => setBrandField("logoUrl", null)}>Remove</Button>}
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>PNG, SVG, JPG · Max 500 KB</Text>
                      </div>
                    </Space>
                    <Form.Item label="Company / Studio Name" style={{ marginTop: 16, marginBottom: 0 }}>
                      <Input placeholder="Your studio name" value={brand.companyName} onChange={e => setBrandField("companyName", e.target.value)} style={{ borderRadius: 8 }} />
                    </Form.Item>
                  </Form.Item>

                  <Divider />

                  {/* Colours */}
                  <Form.Item label={<Space><BgColorsOutlined /><Text strong>Brand Colours</Text></Space>}>
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 10 }}>Quick presets:</Text>
                    <Space wrap style={{ marginBottom: 20 }}>
                      {PRESET_PALETTES.map(p => (
                        <Tag key={p.name} style={{ cursor: "pointer", borderRadius: 20, padding: "4px 12px", border: `2px solid ${brand.primaryColor === p.primary ? p.primary : "#e2e8f0"}`, fontWeight: brand.primaryColor === p.primary ? 700 : 400 }}
                          onClick={() => { setBrandField("primaryColor", p.primary); setBrandField("secondaryColor", p.secondary); }}>
                          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: p.primary, marginRight: 6, verticalAlign: "middle" }} />
                          {p.name}
                          {brand.primaryColor === p.primary && <CheckCircleFilled style={{ marginLeft: 6, color: p.primary }} />}
                        </Tag>
                      ))}
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Primary" style={{ marginBottom: 0 }}>
                          <ColorPicker value={brand.primaryColor} onChange={(c: Color) => setBrandField("primaryColor", c.toHexString())} showText size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Secondary" style={{ marginBottom: 0 }}>
                          <ColorPicker value={brand.secondaryColor} onChange={(c: Color) => setBrandField("secondaryColor", c.toHexString())} showText size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Divider />

                  {/* Font */}
                  <Form.Item label={<Space><FontSizeOutlined /><Text strong>Proposal Font</Text></Space>}>
                    <Radio.Group value={brand.fontFamily} onChange={e => setBrandField("fontFamily", e.target.value)} style={{ width: "100%" }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {FONT_OPTIONS.map(f => (
                          <Radio key={f.value} value={f.value} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${brand.fontFamily === f.value ? "#0ea5e9" : "#e2e8f0"}`, background: brand.fontFamily === f.value ? "#eff6ff" : "#fff", marginInlineEnd: 0 }}>
                            <Space style={{ marginLeft: 8 }}>
                              <span style={{ fontFamily: `'${f.value}', sans-serif`, fontWeight: 600, fontSize: 15 }}>{f.label}</span>
                              <Text type="secondary" style={{ fontSize: 12 }}>— {f.preview}</Text>
                            </Space>
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Card>

              <Card style={{ borderRadius: 14, marginTop: 16, border: "1px solid #dbeafe", background: "#eff6ff" }} styles={{ body: { padding: 18 } }}>
                <Space>
                  <CheckCircleFilled style={{ color: "#0ea5e9", fontSize: 18 }} />
                  <div>
                    <Text strong style={{ color: "#1d4ed8" }}>White-label included</Text>
                    <Text style={{ color: "#2563eb", display: "block", fontSize: 13 }}>Your logo and colours appear on every proposal. Clients never see DealPilot.</Text>
                  </div>
                </Space>
              </Card>
              <Link href="/generate" style={{ display: "block", marginTop: 16 }}>
                <Button type="primary" icon={<ArrowRightOutlined />} block size="large" style={{ borderRadius: 12, fontWeight: 600, height: 48 }}>Generate Branded Proposal</Button>
              </Link>
            </Col>

            {brandPreview && (
              <Col xs={24} lg={12}>
                <div style={{ position: "sticky", top: 80 }}>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8, textAlign: "center" }}>Live Cover Page Preview</Text>
                  <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }}>
                    <div style={{ background: "#1e293b", padding: "10px 16px", display: "flex", gap: 6, alignItems: "center" }}>
                      {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                    </div>
                    <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "161.3%", height: "auto" }}>
                      <ProposalCover clientName="Sarah Chen" clientCompany="Acme Corp" projectType="Website Redesign" freelancerName={brand.companyName || "Your Name"} freelancerTitle="Freelancer" brand={brand} />
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>Settings</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>Manage your account, team, and API configuration.</Text>
      </div>

      <Tabs size="large" items={tabItems} defaultActiveKey={defaultTab} />

      {/* Invite Modal */}
      <Modal
        open={inviteOpen} onCancel={() => setInviteOpen(false)}
        title={<Space><TeamOutlined style={{ color: "#0ea5e9" }} />Invite Team Member</Space>}
        width={560}
        footer={[
          <Button key="cancel" onClick={() => setInviteOpen(false)}>Cancel</Button>,
          <Button key="invite" type="primary" loading={inviting} onClick={inviteMember} style={{ borderRadius: 8, fontWeight: 600 }}>
            Send Invitation
          </Button>,
        ]}
      >
        <Form form={invForm} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label={<Text strong style={{ fontSize: 13 }}>Full Name</Text>}>
                <Input placeholder="Jane Smith" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label={<Text strong style={{ fontSize: 13 }}>Email *</Text>} rules={[{ required: true, type: "email" }]}>
                <Input placeholder="jane@example.com" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="role" label={<Text strong style={{ fontSize: 13 }}>Role *</Text>} rules={[{ required: true }]} initialValue="freelancer_member">
            <Select
              options={Object.entries(ROLE_CONFIG).map(([value, cfg]) => ({
                value, label: (
                  <Space>
                    <Tag style={{ borderRadius: 20, fontSize: 11, color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}12` }}>{cfg.label}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>{cfg.desc}</Text>
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          {/* Permissions */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 4 }}>
            <Text strong style={{ display: "block", marginBottom: 14, fontSize: 13 }}>Permissions</Text>
            <Row gutter={[12, 12]}>
              {Object.entries(permissions).map(([key, val]) => (
                <Col key={key} xs={12}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
                    <Text style={{ fontSize: 13, textTransform: "capitalize" }}>{key}</Text>
                    <Switch
                      size="small"
                      checked={val}
                      onChange={v => setPermissions(p => ({ ...p, [key]: v }))}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ background: "#eff6ff", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: "#1d4ed8" }}>
              💡 An invitation record will be created. Share the invite link with your team member to get them set up.
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
