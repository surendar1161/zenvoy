"use client";

import { useEffect, useState } from "react";
import {
  Badge, Button, Card, Col, DatePicker, Empty, Form, Input,
  InputNumber, Modal, Row, Select, Space, Spin, Switch, Table,
  Tag, Tooltip, Typography, message,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  PlusOutlined, DeleteOutlined, EyeOutlined, CopyOutlined,
  DollarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  SendOutlined, FileTextOutlined, SyncOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  draft: "default", sent: "blue", viewed: "cyan",
  paid: "green", overdue: "red", cancelled: "default",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  draft: <FileTextOutlined />, sent: <SendOutlined />, viewed: <EyeOutlined />,
  paid: <CheckCircleOutlined />, overdue: <ClockCircleOutlined />, cancelled: <DeleteOutlined />,
};
const CURRENCIES = ["USD","GBP","EUR","AUD","CAD","INR","SGD","AED"];

interface LineItem { description: string; quantity: number; unit_price: number; amount: number; }
interface Invoice {
  id: string; invoice_number: string | null; title: string;
  client_id: string | null; currency: string; subtotal: number;
  tax_rate: number; tax_amount: number; discount: number; total: number;
  status: string; due_date: string | null; paid_at: string | null;
  payment_link: string | null; notes: string | null;
  is_recurring: boolean; recurrence: string | null;
  created_at: string;
  clients?: { name: string; company: string | null; email: string | null };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form]                  = Form.useForm();
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [msgApi, ctx]           = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invoices")
      .select("*, clients(name,company,email)")
      .order("created_at", { ascending: false });
    if (error) msgApi.error(error.message);
    else setInvoices((data ?? []) as Invoice[]);
    setLoading(false);
  }

  function updateLine(idx: number, field: keyof LineItem, val: string | number) {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const u = { ...item, [field]: val };
      u.amount = u.quantity * u.unit_price;
      return u;
    }));
  }

  const subtotal  = lineItems.reduce((s, l) => s + l.amount, 0);
  const taxRate   = Form.useWatch("tax_rate", form) ?? 0;
  const discount  = Form.useWatch("discount", form) ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total     = subtotal + taxAmount - discount;

  async function create() {
    const values = await form.validateFields();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const count = invoices.length + 1;
    const invNum = `INV-${String(count).padStart(4, "0")}`;

    const { data, error } = await supabase.from("invoices").insert({
      user_id:        user.id,
      client_id:      selectedClient?.id ?? null,
      invoice_number: invNum,
      title:          values.title,
      line_items:     lineItems,
      subtotal, tax_rate: taxRate, tax_amount: taxAmount,
      discount, total,
      currency:       values.currency ?? "USD",
      status:         "draft",
      due_date:       values.due_date?.toISOString() ?? null,
      notes:          values.notes ?? null,
      payment_link:   values.payment_link ?? null,
      is_recurring:   values.is_recurring ?? false,
      recurrence:     values.is_recurring ? values.recurrence : null,
    }).select("*, clients(name,company,email)").single();

    setSaving(false);
    if (error) { msgApi.error(error.message); return; }
    setInvoices(prev => [data as Invoice, ...prev]);
    setOpen(false);
    form.resetFields();
    setLineItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
    setSelectedClient(null);
    msgApi.success(`Invoice ${invNum} created`);
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    const extra = status === "paid" ? { paid_at: new Date().toISOString() } : status === "sent" ? { sent_at: new Date().toISOString() } : {};
    await supabase.from("invoices").update({ status, ...extra }).eq("id", id);
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    msgApi.success("Status updated");
  }

  async function deleteInvoice(id: string) {
    Modal.confirm({
      title: "Delete invoice?", okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("invoices").delete().eq("id", id);
        setInvoices(prev => prev.filter(i => i.id !== id));
        msgApi.success("Deleted");
      },
    });
  }

  // Summary stats
  const total_outstanding = invoices.filter(i => ["sent","viewed","overdue"].includes(i.status)).reduce((s, i) => s + i.total, 0);
  const total_paid        = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const overdue_count     = invoices.filter(i => i.status === "overdue" || (i.due_date && new Date(i.due_date) < new Date() && i.status !== "paid")).length;
  const cur               = invoices[0]?.currency ?? "USD";

  const columns: TableColumnsType<Invoice> = [
    {
      title: "Invoice", key: "title",
      render: (_, i) => (
        <div>
          <Space size={6}>
            <Text strong style={{ fontSize: 13 }}>{i.invoice_number}</Text>
            {i.is_recurring && <Tooltip title={`Recurring ${i.recurrence}`}><SyncOutlined style={{ color: "#0ea5e9", fontSize: 12 }} /></Tooltip>}
          </Space>
          <Text style={{ display: "block", fontSize: 13, color: "#374151" }}>{i.title}</Text>
          {i.clients && <Text type="secondary" style={{ fontSize: 12 }}>{i.clients.name}{i.clients.company ? ` · ${i.clients.company}` : ""}</Text>}
        </div>
      ),
    },
    {
      title: "Amount", key: "total", width: 140,
      render: (_, i) => <Text strong style={{ color: "#10b981", fontSize: 15 }}>{i.currency} {i.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: "Status", key: "status", width: 130,
      render: (_, i) => (
        <Tag color={STATUS_COLOR[i.status]} icon={STATUS_ICON[i.status]} style={{ borderRadius: 20, fontSize: 12, textTransform: "capitalize" }}>
          {i.status}
        </Tag>
      ),
    },
    {
      title: "Due Date", key: "due_date", width: 120,
      render: (_, i) => {
        if (!i.due_date) return <Text type="secondary">—</Text>;
        const overdue = new Date(i.due_date) < new Date() && i.status !== "paid";
        return <Text style={{ fontSize: 13, color: overdue ? "#ef4444" : "#374151", fontWeight: overdue ? 700 : 400 }}>{dayjs(i.due_date).format("MMM D, YYYY")}</Text>;
      },
    },
    {
      title: "Actions", key: "actions", width: 240,
      render: (_, i) => (
        <Space size={6}>
          <Link href={`/invoices/${i.id}`}>
            <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: 6 }}>View</Button>
          </Link>
          <Select size="small" value={i.status} style={{ width: 110 }}
            onChange={v => updateStatus(i.id, v)}
            options={["draft","sent","viewed","paid","overdue","cancelled"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
          {i.payment_link && (
            <Tooltip title="Copy payment link">
              <Button size="small" type="text" icon={<CopyOutlined />}
                onClick={() => { navigator.clipboard.writeText(i.payment_link!); msgApi.success("Link copied"); }} />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteInvoice(i.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <DollarOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Invoices</Title>
            <Tag style={{ borderRadius: 20 }}>{invoices.length} total</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Standalone invoices — create, send, and track payments for any client.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setOpen(true)} style={{ borderRadius: 10, fontWeight: 600 }}>
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
        {[
          { label: "Outstanding",    value: `${cur} ${total_outstanding.toLocaleString()}`, color: "#f59e0b", bg: "#fffbeb", icon: <ClockCircleOutlined /> },
          { label: "Collected",      value: `${cur} ${total_paid.toLocaleString()}`,        color: "#10b981", bg: "#f0fdf4", icon: <CheckCircleOutlined /> },
          { label: "Overdue",        value: String(overdue_count),                           color: "#ef4444", bg: "#fff1f2", icon: <ClockCircleOutlined /> },
          { label: "Total Invoices", value: String(invoices.length),                         color: "#0ea5e9", bg: "#eff6ff", icon: <FileTextOutlined /> },
        ].map(s => (
          <Col key={s.label} xs={12} sm={6}>
            <Card style={{ borderRadius: 14, border: `1.5px solid ${s.color}25`, background: s.bg }} styles={{ body: { padding: 18 } }}>
              <Space>
                <span style={{ color: s.color, fontSize: 18 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
      ) : invoices.length === 0 ? (
        <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <DollarOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No invoices yet</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>Create your first invoice and send it directly to your client.</Text>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setOpen(true)} style={{ borderRadius: 12 }}>Create First Invoice</Button>
        </Card>
      ) : (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          <Table dataSource={invoices} columns={columns} rowKey="id" pagination={{ pageSize: 20 }} />
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        open={open} onCancel={() => setOpen(false)}
        title={<Space><DollarOutlined style={{ color: "#0ea5e9" }} />New Invoice</Space>}
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={create} style={{ borderRadius: 8, fontWeight: 600 }}>Create Invoice</Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          {/* Client */}
          <Form.Item label={<Text strong style={{ fontSize: 13 }}>Client</Text>}>
            <ClientSelect
              onSelect={c => { setSelectedClient(c); if (c) form.setFieldsValue({ title: c.company ? `Services — ${c.company}` : `Services — ${c.name}` }); }}
              placeholder="Select a client…"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="title" label={<Text strong style={{ fontSize: 13 }}>Invoice Title *</Text>} rules={[{ required: true }]}>
                <Input placeholder="Website Design — Phase 1" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="currency" label={<Text strong style={{ fontSize: 13 }}>Currency</Text>} initialValue="USD">
                <Select options={CURRENCIES.map(c => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
          </Row>

          {/* Line items */}
          <Text strong style={{ display: "block", marginBottom: 10, fontSize: 13 }}>Line Items</Text>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 12 }}>
            {lineItems.map((item, idx) => (
              <Row gutter={[8, 0]} key={idx} style={{ marginBottom: 8, alignItems: "center" }}>
                <Col span={10}><Input placeholder="Description" value={item.description} onChange={e => updateLine(idx, "description", e.target.value)} style={{ borderRadius: 6 }} /></Col>
                <Col span={4}><InputNumber placeholder="Qty" value={item.quantity} min={1} onChange={v => updateLine(idx, "quantity", v ?? 1)} style={{ width: "100%", borderRadius: 6 }} /></Col>
                <Col span={5}><InputNumber placeholder="Rate" value={item.unit_price} min={0} prefix="$" onChange={v => updateLine(idx, "unit_price", v ?? 0)} style={{ width: "100%", borderRadius: 6 }} /></Col>
                <Col span={4}><Text strong style={{ display: "block", textAlign: "right", color: "#10b981", fontSize: 14 }}>${item.amount.toFixed(2)}</Text></Col>
                <Col span={1}>
                  {lineItems.length > 1 && <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => setLineItems(p => p.filter((_, i) => i !== idx))} />}
                </Col>
              </Row>
            ))}
            <Button size="small" icon={<PlusOutlined />} onClick={() => setLineItems(p => [...p, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}>Add Line</Button>
          </div>

          {/* Totals */}
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Form.Item name="tax_rate" label="Tax %" style={{ marginBottom: 0 }}><InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="0" /></Form.Item></Col>
              <Col span={8}><Form.Item name="discount" label="Discount ($)" style={{ marginBottom: 0 }}><InputNumber min={0} style={{ width: "100%" }} placeholder="0" /></Form.Item></Col>
              <Col span={8} style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ paddingBottom: 1 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Total</Text>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#10b981" }}>
                    ${total.toFixed(2)}
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="due_date" label={<Text strong style={{ fontSize: 13 }}>Due Date</Text>}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} disabledDate={d => d < dayjs().startOf("day")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payment_link" label={<Text strong style={{ fontSize: 13 }}>Payment Link (Stripe)</Text>}>
                <Input placeholder="https://buy.stripe.com/…" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label={<Text strong style={{ fontSize: 13 }}>Notes / Payment Terms</Text>}>
            <Input.TextArea rows={2} placeholder="Payment due within 14 days. Bank transfer or card accepted." style={{ borderRadius: 8 }} />
          </Form.Item>

          {/* Recurring */}
          <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 16 } }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <SyncOutlined style={{ color: "#0ea5e9" }} />
              <Text strong>Recurring Invoice</Text>
              <Form.Item name="is_recurring" valuePropName="checked" style={{ margin: 0 }}>
                <Switch size="small" />
              </Form.Item>
            </div>
            <Form.Item noStyle shouldUpdate={(p, c) => p.is_recurring !== c.is_recurring}>
              {({ getFieldValue }) => getFieldValue("is_recurring") && (
                <Form.Item name="recurrence" label="Frequency" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                  <Select options={["weekly","monthly","quarterly","yearly"].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} placeholder="Select frequency" />
                </Form.Item>
              )}
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
