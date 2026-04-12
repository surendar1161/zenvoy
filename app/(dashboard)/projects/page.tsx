"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Card, Col, DatePicker, Empty, Form, Input,
  Modal, Progress, Row, Select, Space, Spin, Statistic, Table, Tag,
  Typography, message, Tooltip, Dropdown,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  PlusOutlined, ProjectOutlined, FilterOutlined, CheckCircleOutlined,
  ClockCircleOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined,
  TeamOutlined, CalendarOutlined, DollarOutlined, FolderOpenOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const STATUS_CONFIG = {
  planning:  { label: "Planning",   color: "#94a3b8", bg: "#f1f5f9" },
  active:    { label: "Active",     color: "#0ea5e9", bg: "#eff6ff" },
  review:    { label: "In Review",  color: "#f59e0b", bg: "#fffbeb" },
  completed: { label: "Completed",  color: "#10b981", bg: "#f0fdf4" },
  paused:    { label: "Paused",     color: "#64748b", bg: "#f8fafc" },
  cancelled: { label: "Cancelled",  color: "#ef4444", bg: "#fff1f2" },
};

const PROJECT_COLORS = [
  "#0ea5e9","#7c3aed","#10b981","#f59e0b","#ef4444",
  "#0369a1","#5b21b6","#065f46","#92400e","#334155",
];

