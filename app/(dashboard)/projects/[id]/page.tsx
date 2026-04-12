"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar, Badge, Button, Card, Col, DatePicker, Dropdown, Empty, Form,
  Input, InputNumber, Modal, Progress, Row, Select, Space, Spin, Switch,
  Table, Tabs, Tag, Tooltip, Typography, message,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  EllipsisOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CalendarOutlined, FolderOpenOutlined, CheckOutlined,
  ExclamationCircleOutlined, MessageOutlined, SendOutlined,
  UserOutlined, FieldTimeOutlined, PlayCircleOutlined, PauseCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const STATUS_CONFIG = {
  planning:  { label: "Planning",   color: "#94a3b8", bg: "#f1f5f9" },
  active:    { label: "Active",     color: "#0ea5e9", bg: "#eff6ff" },
  review:    { label: "In Review",  color: "#f59e0b", bg: "#fffbeb" },
  completed: { label: "Completed",  color: "#10b981", bg: "#f0fdf4" },
  paused:    { label: "Paused",     color: "#64748b", bg: "#f8fafc" },
  cancelled: { label: "Cancelled",  color: "#ef4444", bg: "#fff1f2" },
};

const TASK_STATUS = {
  todo:        { label: "To Do",       color: "#94a3b8", bg: "#f1f5f9", icon: "○" },
  in_progress: { label: "In Progress", color: "#0ea5e9", bg: "#eff6ff", icon: "◑" },
  review:      { label: "Review",      color: "#f59e0b", bg: "#fffbeb", icon: "◐" },
  done:        { label: "Done",        color: "#10b981", bg: "#f0fdf4", icon: "●" },
  cancelled:   { label: "Cancelled",   color: "#ef4444", bg: "#fff1f2", icon: "✕" },
};

const PRIORITY_CONFIG = {
  low:    { label: "Low",    color: "#94a3b8" },
  medium: { label: "Medium", color: "#0ea5e9" },
  high:   { label: "High",   color: "#f59e0b" },
  urgent: { label: "Urgent", color: "#ef4444" },
};

interface Project {
  id: string; name: string; description: string | null; color: string;
  status: string; due_date: string | null; budget: number | null; currency: string;
  client_id: string | null; tags: string[]; created_at: string;
  clients?: { id: string; name: string; company: string | null; avatar_color: string; email: string | null };
}

interface Task {
  id: string; title: string; description: string | null; status: string;
  priority: string; due_date: string | null; completed_at: string | null;
  tags: string[]; position: number; created_at: string;
}

interface TimeEntry {
  id: string; description: string | null; date: string;
  duration: number; billable: boolean; hourly_rate: number | null;
  amount: number | null; invoiced: boolean; is_running: boolean;
  timer_started_at: string | null; task_id: string | null;
}

interface ProjectMessage {
  id: string; project_id: string; user_id: string | null;
  sender_name: string; sender_role: "freelancer" | "client";
  message: string; is_read: boolean; created_at: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tasks");
  const [form] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();

