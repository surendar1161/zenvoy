"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, DatePicker, Empty, Form, Input, Modal, Select, Space, Spin,
  Table, Tabs, Tag, Tooltip, Typography, message,
} from "antd";
import {
  CalendarOutlined, PlusOutlined, DeleteOutlined, EditOutlined,
  VideoCameraOutlined, LinkOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Booking {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  timezone: string | null;
  status: string;
  meeting_link: string | null;
  meeting_platform: string | null;
  client_name: string | null;
  client_email: string | null;
  notes: string | null;
  source: string;
  created_at: string;
  clients?: { name: string } | null;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: "blue", icon: <ClockCircleOutlined /> },
  confirmed: { color: "green", icon: <CheckCircleOutlined /> },
  completed: { color: "default", icon: <CheckCircleOutlined /> },
  cancelled: { color: "red", icon: <CloseCircleOutlined /> },
  no_show: { color: "orange", icon: <ExclamationCircleOutlined /> },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { loadBookings(tab); }, [tab]);

  async function loadBookings(t: string) {
    setLoading(true);
    const res = await fetch(`/api/bookings?tab=${t}`);
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  function openCreate() {
    setEditTarget(null);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(b: Booking) {
    setEditTarget(b);
    form.setFieldsValue({
      title: b.title,
      client_name: b.client_name ?? "",
      client_email: b.client_email ?? "",
      scheduled_at: b.scheduled_at ? dayjs(b.scheduled_at) : null,
      duration_minutes: b.duration_minutes,
      meeting_link: b.meeting_link ?? "",
      notes: b.notes ?? "",
      status: b.status,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    const values = await form.validateFields();
    setSaving(true);
    const payload = {
      title: values.title,
      client_name: values.client_name || null,
      client_email: values.client_email || null,
      scheduled_at: values.scheduled_at ? values.scheduled_at.toISOString() : null,
      duration_minutes: values.duration_minutes ?? 30,
      meeting_link: values.meeting_link || null,
      notes: values.notes || null,
      status: values.status ?? "pending",
    };

    const isEdit = !!editTarget;
    const res = await fetch(isEdit ? `/api/bookings/${editTarget!.id}` : "/api/bookings", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (!res.ok) {
      msgApi.error("Failed to save");
      return;
    }

    setModalOpen(false);
    loadBookings(tab);
    msgApi.success(isEdit ? "Updated" : "Booking created");
  }

  async function deleteBooking(id: string) {
    Modal.confirm({
      title: "Delete this booking?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        setBookings(prev => prev.filter(b => b.id !== id));
        msgApi.success("Deleted");
      },
    });
  }

  const columns: TableColumnsType<Booking> = [
    {
      title: "Meeting", key: "title",
      render: (_, b) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{b.title}</Text>
          {b.client_name && <Text type="secondary" style={{ display: "block", fontSize: 12 }}>with {b.client_name}</Text>}
        </div>
      ),
    },
    {
      title: "Date & Time", key: "datetime", width: 200,
      render: (_, b) => b.scheduled_at ? (
        <div>
          <Text style={{ fontSize: 13 }}>{new Date(b.scheduled_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
          <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
            {new Date(b.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {b.duration_minutes}min
          </Text>
        </div>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Not scheduled</Text>,
    },
    {
      title: "Status", key: "status", width: 120,
      render: (_, b) => {
        const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
        return <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: 12, textTransform: "capitalize" }}>{b.status}</Tag>;
      },
    },
    {
      title: "Source", key: "source", width: 100,
      render: (_, b) => <Tag style={{ borderRadius: 12, fontSize: 11, textTransform: "capitalize" }}>{b.source}</Tag>,
    },
    {
      title: "", key: "actions", width: 120,
      render: (_, b) => (
        <Space>
          {b.meeting_link && (
            <Tooltip title="Join meeting">
              <a href={b.meeting_link} target="_blank" rel="noopener noreferrer">
                <Button type="text" size="small" icon={<VideoCameraOutlined />} />
              </a>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(b)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteBooking(b.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      {ctx}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <CalendarOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Bookings</Title>
            <Tag style={{ borderRadius: 20 }}>{bookings.length}</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Manage meetings booked through proposals and portals.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreate}
          style={{ borderRadius: 10, fontWeight: 600 }}>
          Add Booking
        </Button>
      </div>

      <Tabs activeKey={tab} onChange={setTab} items={[
        { key: "upcoming", label: "Upcoming" },
        { key: "past", label: "Past" },
      ]} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
      ) : bookings.length === 0 ? (
        <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "60px 40px" } }}>
          <CalendarOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>
            {tab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
            {tab === "upcoming"
              ? "Set up your scheduling link in Settings to let clients book calls directly from proposals and portals."
              : "Completed and cancelled bookings will appear here."}
          </Text>
          {tab === "upcoming" && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ borderRadius: 12 }}>
              Add Your First Booking
            </Button>
          )}
        </Card>
      ) : (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          <Table dataSource={bookings} columns={columns} rowKey="id" pagination={{ pageSize: 15 }} />
        </Card>
      )}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={editTarget ? "Edit Booking" : "Add Booking"}
        width={520}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={handleSave}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            {editTarget ? "Update" : "Create"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{ duration_minutes: 30, status: "pending" }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g., Kickoff Call" />
          </Form.Item>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item name="client_name" label="Client Name" style={{ flex: 1 }}>
              <Input placeholder="Client name" />
            </Form.Item>
            <Form.Item name="client_email" label="Client Email" style={{ flex: 1 }}>
              <Input placeholder="client@example.com" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item name="scheduled_at" label="Date & Time" style={{ flex: 1 }}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="duration_minutes" label="Duration (min)" style={{ width: 120 }}>
              <Select options={[
                { value: 15, label: "15 min" },
                { value: 30, label: "30 min" },
                { value: 45, label: "45 min" },
                { value: 60, label: "60 min" },
                { value: 90, label: "90 min" },
              ]} />
            </Form.Item>
          </div>
          <Form.Item name="meeting_link" label="Meeting Link">
            <Input prefix={<LinkOutlined />} placeholder="https://zoom.us/j/..." />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Any notes about this meeting" />
          </Form.Item>
          {editTarget && (
            <Form.Item name="status" label="Status">
              <Select options={[
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "no_show", label: "No Show" },
              ]} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