interface Client { id: string; name: string; company: string | null; avatar_color: string; }
interface Project {
  id: string; name: string; description: string | null; color: string;
  status: string; start_date: string | null; due_date: string | null;
  budget: number | null; currency: string; tags: string[];
  client_id: string | null; created_at: string;
  client?: Client;
  task_count?: number; done_count?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [form] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: projs }, { data: cls }] = await Promise.all([
      supabase.from("projects").select("*, clients(id,name,company,avatar_color)").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,name,company,avatar_color").order("name"),
    ]);

    // Fetch task counts
    const projectIds = (projs ?? []).map(p => p.id);
    let taskCounts: Record<string, { total: number; done: number }> = {};
    if (projectIds.length) {
      const { data: tasks } = await supabase
        .from("tasks").select("project_id,status").in("project_id", projectIds);
      (tasks ?? []).forEach(t => {
        if (!taskCounts[t.project_id]) taskCounts[t.project_id] = { total: 0, done: 0 };
        taskCounts[t.project_id].total++;
        if (t.status === "done") taskCounts[t.project_id].done++;
      });
    }

    setProjects((projs ?? []).map(p => ({
      ...p,
      client: p.clients as Client | undefined,
      task_count: taskCounts[p.id]?.total ?? 0,
      done_count: taskCounts[p.id]?.done ?? 0,
    })) as Project[]);
    setClients((cls ?? []) as Client[]);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ color: "#0ea5e9", status: "active", currency: "USD" });
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    form.setFieldsValue({
      name: project.name, description: project.description,
      color: project.color, status: project.status,
      client_id: project.client_id ?? undefined,
      start_date: project.start_date ? dayjs(project.start_date) : undefined,
      due_date: project.due_date ? dayjs(project.due_date) : undefined,
      budget: project.budget ?? undefined, currency: project.currency,
      tags: project.tags ?? [],
    });
    setModalOpen(true);
  }

  async function save() {
    const values = await form.validateFields();
    setSaving(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { msgApi.error("Not signed in."); setSaving(false); return; }

    const payload = {
      name: values.name, description: values.description ?? null,
      color: values.color ?? "#0ea5e9", status: values.status,
      client_id: values.client_id ?? null,
      start_date: values.start_date?.toISOString() ?? null,
      due_date: values.due_date?.toISOString() ?? null,
      budget: values.budget ?? null, currency: values.currency ?? "USD",
      tags: values.tags ?? [],
    };
    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      if (error) { msgApi.error("Update failed: " + error.message); setSaving(false); return; }
      msgApi.success("Project updated");
    } else {
      const { data: inserted, error } = await supabase
        .from("projects").insert({ ...payload, user_id: user.id }).select().single();
      if (error) { msgApi.error("Could not create project: " + error.message); setSaving(false); return; }
      if (inserted) setProjects(prev => [inserted as Project, ...prev]);
      msgApi.success("Project created");
      setSaving(false);
      setModalOpen(false);
      return;
    }
    setSaving(false);
    setModalOpen(false);
    loadAll();
  }

  async function deleteProject(id: string) {
    Modal.confirm({
      title: "Delete this project?",
      content: "All tasks in this project will also be deleted.",
      okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("projects").delete().eq("id", id);
        setProjects(prev => prev.filter(p => p.id !== id));
        msgApi.success("Project deleted");
      },
    });
  }

  const filtered = projects.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (clientFilter !== "all" && p.client_id !== clientFilter) return false;
    return true;
  });

  // Stats
  const active = projects.filter(p => p.status === "active").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const overdue = projects.filter(p => p.due_date && new Date(p.due_date) < new Date() && p.status !== "completed").length;

  function rowMenu(project: Project): MenuProps {
    return {
      items: [
        { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => openEdit(project) },
        { key: "tasks", label: <Link href={`/projects/${project.id}`}>View Tasks</Link>, icon: <CheckCircleOutlined /> },
        { type: "divider" },
        { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true, onClick: () => deleteProject(project.id) },
      ],
    };
  }

  // Table columns
  const columns: TableColumnsType<Project> = [
    {
      title: "Project",
      key: "name",
      render: (_, p) => (
        <Space>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color, flexShrink: 0 }} />
          <Link href={`/projects/${p.id}`}>
            <Text strong style={{ fontSize: 14 }}>{p.name}</Text>
          </Link>
        </Space>
      ),
    },
    {
      title: "Client",
      key: "client",
      width: 180,
      render: (_, p) => p.client ? (
        <Space size={6}>
          <Avatar size={22} style={{ background: p.client.avatar_color, fontSize: 11, fontWeight: 700 }}>
            {p.client.name[0].toUpperCase()}
          </Avatar>
          <Text style={{ fontSize: 13 }}>{p.client.name}</Text>
        </Space>
      ) : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_, p) => {
        const s = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG];
        return <Tag style={{ borderRadius: 20, fontSize: 12, color: s?.color, background: s?.bg, borderColor: `${s?.color}30` }}>{s?.label ?? p.status}</Tag>;
      },
    },
    {
      title: "Tasks",
      key: "tasks",
      width: 140,
      render: (_, p) => {
        const pct = p.task_count ? Math.round((p.done_count ?? 0) / p.task_count * 100) : 0;
        return p.task_count ? (
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Text style={{ fontSize: 12 }}>{p.done_count}/{p.task_count} done</Text>
            <Progress percent={pct} size="small" showInfo={false}
              strokeColor={pct === 100 ? "#10b981" : "#0ea5e9"} style={{ margin: 0 }} />
          </Space>
        ) : <Text type="secondary" style={{ fontSize: 12 }}>No tasks</Text>;
      },
    },
    {
      title: "Due Date",
      key: "due_date",
      width: 120,
      render: (_, p) => {
        if (!p.due_date) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const isOverdue = new Date(p.due_date) < new Date() && p.status !== "completed";
        return <Text style={{ fontSize: 12, color: isOverdue ? "#ef4444" : "#374151" }}>{dayjs(p.due_date).format("MMM D, YYYY")}</Text>;
      },
    },
    {
      title: "Budget",
      key: "budget",
      width: 110,
      render: (_, p) => p.budget
        ? <Text style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>{p.currency} {p.budget.toLocaleString()}</Text>
        : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
    },
    {
      key: "actions",
      width: 48,
      render: (_, p) => (
        <Dropdown menu={rowMenu(p)} trigger={["click"]} placement="bottomRight">
          <Button type="text" icon={<EllipsisOutlined />} style={{ borderRadius: 6 }} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 4 }}>
            <FolderOpenOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Projects</Title>
            <Tag style={{ borderRadius: 20 }}>{projects.length} total</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Track all your client projects, deadlines, and task progress.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreate}
          style={{ borderRadius: 10, fontWeight: 600 }}>
          New Project
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
        {[
          { label: "Total",     value: projects.length, color: "#0ea5e9", icon: <ProjectOutlined /> },
          { label: "Active",    value: active,          color: "#10b981", icon: <ClockCircleOutlined /> },
          { label: "Completed", value: completed,       color: "#7c3aed", icon: <CheckCircleOutlined /> },
          { label: "Overdue",   value: overdue,         color: "#ef4444", icon: <CalendarOutlined /> },
        ].map(s => (
          <Col key={s.label} xs={12} sm={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 18 } }}>
              <Space>
                <Avatar size={36} style={{ background: `${s.color}15`, color: s.color }} icon={s.icon} />
                <Statistic title={<Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>}
                  value={s.value} valueStyle={{ color: s.color, fontWeight: 800, fontSize: 22 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Space wrap style={{ marginBottom: 20 }}>
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160, borderRadius: 8 }}>
          <Option value="all">All Statuses</Option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
        </Select>
        <Select value={clientFilter} onChange={setClientFilter} style={{ width: 200 }}
          showSearch filterOption={(i, o) => String(o?.value ?? "").toLowerCase().includes(i.toLowerCase())}>
          <Option value="all">All Clients</Option>
          {clients.map(c => <Option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</Option>)}
        </Select>
      </Space>

      {/* Project list */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "70px 40px" } }}>
          <FolderOpenOutlined style={{ fontSize: 56, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No projects yet</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>Create your first project to start tracking tasks, deadlines, and progress.</Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ borderRadius: 10, fontWeight: 600 }}>Create First Project</Button>
        </Card>
      ) : (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 20, showSizeChanger: false, showTotal: (t) => `${t} projects` }}
            style={{ borderRadius: 16 }}
            onRow={p => ({ style: { cursor: "pointer" }, onClick: (e) => { if ((e.target as HTMLElement).closest(".ant-dropdown-trigger,.ant-btn")) return; window.location.href = `/projects/${p.id}`; } })}
          />
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onCancel={() => setModalOpen(false)}
        title={<Space><FolderOpenOutlined style={{ color: "#0ea5e9" }} />{editing ? "Edit Project" : "New Project"}</Space>}
        width={600} footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={save} style={{ borderRadius: 8, fontWeight: 600 }}>
            {editing ? "Save Changes" : "Create Project"}
          </Button>,
        ]}>
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Row gutter={[16, 0]}>
            <Col span={18}>
              <Form.Item name="name" label={<Text strong style={{ fontSize: 13 }}>Project Name *</Text>} rules={[{ required: true }]}>
                <Input placeholder="e.g. Website Redesign — Acme Corp" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="color" label={<Text strong style={{ fontSize: 13 }}>Colour</Text>}>
                <Select style={{ width: "100%" }}>
                  {PROJECT_COLORS.map(c => (
                    <Option key={c} value={c}>
                      <Space><div style={{ width: 14, height: 14, borderRadius: 3, background: c }} />{c}</Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="client_id" label={<Text strong style={{ fontSize: 13 }}>Client</Text>}>
                <Select placeholder="Select client…" allowClear style={{ width: "100%" }}
                  showSearch filterOption={(i, o) => String(o?.value ?? "").toLowerCase().includes(i.toLowerCase())}>
                  {clients.map(c => <Option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label={<Text strong style={{ fontSize: 13 }}>Status</Text>}>
                <Select style={{ width: "100%" }}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="start_date" label={<Text strong style={{ fontSize: 13 }}>Start Date</Text>}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="due_date" label={<Text strong style={{ fontSize: 13 }}>Due Date</Text>}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="budget" label={<Text strong style={{ fontSize: 13 }}>Budget</Text>}>
                <Input type="number" placeholder="5000" style={{ borderRadius: 8 }} prefix={<DollarOutlined style={{ color: "#94a3b8" }} />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label={<Text strong style={{ fontSize: 13 }}>Currency</Text>}>
                <Select style={{ width: "100%" }}>
                  {["USD","GBP","EUR","AUD","CAD","INR"].map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label={<Text strong style={{ fontSize: 13 }}>Description</Text>}>
                <TextArea rows={3} placeholder="Brief description of the project…" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="tags" label={<Text strong style={{ fontSize: 13 }}>Tags</Text>} style={{ marginBottom: 0 }}>
                <Select mode="tags" placeholder="Add tags (press Enter)" style={{ width: "100%" }}
                  options={["Design","Development","Marketing","Content","Strategy","Branding"].map(t => ({ value: t, label: t }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