  // Time tracking state
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [timeForm] = Form.useForm();
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [runningEntry, setRunningEntry] = useState<TimeEntry | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatText, setChatText] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [unread, setUnread] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => { load(); }, [id]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`project_messages:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${id}` },
        (payload) => {
          const newMsg = payload.new as ProjectMessage;
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Count unread if not on chat tab
          if (activeTab !== "conversation") {
            setUnread(n => n + 1);
          }
          chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [id, activeTab]);

  // Clear unread + load messages when switching to chat
  useEffect(() => {
    if (activeTab === "conversation" && messages.length === 0) loadMessages();
    if (activeTab === "conversation") setUnread(0);
    if (activeTab === "time") loadTimeEntries();
  }, [activeTab]);

  // Timer tick
  useEffect(() => {
    if (runningEntry) {
      const elapsed = runningEntry.timer_started_at
        ? Math.floor((Date.now() - new Date(runningEntry.timer_started_at).getTime()) / 1000)
        : 0;
      setTimerSeconds(elapsed);
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerSeconds(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [runningEntry]);

  // Scroll to bottom when messages load
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load() {
    const supabase = createClient();
    const [{ data: p }, { data: t }, { data: { user } }] = await Promise.all([
      supabase.from("projects").select("*, clients(id,name,company,avatar_color,email)").eq("id", id).maybeSingle(),
      supabase.from("tasks").select("*").eq("project_id", id).order("status").order("position"),
      supabase.auth.getUser(),
    ]);
    if (!p) { router.push("/projects"); return; }
    setProject(p as Project);
    setTasks((t ?? []) as Task[]);
    if (user) {
      setCurrentUser({
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "You",
      });
    }
    setLoading(false);
  }

  async function loadMessages() {
    setChatLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true });
    if (!error) setMessages((data ?? []) as ProjectMessage[]);
    setChatLoading(false);
  }

  async function loadTimeEntries() {
    const supabase = createClient();
    const { data } = await supabase.from("time_entries").select("*").eq("project_id", id).order("date", { ascending: false }).order("created_at", { ascending: false });
    const entries = (data ?? []) as TimeEntry[];
    setTimeEntries(entries);
    const running = entries.find(e => e.is_running);
    if (running) setRunningEntry(running);
  }

  async function startTimer() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("time_entries").insert({
      user_id: user.id, project_id: id,
      description: "Working…", date: new Date().toISOString().split("T")[0],
      duration: 0, billable: true, is_running: true,
      timer_started_at: new Date().toISOString(),
    }).select().single();
    if (data) { setTimeEntries(prev => [data as TimeEntry, ...prev]); setRunningEntry(data as TimeEntry); }
  }

  async function stopTimer() {
    if (!runningEntry) return;
    const elapsed = Math.floor((Date.now() - new Date(runningEntry.timer_started_at!).getTime()) / 1000 / 60);
    const supabase = createClient();
    await supabase.from("time_entries").update({ is_running: false, timer_started_at: null, duration: elapsed }).eq("id", runningEntry.id);
    setTimeEntries(prev => prev.map(e => e.id === runningEntry.id ? { ...e, is_running: false, duration: elapsed } : e));
    setRunningEntry(null);
    msgApi.success(`Timer stopped — ${elapsed} min logged`);
  }

  async function addManualEntry() {
    const values = await timeForm.validateFields();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const durationMins = (values.hours ?? 0) * 60 + (values.minutes ?? 0);
    const { data } = await supabase.from("time_entries").insert({
      user_id: user.id, project_id: id,
      description: values.description, date: values.date?.format("YYYY-MM-DD") ?? new Date().toISOString().split("T")[0],
      duration: durationMins, billable: values.billable ?? true,
      hourly_rate: values.hourly_rate ?? null,
      is_running: false,
    }).select().single();
    if (data) { setTimeEntries(prev => [data as TimeEntry, ...prev]); timeForm.resetFields(); msgApi.success("Time logged"); }
  }

  async function deleteTimeEntry(entryId: string) {
    const supabase = createClient();
    await supabase.from("time_entries").delete().eq("id", entryId);
    setTimeEntries(prev => prev.filter(e => e.id !== entryId));
    if (runningEntry?.id === entryId) setRunningEntry(null);
  }

  function fmtDuration(mins: number) {
    const h = Math.floor(mins / 60); const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
  function fmtTimer(secs: number) {
    const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60); const s = secs % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  async function sendMessage() {
    if (!chatText.trim() || !currentUser) return;
    setSending(true);
    const supabase = createClient();

    // Determine role: if current user owns the project → freelancer, else → client
    const isFreelancer = project?.clients
      ? project.clients.email !== currentUser.email
      : true;

    const { error } = await supabase.from("project_messages").insert({
      project_id: id,
      user_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: isFreelancer ? "freelancer" : "client",
      message: chatText.trim(),
    });

    if (error) {
      msgApi.error("Failed to send: " + error.message);
    } else {
      setChatText("");
    }
    setSending(false);
  }

  function openCreateTask() {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ status: "todo", priority: "medium" });
    setTaskModal(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title, description: task.description,
      status: task.status, priority: task.priority,
      due_date: task.due_date ? dayjs(task.due_date) : undefined,
      tags: task.tags ?? [],
    });
    setTaskModal(true);
  }

  async function saveTask() {
    const values = await form.validateFields();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { msgApi.error("Not signed in."); setSaving(false); return; }

    const payload = {
      title: values.title, description: values.description ?? null,
      status: values.status, priority: values.priority,
      due_date: values.due_date?.toISOString() ?? null,
      tags: values.tags ?? [],
      project_id: id,
      client_id: project?.client_id ?? null,
      completed_at: values.status === "done" ? new Date().toISOString() : null,
    };
    if (editingTask) {
      const { data, error } = await supabase.from("tasks").update(payload).eq("id", editingTask.id).select().single();
      if (error) { msgApi.error("Update failed: " + error.message); setSaving(false); return; }
      setTasks(prev => prev.map(t => t.id === editingTask.id ? data as Task : t));
      msgApi.success("Task updated");
    } else {
      const { data, error } = await supabase.from("tasks")
        .insert({ ...payload, user_id: user.id, position: tasks.length })
        .select().single();
      if (error) { msgApi.error("Could not create task: " + error.message); setSaving(false); return; }
      setTasks(prev => [...prev, data as Task]);
      msgApi.success("Task created");
    }
    setSaving(false);
    setTaskModal(false);
  }

  async function updateTaskStatus(taskId: string, status: string) {
    const supabase = createClient();
    const updates: Record<string, unknown> = { status };
    if (status === "done") updates.completed_at = new Date().toISOString();
    else updates.completed_at = null;
    await supabase.from("tasks").update(updates).eq("id", taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates as Partial<Task> } : t));
  }

  async function deleteTask(taskId: string) {
    Modal.confirm({
      title: "Delete this task?", okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("tasks").delete().eq("id", taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        msgApi.success("Task deleted");
      },
    });
  }

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const done = tasks.filter(t => t.status === "done").length;
  const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done").length;

  function taskMenu(task: Task): MenuProps {
    const statusItems = Object.entries(TASK_STATUS)
      .filter(([k]) => k !== task.status)
      .map(([k, v]) => ({ key: k, label: v.label, onClick: () => updateTaskStatus(task.id, k) }));
    return {
      items: [
        { key: "edit", label: "Edit task", icon: <EditOutlined />, onClick: () => openEditTask(task) },
        { key: "status", label: "Change status", children: statusItems },
        { type: "divider" },
        { key: "delete", label: "Delete", icon: <DeleteOutlined />, danger: true, onClick: () => deleteTask(task.id) },
      ],
    };
  }

  const columns: TableColumnsType<Task> = [
    {
      key: "check", width: 44,
      render: (_, t) => (
        <button
          onClick={() => updateTaskStatus(t.id, t.status === "done" ? "todo" : "done")}
          style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${t.status === "done" ? "#10b981" : "#e2e8f0"}`, background: t.status === "done" ? "#10b981" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {t.status === "done" && <CheckOutlined style={{ color: "#fff", fontSize: 11 }} />}
        </button>
      ),
    },
    {
      title: "Task", key: "title",
      render: (_, t) => (
        <div>
          <Text style={{ fontSize: 14, textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? "#94a3b8" : "#0f172a" }}>
            {t.title}
          </Text>
          {t.description && (
            <Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
              {t.description}
            </Text>
          )}
          {t.tags?.length > 0 && (
            <Space wrap style={{ marginTop: 4 }}>
              {t.tags.slice(0, 3).map(tag => <Tag key={tag} style={{ borderRadius: 20, fontSize: 10, padding: "0 6px" }}>{tag}</Tag>)}
            </Space>
          )}
        </div>
      ),
    },
    {
      title: "Status", key: "status", width: 130,
      render: (_, t) => {
        const s = TASK_STATUS[t.status as keyof typeof TASK_STATUS];
        return <Tag style={{ borderRadius: 20, fontSize: 12, color: s?.color, background: s?.bg, borderColor: `${s?.color}30` }}>{s?.label}</Tag>;
      },
    },
    {
      title: "Priority", key: "priority", width: 100,
      render: (_, t) => {
        const p = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
        return <Tag style={{ borderRadius: 20, fontSize: 11, color: p?.color, borderColor: `${p?.color}40`, background: `${p?.color}12` }}>{p?.label}</Tag>;
      },
    },
    {
      title: "Due Date", key: "due_date", width: 120,
      render: (_, t) => {
        if (!t.due_date) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const isOverdue = new Date(t.due_date) < new Date() && t.status !== "done";
        return (
          <Space size={4}>
            {isOverdue && <ExclamationCircleOutlined style={{ color: "#ef4444", fontSize: 12 }} />}
            <Text style={{ fontSize: 12, color: isOverdue ? "#ef4444" : "#374151" }}>{dayjs(t.due_date).format("MMM D")}</Text>
          </Space>
        );
      },
    },
    {
      key: "actions", width: 48,
      render: (_, t) => (
        <Dropdown menu={taskMenu(t)} trigger={["click"]} placement="bottomRight">
          <Button type="text" icon={<EllipsisOutlined />} style={{ borderRadius: 6 }} />
        </Dropdown>
      ),
    },
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}><Spin size="large" /></div>;
  if (!project) return null;

  const ps = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
  const client = project.clients;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}

      <Link href="/projects">
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ padding: "4px 0", color: "#64748b", marginBottom: 16 }}>All Projects</Button>
      </Link>

      {/* Project header */}
      <Card style={{ borderRadius: 20, border: `2px solid ${project.color}30`, marginBottom: 24, background: `${project.color}05` }} styles={{ body: { padding: 28 } }}>
        <Row justify="space-between" gutter={[16, 16]} wrap>
          <Col>
            <Space align="center" size={14}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: project.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FolderOpenOutlined style={{ color: "#fff", fontSize: 22 }} />
              </div>
              <div>
                <Space align="center" size={10} wrap>
                  <Title level={2} style={{ margin: 0, fontWeight: 900 }}>{project.name}</Title>
                  <Tag style={{ borderRadius: 20, color: ps?.color, background: ps?.bg, borderColor: `${ps?.color}30`, fontSize: 12 }}>{ps?.label}</Tag>
                </Space>
                <Space size={16} wrap style={{ marginTop: 6 }}>
                  {client && (
                    <Space size={6}>
                      <Avatar size={18} style={{ background: client.avatar_color, fontSize: 10, fontWeight: 700 }}>{client.name[0].toUpperCase()}</Avatar>
                      <Text type="secondary" style={{ fontSize: 13 }}>{client.name}{client.company ? ` · ${client.company}` : ""}</Text>
                    </Space>
                  )}
                  {project.due_date && (
                    <Space size={4}><CalendarOutlined style={{ color: "#94a3b8", fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 13 }}>Due {dayjs(project.due_date).format("MMM D, YYYY")}</Text>
                    </Space>
                  )}
                  {project.budget && (
                    <Text style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>{project.currency} {project.budget.toLocaleString()}</Text>
                  )}
                  {project.tags?.map(t => <Tag key={t} style={{ borderRadius: 20, fontSize: 11 }}>{t}</Tag>)}
                </Space>
              </div>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateTask}
              style={{ borderRadius: 10, fontWeight: 600 }}>Add Task</Button>
          </Col>
        </Row>

        {tasks.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>{done} of {tasks.length} tasks completed</Text>
              <Text strong style={{ fontSize: 13, color: project.color }}>{pct}%</Text>
            </div>
            <Progress percent={pct} showInfo={false} strokeColor={project.color} trailColor="#e2e8f0" />
          </div>
        )}
      </Card>

      {/* Stats row */}
      <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
        {[
          { label: "Total Tasks",  value: tasks.length,                                         color: "#0ea5e9" },
          { label: "To Do",        value: tasks.filter(t => t.status === "todo").length,        color: "#94a3b8" },
          { label: "In Progress",  value: tasks.filter(t => t.status === "in_progress").length, color: "#f59e0b" },
          { label: "Done",         value: done,                                                  color: "#10b981" },
          { label: "Overdue",      value: overdue,                                               color: "#ef4444" },
        ].map(s => (
          <Col key={s.label} xs={12} sm={6} md={4}>
            <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: 14 } }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
              <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        items={[
          {
            key: "tasks",
            label: <Space><CheckCircleOutlined />Tasks ({tasks.length})</Space>,
            children: (
              <>
                {/* Filters */}
                <Space wrap style={{ marginBottom: 16 }}>
                  <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
                    <Option value="all">All Statuses</Option>
                    {Object.entries(TASK_STATUS).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                  </Select>
                  <Select value={priorityFilter} onChange={setPriorityFilter} style={{ width: 140 }}>
                    <Option value="all">All Priorities</Option>
                    {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                  </Select>
                </Space>

                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
                  {filteredTasks.length === 0 ? (
                    <Empty
                      description={<Text type="secondary">No tasks yet. Add your first task to start tracking work.</Text>}
                      style={{ padding: "60px 40px" }}
                      image={<CheckCircleOutlined style={{ fontSize: 56, color: "#cbd5e1" }} />}
                      imageStyle={{ height: 70 }}
                    >
                      <Button type="primary" icon={<PlusOutlined />} onClick={openCreateTask} style={{ borderRadius: 8 }}>Add First Task</Button>
                    </Empty>
                  ) : (
                    <Table
                      dataSource={filteredTasks}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                      rowClassName={r => r.status === "done" ? "opacity-60" : ""}
                      style={{ borderRadius: 16 }}
                    />
                  )}
                </Card>
              </>
            ),
          },
          {
            key: "time",
            label: (
              <Space>
                <FieldTimeOutlined />
                Time
                {timeEntries.length > 0 && (
                  <Tag style={{ borderRadius: 20, fontSize: 10, marginLeft: 2 }}>
                    {fmtDuration(timeEntries.filter(e => !e.is_running).reduce((s, e) => s + e.duration, 0))}
                  </Tag>
                )}
              </Space>
            ),
            children: (
              <div>
                {/* Timer card */}
                <Card style={{ borderRadius: 16, border: `2px solid ${runningEntry ? "#10b981" : "#e2e8f0"}`, marginBottom: 16, background: runningEntry ? "#f0fdf4" : "#fff" }} styles={{ body: { padding: 24 } }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                        {runningEntry ? "⏱ Timer running…" : "Start a timer"}
                      </Text>
                      {runningEntry && (
                        <div style={{ fontSize: 36, fontWeight: 900, color: "#10b981", fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
                          {fmtTimer(timerSeconds)}
                        </div>
                      )}
                      {!runningEntry && <Text type="secondary" style={{ fontSize: 13 }}>Click Start to begin tracking time on this project.</Text>}
                    </div>
                    {runningEntry ? (
                      <Button danger size="large" icon={<PauseCircleOutlined />} onClick={stopTimer} style={{ borderRadius: 12, height: 48, fontWeight: 700 }}>
                        Stop & Save
                      </Button>
                    ) : (
                      <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={startTimer} style={{ borderRadius: 12, height: 48, fontWeight: 700, background: "#10b981", borderColor: "#10b981" }}>
                        Start Timer
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Manual entry */}
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
                  <Text strong style={{ display: "block", marginBottom: 14, fontSize: 14 }}>Log time manually</Text>
                  <Form form={timeForm} layout="inline" size="middle">
                    <Form.Item name="description" style={{ flex: 2, minWidth: 160 }}>
                      <Input placeholder="What did you work on?" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="hours">
                      <InputNumber min={0} max={24} placeholder="h" style={{ width: 64, borderRadius: 8 }} addonAfter="h" />
                    </Form.Item>
                    <Form.Item name="minutes">
                      <InputNumber min={0} max={59} placeholder="m" style={{ width: 64, borderRadius: 8 }} addonAfter="m" />
                    </Form.Item>
                    <Form.Item name="hourly_rate">
                      <InputNumber min={0} placeholder="Rate/h" prefix="$" style={{ width: 100, borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="date">
                      <DatePicker style={{ borderRadius: 8 }} placeholder="Date" defaultValue={dayjs()} />
                    </Form.Item>
                    <Form.Item name="billable" valuePropName="checked" initialValue={true}>
                      <Switch checkedChildren="Billable" unCheckedChildren="Non-bill" />
                    </Form.Item>
                    <Button type="primary" onClick={addManualEntry} style={{ borderRadius: 8 }}>Log</Button>
                  </Form>
                </Card>

                {/* Summary */}
                {timeEntries.filter(e => !e.is_running).length > 0 && (() => {
                  const logged   = timeEntries.filter(e => !e.is_running);
                  const total    = logged.reduce((s, e) => s + e.duration, 0);
                  const billable = logged.filter(e => e.billable).reduce((s, e) => s + e.duration, 0);
                  const revenue  = logged.filter(e => e.billable && e.amount).reduce((s, e) => s + (e.amount ?? 0), 0);
                  return (
                    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                      {[
                        { label: "Total Time",     value: fmtDuration(total),    color: "#0ea5e9" },
                        { label: "Billable",        value: fmtDuration(billable), color: "#10b981" },
                        { label: "Non-billable",    value: fmtDuration(total - billable), color: "#94a3b8" },
                        { label: "Est. Revenue",    value: revenue > 0 ? `$${revenue.toFixed(0)}` : "—", color: "#f59e0b" },
                      ].map(s => (
                        <Col key={s.label} xs={12} sm={6}>
                          <Card style={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "center" }} styles={{ body: { padding: 14 } }}>
                            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                            <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  );
                })()}

                {/* Entries list */}
                <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
                  {timeEntries.filter(e => !e.is_running).length === 0 ? (
                    <div style={{ textAlign: "center", padding: 60 }}>
                      <FieldTimeOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
                      <Text type="secondary" style={{ display: "block" }}>No time logged yet. Start a timer or log manually.</Text>
                    </div>
                  ) : (
                    timeEntries.filter(e => !e.is_running).map((e, i, arr) => (
                      <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: e.billable ? "#f0fdf4" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FieldTimeOutlined style={{ color: e.billable ? "#10b981" : "#94a3b8", fontSize: 18 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text strong style={{ fontSize: 13 }}>{e.description ?? "No description"}</Text>
                          <Space size={10} style={{ display: "block", marginTop: 2 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(e.date).format("MMM D, YYYY")}</Text>
                            <Tag style={{ borderRadius: 20, fontSize: 11, background: e.billable ? "#f0fdf4" : "#f8fafc", color: e.billable ? "#10b981" : "#94a3b8", borderColor: "transparent" }}>
                              {e.billable ? "Billable" : "Non-billable"}
                            </Tag>
                            {e.invoiced && <Tag style={{ borderRadius: 20, fontSize: 11 }} color="blue">Invoiced</Tag>}
                          </Space>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <Text strong style={{ fontSize: 15, display: "block" }}>{fmtDuration(e.duration)}</Text>
                          {e.amount != null && e.amount > 0 && (
                            <Text style={{ fontSize: 12, color: "#10b981" }}>${e.amount.toFixed(2)}</Text>
                          )}
                        </div>
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => deleteTimeEntry(e.id)} />
                      </div>
                    ))
                  )}
                </Card>
              </div>
            ),
          },
          {
            key: "conversation",
            label: (
              <Badge count={unread} size="small" offset={[4, -2]}>
                <Space><MessageOutlined />Conversation</Space>
              </Badge>
            ),
            children: (
              <Card
                style={{ borderRadius: 16, border: "1px solid #e2e8f0" }}
                styles={{ body: { padding: 0 } }}
              >
                {/* Context banner */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", gap: 10 }}>
                  <MessageOutlined style={{ color: "#0ea5e9" }} />
                  <div>
                    <Text strong style={{ fontSize: 14 }}>Project Conversation</Text>
                    <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                      Collaborate with {client ? client.name : "your client"} · messages are real-time
                    </Text>
                  </div>
                  {client && (
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar size={28} style={{ background: client.avatar_color, fontSize: 12, fontWeight: 700 }}>
                        {client.name[0].toUpperCase()}
                      </Avatar>
                      <div>
                        <Text style={{ fontSize: 12, fontWeight: 600, display: "block" }}>{client.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{client.company ?? "Client"}</Text>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message list */}
                <div style={{ height: 480, overflowY: "auto", padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
                  {chatLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spin /></div>
                  ) : messages.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: 8 }}>
                      <MessageOutlined style={{ fontSize: 40, color: "#cbd5e1" }} />
                      <Text type="secondary" style={{ fontSize: 14 }}>No messages yet</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>Start the conversation — ask questions, share updates, or discuss progress.</Text>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => {
                        const isMe = msg.user_id === currentUser?.id;
                        const isFreelancer = msg.sender_role === "freelancer";
                        const showDateSep = i === 0 || dayjs(msg.created_at).format("YYYY-MM-DD") !== dayjs(messages[i - 1].created_at).format("YYYY-MM-DD");

                        return (
                          <div key={msg.id}>
                            {showDateSep && (
                              <div style={{ textAlign: "center", margin: "8px 0" }}>
                                <Tag style={{ borderRadius: 20, fontSize: 11, color: "#94a3b8", borderColor: "#e2e8f0" }}>
                                  {dayjs(msg.created_at).format("MMM D, YYYY")}
                                </Tag>
                              </div>
                            )}
                            <div style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
                              {/* Avatar */}
                              <Tooltip title={`${msg.sender_name} (${msg.sender_role})`}>
                                <Avatar
                                  size={32}
                                  style={{
                                    flexShrink: 0,
                                    background: isFreelancer ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : (client?.avatar_color ?? "#10b981"),
                                    fontSize: 13, fontWeight: 700,
                                  }}
                                  icon={!msg.sender_name ? <UserOutlined /> : undefined}
                                >
                                  {msg.sender_name?.[0]?.toUpperCase()}
                                </Avatar>
                              </Tooltip>

                              {/* Bubble */}
                              <div style={{ maxWidth: "68%" }}>
                                {/* Name + time */}
                                <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
                                  <Text style={{ fontSize: 12, fontWeight: 600, color: isFreelancer ? "#0369a1" : "#047857" }}>
                                    {isMe ? "You" : msg.sender_name}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 11 }}>
                                    {dayjs(msg.created_at).fromNow()}
                                  </Text>
                                  <Tag
                                    style={{ borderRadius: 20, fontSize: 10, padding: "0 6px", lineHeight: "16px", height: 16, border: "none",
                                      background: isFreelancer ? "#dbeafe" : "#dcfce7",
                                      color: isFreelancer ? "#0369a1" : "#047857" }}
                                  >
                                    {msg.sender_role}
                                  </Tag>
                                </div>

                                <div style={{
                                  background: isMe ? "linear-gradient(135deg, #0369a1, #0ea5e9)" : "#f1f5f9",
                                  color: isMe ? "#fff" : "#0f172a",
                                  padding: "10px 14px",
                                  borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  wordBreak: "break-word",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                }}>
                                  {msg.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", background: "#fff", borderRadius: "0 0 16px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <Avatar
                      size={36}
                      style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)", flexShrink: 0, fontSize: 14, fontWeight: 700 }}
                    >
                      {currentUser?.name?.[0]?.toUpperCase() ?? <UserOutlined />}
                    </Avatar>
                    <TextArea
                      value={chatText}
                      onChange={e => setChatText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                      autoSize={{ minRows: 1, maxRows: 5 }}
                      style={{ borderRadius: 12, fontSize: 14, resize: "none", flex: 1 }}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      loading={sending}
                      disabled={!chatText.trim()}
                      onClick={sendMessage}
                      style={{ borderRadius: 10, height: 40, fontWeight: 600, flexShrink: 0 }}
                    >
                      Send
                    </Button>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 6, display: "block", paddingLeft: 46 }}>
                    Enter to send · Shift+Enter for new line · Messages are visible to all project members
                  </Text>
                </div>
              </Card>
            ),
          },
        ]}
      />

      {/* Task Modal */}
      <Modal open={taskModal} onCancel={() => setTaskModal(false)}
        title={<Space><CheckCircleOutlined style={{ color: "#0ea5e9" }} />{editingTask ? "Edit Task" : "New Task"}</Space>}
        width={560} footer={[
          <Button key="cancel" onClick={() => setTaskModal(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={saveTask} style={{ borderRadius: 8, fontWeight: 600 }}>
            {editingTask ? "Save Changes" : "Create Task"}
          </Button>,
        ]}>
        <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}>
          <Form.Item name="title" label={<Text strong style={{ fontSize: 13 }}>Task Title *</Text>} rules={[{ required: true }]}>
            <Input placeholder="e.g. Design hero section mockup" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label={<Text strong style={{ fontSize: 13 }}>Status</Text>}>
                <Select style={{ width: "100%" }}>
                  {Object.entries(TASK_STATUS).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label={<Text strong style={{ fontSize: 13 }}>Priority</Text>}>
                <Select style={{ width: "100%" }}>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="due_date" label={<Text strong style={{ fontSize: 13 }}>Due Date</Text>}>
            <DatePicker style={{ width: "100%", borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="description" label={<Text strong style={{ fontSize: 13 }}>Description</Text>}>
            <TextArea rows={3} placeholder="Additional details, acceptance criteria…" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="tags" label={<Text strong style={{ fontSize: 13 }}>Tags</Text>} style={{ marginBottom: 0 }}>
            <Select mode="tags" placeholder="Add tags (press Enter)" style={{ width: "100%" }}
              options={["Design","Dev","Copy","Review","QA","Research","Meeting"].map(t => ({ value: t, label: t }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
