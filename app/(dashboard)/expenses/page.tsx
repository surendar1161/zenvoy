"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, DatePicker, Empty, Form, Input,
  InputNumber, Modal, Row, Select, Space, Spin, Switch,
  Table, Tag, Tooltip, Typography, Upload, message,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  PlusOutlined, DeleteOutlined, WalletOutlined,
  SearchOutlined, UploadOutlined, LinkOutlined,
  EditOutlined, SyncOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const CURRENCIES = ["USD", "GBP", "EUR", "AUD", "CAD", "INR", "SGD", "AED"];

const CATEGORIES: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  software:      { label: "Software",      color: "#3b82f6", bg: "#eff6ff", emoji: "💻" },
  hardware:      { label: "Hardware",      color: "#6366f1", bg: "#eef2ff", emoji: "🖥️" },
  travel:        { label: "Travel",        color: "#8b5cf6", bg: "#f5f3ff", emoji: "✈️" },
  office:        { label: "Office",        color: "#0ea5e9", bg: "#f0f9ff", emoji: "🏢" },
  marketing:     { label: "Marketing",     color: "#f59e0b", bg: "#fffbeb", emoji: "📢" },
  education:     { label: "Education",     color: "#10b981", bg: "#f0fdf4", emoji: "📚" },
  subscriptions: { label: "Subscriptions", color: "#ec4899", bg: "#fdf2f8", emoji: "🔄" },
  meals:         { label: "Meals",         color: "#f97316", bg: "#fff7ed", emoji: "🍽️" },
  other:         { label: "Other",         color: "#94a3b8", bg: "#f8fafc", emoji: "📎" },
};

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  receipt_url: string | null;
  notes: string | null;
  vendor: string | null;
  client_id: string | null;
  is_recurring: boolean;
  recurrence: string | null;
  created_at: string;
  clients?: { name: string; company: string | null } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("expenses")
      .select("*, clients(name,company)")
      .order("date", { ascending: false });
    if (error) msgApi.error(error.message);
    else setExpenses((data ?? []) as Expense[]);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setSelectedClient(null);
    setReceiptFile(null);
    form.resetFields();
    form.setFieldsValue({ currency: "USD", category: "other", date: dayjs() });
    setOpen(true);
  }

  function openEdit(exp: Expense) {
    setEditingId(exp.id);
    setReceiptFile(null);
    setSelectedClient(exp.clients ? { id: exp.client_id!, name: exp.clients.name, email: "", company: exp.clients.company } as ClientOption : null);
    form.setFieldsValue({
      title: exp.title,
      amount: exp.amount,
      currency: exp.currency,
      category: exp.category,
      date: dayjs(exp.date),
      vendor: exp.vendor,
      notes: exp.notes,
      is_recurring: exp.is_recurring,
      recurrence: exp.recurrence,
    });
    setOpen(true);
  }

  async function save() {
    const values = await form.validateFields();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    let receipt_url: string | null = null;
    if (receiptFile) {
      const ext = receiptFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("expense-receipts").upload(path, receiptFile);
      if (upErr) {
        msgApi.error("Receipt upload failed: " + upErr.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("expense-receipts").getPublicUrl(path);
      receipt_url = urlData.publicUrl;
    }

    const payload = {
      user_id: user.id,
      title: values.title,
      amount: values.amount,
      currency: values.currency ?? "USD",
      category: values.category ?? "other",
      date: values.date ? values.date.format("YYYY-MM-DD") : new Date().toISOString().split("T")[0],
      vendor: values.vendor || null,
      notes: values.notes || null,
      client_id: selectedClient?.id ?? null,
      is_recurring: values.is_recurring ?? false,
      recurrence: values.is_recurring ? (values.recurrence ?? null) : null,
      ...(receipt_url ? { receipt_url } : {}),
    };

    if (editingId) {
      const { data, error } = await supabase
        .from("expenses")
        .update(payload)
        .eq("id", editingId)
        .select("*, clients(name,company)")
        .single();
      if (error) msgApi.error(error.message);
      else {
        setExpenses(prev => prev.map(e => e.id === editingId ? data as Expense : e));
        msgApi.success("Expense updated");
      }
    } else {
      const { data, error } = await supabase
        .from("expenses")
        .insert(payload)
        .select("*, clients(name,company)")
        .single();
      if (error) msgApi.error(error.message);
      else {
        setExpenses(prev => [data as Expense, ...prev]);
        msgApi.success("Expense added");
      }
    }
    setSaving(false);
    setOpen(false);
  }

  function deleteExpense(id: string) {
    Modal.confirm({
      title: "Delete this expense?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("expenses").delete().eq("id", id);
        setExpenses(prev => prev.filter(e => e.id !== id));
        msgApi.success("Expense deleted");
      },
    });
  }

  // Filtering
  const filtered = expenses.filter(e => {
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.vendor ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.clients?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Stats
  const now = dayjs();
  const thisMonth = expenses.filter(e => dayjs(e.date).isSame(now, "month")).reduce((s, e) => s + e.amount, 0);
  const thisYear = expenses.filter(e => dayjs(e.date).isSame(now, "year")).reduce((s, e) => s + e.amount, 0);
  const monthsElapsed = now.month() + 1;
  const avgMonthly = monthsElapsed > 0 ? thisYear / monthsElapsed : 0;
  const categoriesUsed = new Set(expenses.map(e => e.category)).size;
  const currency = expenses[0]?.currency ?? "USD";

  const columns: TableColumnsType<Expense> = [
    {
      title: "Expense",
      dataIndex: "title",
      key: "title",
      render: (title: string, rec: Expense) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{title}</Text>
          {rec.vendor && <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{rec.vendor}</Text>}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: Expense, b: Expense) => a.amount - b.amount,
      render: (amt: number, rec: Expense) => (
        <Text strong style={{ color: "#ef4444", fontSize: 14 }}>{rec.currency} {amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => {
        const c = CATEGORIES[cat] ?? CATEGORIES.other;
        return <Tag style={{ borderRadius: 20, fontSize: 11, color: c.color, borderColor: `${c.color}40`, background: c.bg }}>{c.emoji} {c.label}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: Expense, b: Expense) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (d: string) => <Text type="secondary" style={{ fontSize: 13 }}>{dayjs(d).format("MMM D, YYYY")}</Text>,
    },
    {
      title: "Client",
      key: "client",
      render: (_: unknown, rec: Expense) => rec.clients?.name ? <Text style={{ fontSize: 13 }}>{rec.clients.name}</Text> : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
    },
    {
      title: "",
      key: "actions",
      width: 140,
      render: (_: unknown, rec: Expense) => (
        <Space>
          {rec.receipt_url && (
            <Tooltip title="View receipt">
              <a href={rec.receipt_url} target="_blank" rel="noopener noreferrer">
                <Button type="text" size="small" icon={<LinkOutlined />} />
              </a>
            </Tooltip>
          )}
          {rec.is_recurring && (
            <Tooltip title={`Recurring: ${rec.recurrence}`}>
              <SyncOutlined style={{ color: "#8b5cf6", fontSize: 14 }} />
            </Tooltip>
          )}
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(rec)} />
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteExpense(rec.id)} />
        </Space>
      ),
    },
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <Space size={12}>
          <WalletOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Expenses</Title>
          <Tag style={{ borderRadius: 20, fontSize: 12 }}>{expenses.length}</Tag>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={openCreate}
          style={{ borderRadius: 10, fontWeight: 600, height: 44 }}>
          Add Expense
        </Button>
      </div>

      {/* Summary stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
        {[
          { label: "This Month", value: `${currency} ${thisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "#ef4444" },
          { label: "This Year", value: `${currency} ${thisYear.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "#f59e0b" },
          { label: "Avg Monthly", value: `${currency} ${avgMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "#8b5cf6" },
          { label: "Categories", value: String(categoriesUsed), color: "#0ea5e9" },
        ].map(s => (
          <Col key={s.label} xs={12} sm={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: 18 } }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{s.label}</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Space wrap size={12} style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 260, borderRadius: 10 }}
        />
        <Select
          placeholder="All categories"
          allowClear
          value={categoryFilter ?? undefined}
          onChange={v => setCategoryFilter(v ?? null)}
          style={{ width: 180 }}
          options={Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: `${v.emoji} ${v.label}` }))}
        />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {filtered.length} of {expenses.length} expenses
        </Text>
      </Space>

      {/* Table */}
      {expenses.length === 0 ? (
        <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
          <WalletOutlined style={{ fontSize: 56, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No expenses yet</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>Start tracking your business expenses for tax reports and profit visibility.</Text>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreate} style={{ borderRadius: 10 }}>Add Your First Expense</Button>
        </Card>
      ) : (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 20, showSizeChanger: false }}
            style={{ borderRadius: 16 }}
          />
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={editingId ? "Edit Expense" : "Add Expense"}
        width={580}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={save}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            {editingId ? "Update" : "Add Expense"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Expense Title" rules={[{ required: true, message: "Title is required" }]}>
            <Input placeholder="e.g. Figma Pro subscription" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Amount is required" }]}>
                <InputNumber min={0} placeholder="0.00" style={{ width: "100%", borderRadius: 8 }}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label="Currency">
                <Select options={CURRENCIES.map(c => ({ value: c, label: c }))} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select options={Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: `${v.emoji} ${v.label}` }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="vendor" label="Vendor / Merchant">
            <Input placeholder="e.g. Adobe, Uber, WeWork" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Client (optional)">
            <ClientSelect
              value={selectedClient?.id}
              size="middle"
              onSelect={(client: ClientOption | null) => setSelectedClient(client)}
              placeholder="Link to a client…"
            />
          </Form.Item>

          <Form.Item label="Receipt">
            <Upload
              beforeUpload={file => { setReceiptFile(file); return false; }}
              onRemove={() => setReceiptFile(null)}
              maxCount={1}
              fileList={receiptFile ? [{ uid: "-1", name: receiptFile.name, status: "done" }] : []}
            >
              <Button icon={<UploadOutlined />} style={{ borderRadius: 8 }}>Upload Receipt</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Additional details..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Card size="small" style={{ borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Space>
                <SyncOutlined style={{ color: "#8b5cf6" }} />
                <Text style={{ fontSize: 13, fontWeight: 600 }}>Recurring expense</Text>
              </Space>
              <Form.Item name="is_recurring" valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </Space>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.is_recurring !== cur.is_recurring}>
              {({ getFieldValue }) =>
                getFieldValue("is_recurring") ? (
                  <Form.Item name="recurrence" style={{ marginTop: 12, marginBottom: 0 }}>
                    <Select placeholder="Frequency"
                      options={[
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                        { value: "yearly", label: "Yearly" },
                      ]} />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
