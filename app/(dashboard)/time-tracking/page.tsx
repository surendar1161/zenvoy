"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button, Card, Checkbox, Col, DatePicker, Empty, Input, InputNumber,
  Radio, Row, Select, Space, Spin, Switch, Table, Tag, Tooltip, Typography, message, Modal,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  PlayCircleFilled, PauseCircleFilled, PlusOutlined, DeleteOutlined,
  EditOutlined, DollarOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CalendarOutlined, ProjectOutlined, FilterOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import TimeEntryModal from "@/components/TimeEntryModal";
import type { TimeEntryData } from "@/components/TimeEntryModal";
import InvoiceFromTimeEntries from "@/components/InvoiceFromTimeEntries";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const { Title, Text } = Typography;

interface Project { id: string; name: string; client_id: string | null; default_hourly_rate: number | null; }

interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  client_id: string | null;
  invoice_id: string | null;
  description: string;
  date: string;
  duration: number;
  timer_started_at: string | null;
  is_running: boolean;
  billable: boolean;
  hourly_rate: number | null;
  amount: number;
  invoiced: boolean;
  created_at: string;
  projects?: { name: string } | null;
  tasks?: { title: string } | null;
  clients?: { name: string } | null;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [msgApi, ctx] = message.useMessage();

  // Filters
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterBillable, setFilterBillable] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);

  // Timer state
  const [runningEntry, setRunningEntry] = useState<TimeEntry | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Quick entry
  const [quickDesc, setQuickDesc] = useState("");
  const [quickProjectId, setQuickProjectId] = useState<string | null>(null);
  const [quickRate, setQuickRate] = useState<number | null>(null);
  const [quickBillable, setQuickBillable] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntryData | null>(null);
  const [saving, setSaving] = useState(false);

  // Invoice modal
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const query = supabase
      .from("time_entries")
      .select("*, projects(name), tasks(title), clients(name)")
      .gte("date", dateRange[0].format("YYYY-MM-DD"))
      .lte("date", dateRange[1].format("YYYY-MM-DD"))
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) msgApi.error(error.message);
    else setEntries((data ?? []) as TimeEntry[]);
    setLoading(false);

    // Check for running timer (may be outside date range)
    const { data: running } = await supabase
      .from("time_entries")
      .select("*, projects(name), tasks(title), clients(name)")
      .eq("is_running", true)
      .limit(1)
      .maybeSingle();
    if (running) setRunningEntry(running as TimeEntry);
    else setRunningEntry(null);
  }, [dateRange, msgApi]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("projects").select("id, name, client_id, default_hourly_rate").order("name").then(({ data }) => {
      setProjects((data ?? []) as Project[]);
    });
  }, []);

  // Timer tick
  useEffect(() => {
    if (runningEntry?.timer_started_at) {
      const update = () => setElapsed(Date.now() - new Date(runningEntry.timer_started_at!).getTime());
      update();
      timerRef.current = setInterval(update, 1000);

      // Save duration to DB every 30s
      saveRef.current = setInterval(async () => {
        const dur = Math.floor((Date.now() - new Date(runningEntry.timer_started_at!).getTime()) / 60000);
        const supabase = createClient();
        await supabase.from("time_entries").update({ duration: dur }).eq("id", runningEntry.id);
      }, 30000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (saveRef.current) clearInterval(saveRef.current);
    };
  }, [runningEntry]);

  // Start timer
  async function startTimer() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Stop any running timer first
    if (runningEntry) {
      await stopTimer();
    }

    const proj = projects.find(p => p.id === quickProjectId);
    const rate = quickRate ?? proj?.default_hourly_rate ?? null;

    const { data, error } = await supabase.from("time_entries").insert({
      user_id: user.id,
      description: quickDesc,
      project_id: quickProjectId,
      client_id: proj?.client_id ?? null,
      date: dayjs().format("YYYY-MM-DD"),
      duration: 0,
      timer_started_at: new Date().toISOString(),
      is_running: true,
      billable: quickBillable,
      hourly_rate: rate,
    }).select("*, projects(name), tasks(title), clients(name)").single();

    if (error) { msgApi.error(error.message); return; }
    setRunningEntry(data as TimeEntry);
    setQuickDesc("");
    msgApi.success("Timer started");
    load();
  }

  // Stop timer
  async function stopTimer() {
    if (!runningEntry) return;
    const dur = Math.max(1, Math.floor((Date.now() - new Date(runningEntry.timer_started_at!).getTime()) / 60000));
    const supabase = createClient();
    await supabase.from("time_entries").update({
      duration: dur,
      is_running: false,
      timer_started_at: null,
    }).eq("id", runningEntry.id);
    setRunningEntry(null);
    setElapsed(0);
    msgApi.success(`Timer stopped — ${formatDuration(dur)} recorded`);
    load();
  }

  // Save manual entry
  async function handleSaveEntry(entry: TimeEntryData) {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    if (entry.id) {
      const { error } = await supabase.from("time_entries").update({
        description: entry.description,
        project_id: entry.project_id,
        task_id: entry.task_id,
        client_id: entry.client_id,
        date: entry.date,
        duration: entry.duration,
        billable: entry.billable,
        hourly_rate: entry.hourly_rate,
      }).eq("id", entry.id);
      if (error) msgApi.error(error.message);
      else msgApi.success("Entry updated");
    } else {
      const { error } = await supabase.from("time_entries").insert({
        user_id: user.id,
        description: entry.description,
        project_id: entry.project_id,
        task_id: entry.task_id,
        client_id: entry.client_id,
        date: entry.date,
        duration: entry.duration,
        billable: entry.billable,
        hourly_rate: entry.hourly_rate,
      });
      if (error) msgApi.error(error.message);
      else msgApi.success("Entry added");
    }
    setSaving(false);
    setModalOpen(false);
    setEditEntry(null);
    load();
  }

  // Delete entry
  async function deleteEntry(id: string) {
    Modal.confirm({
      title: "Delete time entry?", okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("time_entries").delete().eq("id", id);
        msgApi.success("Deleted");
        load();
      },
    });
  }

  // Filtered entries
  const filtered = entries.filter(e => {
    if (filterProject && e.project_id !== filterProject) return false;
    if (filterBillable !== null && e.billable !== filterBillable) return false;
    return true;
  });

  // Group entries by date
  const grouped = filtered.reduce<Record<string, TimeEntry[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Weekly view data
  const weekStart = dateRange[0].startOf("isoWeek");
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  // Stats
  const totalMins = filtered.reduce((s, e) => s + e.duration, 0);
  const totalBillableAmount = filtered.filter(e => e.billable).reduce((s, e) => s + (e.amount ?? 0), 0);
  const billableEntries = filtered.filter(e => e.billable).length;

  // Selectable entries for invoicing (billable + not invoiced)
  const invoiceable = filtered.filter(e => e.billable && !e.invoiced && !e.is_running);
  const selectedEntries = invoiceable.filter(e => selectedIds.includes(e.id));

  const columns: TableColumnsType<TimeEntry> = [
    {
      title: "", key: "select", width: 40,
      render: (_, r) => r.billable && !r.invoiced && !r.is_running ? (
        <Checkbox
          checked={selectedIds.includes(r.id)}
          onChange={e => {
            setSelectedIds(prev => e.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id));
          }}
        />
      ) : null,
    },
    {
      title: "Description", key: "desc",
      render: (_, r) => (
        <div>
          <Text style={{ fontSize: 13 }}>{r.description || <Text type="secondary" italic>No description</Text>}</Text>
          <div style={{ marginTop: 2 }}>
            {r.projects?.name && <Tag style={{ fontSize: 11, borderRadius: 10 }}>{r.projects.name}</Tag>}
            {r.tasks?.title && <Tag color="blue" style={{ fontSize: 11, borderRadius: 10 }}>{r.tasks.title}</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: "Duration", key: "duration", width: 110,
      render: (_, r) => r.is_running ? (
        <Text strong style={{ color: "#10b981", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
          {formatElapsed(elapsed)}
        </Text>
      ) : (
        <Text style={{ fontSize: 13 }}>{formatDuration(r.duration)}</Text>
      ),
    },
    {
      title: "Rate", key: "rate", width: 90,
      render: (_, r) => r.hourly_rate ? (
        <Text style={{ fontSize: 13 }}>${r.hourly_rate}/hr</Text>
      ) : (
        <Tooltip title="No rate set"><Text type="secondary" style={{ fontSize: 13 }}>—</Text></Tooltip>
      ),
    },
    {
      title: "Amount", key: "amount", width: 100,
      render: (_, r) => (
        <Text strong style={{ fontSize: 13, color: r.amount > 0 ? "#10b981" : "#94a3b8" }}>
          ${(r.amount ?? 0).toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status", key: "status", width: 100,
      render: (_, r) => (
        <Space size={4}>
          {r.billable ? (
            <Tag color="green" style={{ fontSize: 11, borderRadius: 10 }}>Billable</Tag>
          ) : (
            <Tag style={{ fontSize: 11, borderRadius: 10 }}>Non-bill</Tag>
          )}
          {r.invoiced && <Tag color="blue" style={{ fontSize: 11, borderRadius: 10 }}>Invoiced</Tag>}
          {r.is_running && <Tag color="green" style={{ fontSize: 11, borderRadius: 10 }}>Running</Tag>}
        </Space>
      ),
    },
    {
      title: "Actions", key: "actions", width: 120,
      render: (_, r) => (
        <Space size={4}>
          {r.is_running ? (
            <Tooltip title="Stop timer">
              <Button size="small" type="primary" danger icon={<PauseCircleFilled />} onClick={stopTimer} style={{ borderRadius: 6 }} />
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Edit">
                <Button size="small" type="text" icon={<EditOutlined />} onClick={() => {
                  setEditEntry({
                    id: r.id,
                    description: r.description,
                    project_id: r.project_id,
                    task_id: r.task_id,
                    client_id: r.client_id,
                    date: r.date,
                    duration: r.duration,
                    billable: r.billable,
                    hourly_rate: r.hourly_rate,
                  });
                  setModalOpen(true);
                }} />
              </Tooltip>
              <Tooltip title="Delete">
                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => deleteEntry(r.id)} />
              </Tooltip>
            </>
          )}
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
            <ClockCircleOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Time Tracking</Title>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Track time, manage entries, and invoice clients for your work.</Text>
        </div>
        <Space>
          {selectedIds.length > 0 && (
            <Button type="primary" icon={<DollarOutlined />} onClick={() => setInvoiceOpen(true)} style={{ borderRadius: 10, fontWeight: 600, background: "#10b981", borderColor: "#10b981" }}>
              Invoice {selectedIds.length} Entries
            </Button>
          )}
          <Button icon={<PlusOutlined />} size="large" onClick={() => { setEditEntry(null); setModalOpen(true); }} style={{ borderRadius: 10, fontWeight: 600 }}>
            Add Manual Entry
          </Button>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }}>
        {[
          { label: "Total Hours", value: `${(totalMins / 60).toFixed(1)}h`, color: "#0ea5e9", bg: "#eff6ff", icon: <ClockCircleOutlined /> },
          { label: "Billable Amount", value: `$${totalBillableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "#10b981", bg: "#f0fdf4", icon: <DollarOutlined /> },
          { label: "Billable Entries", value: String(billableEntries), color: "#7c3aed", bg: "#faf5ff", icon: <CheckCircleOutlined /> },
          { label: "Total Entries", value: String(filtered.length), color: "#f59e0b", bg: "#fffbeb", icon: <CalendarOutlined /> },
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

      {/* Running Timer Banner */}
      {runningEntry && (
        <Card style={{ borderRadius: 16, border: "2px solid #10b981", background: "#f0fdf4", marginBottom: 20 }} styles={{ body: { padding: "16px 24px" } }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <Space size={16}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
              <div>
                <Text strong style={{ fontSize: 15 }}>{runningEntry.description || "Timer running"}</Text>
                {runningEntry.projects?.name && <Tag style={{ marginLeft: 8, fontSize: 11 }}>{runningEntry.projects.name}</Tag>}
              </div>
            </Space>
            <Space size={16}>
              <Text strong style={{ fontSize: 28, fontVariantNumeric: "tabular-nums", color: "#10b981", letterSpacing: "1px" }}>
                {formatElapsed(elapsed)}
              </Text>
              <Button type="primary" danger icon={<PauseCircleFilled />} size="large" onClick={stopTimer} style={{ borderRadius: 10, fontWeight: 700 }}>
                Stop
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* Quick Start Timer */}
      {!runningEntry && (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }} styles={{ body: { padding: "16px 20px" } }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Input
              placeholder="What are you working on?"
              value={quickDesc}
              onChange={e => setQuickDesc(e.target.value)}
              onPressEnter={startTimer}
              style={{ flex: 1, minWidth: 200, borderRadius: 8 }}
              size="large"
            />
            <Select
              allowClear
              placeholder="Project"
              value={quickProjectId}
              onChange={v => {
                setQuickProjectId(v ?? null);
                if (v) {
                  const p = projects.find(p => p.id === v);
                  if (p?.default_hourly_rate) setQuickRate(p.default_hourly_rate);
                }
              }}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
              style={{ width: 160 }}
              size="large"
            />
            <InputNumber
              placeholder="$/hr"
              value={quickRate}
              onChange={v => setQuickRate(v)}
              min={0}
              prefix="$"
              style={{ width: 100, borderRadius: 8 }}
              size="large"
            />
            <Tooltip title={quickBillable ? "Billable" : "Non-billable"}>
              <Switch
                checked={quickBillable}
                onChange={setQuickBillable}
                checkedChildren={<DollarOutlined />}
                unCheckedChildren={<DollarOutlined />}
              />
            </Tooltip>
            <Button type="primary" icon={<PlayCircleFilled />} size="large" onClick={startTimer} style={{ borderRadius: 10, fontWeight: 700 }}>
              Start Timer
            </Button>
          </div>
        </Card>
      )}

      {/* Filters & View Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <Space>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={v => { if (v?.[0] && v?.[1]) setDateRange([v[0], v[1]]); }}
            style={{ borderRadius: 8 }}
          />
          <Select
            allowClear placeholder="All Projects"
            value={filterProject}
            onChange={v => setFilterProject(v ?? null)}
            options={projects.map(p => ({ value: p.id, label: p.name }))}
            style={{ width: 160 }}
          />
          <Select
            allowClear placeholder="All Types"
            value={filterBillable === null ? undefined : filterBillable ? "billable" : "nonbillable"}
            onChange={v => setFilterBillable(v === "billable" ? true : v === "nonbillable" ? false : null)}
            options={[
              { value: "billable", label: "Billable only" },
              { value: "nonbillable", label: "Non-billable only" },
            ]}
            style={{ width: 150 }}
          />
        </Space>
        <Radio.Group value={view} onChange={e => setView(e.target.value)} buttonStyle="solid">
          <Radio.Button value="daily">Daily</Radio.Button>
          <Radio.Button value="weekly">Weekly</Radio.Button>
        </Radio.Group>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
      ) : filtered.length === 0 && !runningEntry ? (
        <Card style={{ borderRadius: 16, border: "2px dashed #e2e8f0", textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <ClockCircleOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#64748b", margin: "0 0 8px" }}>No time entries yet</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>Start a timer or add a manual entry to begin tracking your time.</Text>
          <Space>
            <Button type="primary" size="large" icon={<PlayCircleFilled />} onClick={() => { setQuickDesc(""); startTimer(); }} style={{ borderRadius: 12 }}>Start Timer</Button>
            <Button size="large" icon={<PlusOutlined />} onClick={() => { setEditEntry(null); setModalOpen(true); }} style={{ borderRadius: 12 }}>Add Entry</Button>
          </Space>
        </Card>
      ) : view === "daily" ? (
        /* Daily View */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sortedDates.map(date => {
            const dayEntries = grouped[date];
            const dayMins = dayEntries.reduce((s, e) => s + e.duration, 0);
            const dayAmount = dayEntries.filter(e => e.billable).reduce((s, e) => s + (e.amount ?? 0), 0);
            return (
              <Card key={date} style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
                <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ fontSize: 14 }}>
                    {dayjs(date).format("ddd, MMM D, YYYY")}
                    {dayjs(date).isSame(dayjs(), "day") && <Tag color="blue" style={{ marginLeft: 8, fontSize: 11, borderRadius: 10 }}>Today</Tag>}
                  </Text>
                  <Space size={16}>
                    <Text type="secondary" style={{ fontSize: 13 }}>{formatDuration(dayMins)}</Text>
                    <Text strong style={{ fontSize: 13, color: "#10b981" }}>${dayAmount.toFixed(2)}</Text>
                  </Space>
                </div>
                <Table
                  dataSource={dayEntries}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  rowClassName={r => r.invoiced ? "invoiced-row" : ""}
                />
              </Card>
            );
          })}
        </div>
      ) : (
        /* Weekly View */
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 20 } }}>
          <Row gutter={[12, 12]}>
            {weekDays.map(day => {
              const dateStr = day.format("YYYY-MM-DD");
              const dayEntries = filtered.filter(e => e.date === dateStr);
              const dayMins = dayEntries.reduce((s, e) => s + e.duration, 0);
              const isToday = day.isSame(dayjs(), "day");
              return (
                <Col key={dateStr} xs={24} sm={12} md={24 / 7 > 3 ? 24 / 7 : 3}>
                  <div style={{
                    border: `1.5px solid ${isToday ? "#0ea5e9" : "#e2e8f0"}`,
                    borderRadius: 12,
                    padding: 12,
                    minHeight: 120,
                    background: isToday ? "#eff6ff" : "#fff",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 12, color: isToday ? "#0ea5e9" : "#64748b" }}>
                        {day.format("ddd")}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#94a3b8" }}>{day.format("D")}</Text>
                    </div>
                    {dayEntries.length === 0 ? (
                      <Text type="secondary" style={{ fontSize: 11 }}>No entries</Text>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {dayEntries.slice(0, 3).map(e => (
                          <div key={e.id} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 6, background: e.billable ? "#f0fdf4" : "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {e.description || "—"} <Text type="secondary" style={{ fontSize: 10 }}>{formatDuration(e.duration)}</Text>
                          </div>
                        ))}
                        {dayEntries.length > 3 && <Text type="secondary" style={{ fontSize: 10 }}>+{dayEntries.length - 3} more</Text>}
                      </div>
                    )}
                    <div style={{ marginTop: 8, borderTop: "1px solid #f1f5f9", paddingTop: 4 }}>
                      <Text strong style={{ fontSize: 12, color: dayMins > 0 ? "#10b981" : "#94a3b8" }}>
                        {formatDuration(dayMins)}
                      </Text>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Entry Modal */}
      <TimeEntryModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditEntry(null); }}
        onSave={handleSaveEntry}
        initialData={editEntry}
        saving={saving}
      />

      {/* Invoice Modal */}
      <InvoiceFromTimeEntries
        open={invoiceOpen}
        onClose={() => { setInvoiceOpen(false); setSelectedIds([]); }}
        entries={selectedEntries}
        onCreated={() => { setInvoiceOpen(false); setSelectedIds([]); load(); }}
      />

      <style jsx global>{`
        .invoiced-row { opacity: 0.5; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
