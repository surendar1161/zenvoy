"use client";

import { useEffect, useState } from "react";
import {
  Avatar, Button, Card, Col, Empty, Form, Input, InputNumber, Modal,
  Progress, Row, Select, Space, Spin, Tag, Tooltip, Typography, message,
  Badge, Popconfirm,
} from "antd";
import {
  PlusOutlined, UserOutlined, ProjectOutlined, EditOutlined,
  DeleteOutlined, TeamOutlined, CheckCircleOutlined, WarningOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const AVATAR_COLORS = [
  "#0ea5e9","#7c3aed","#10b981","#f59e0b","#ef4444",
  "#0369a1","#5b21b6","#065f46","#92400e","#334155",
];

type TeamMember = {
  id: string; name: string | null; email: string; title: string | null;
  avatar_color: string; capacity_hours_pw: number; hourly_rate: number;
  skills: string[]; is_active: boolean; role: string;
};

type Project = {
  id: string; name: string; color: string; status: string;
  due_date: string | null; client?: { name: string } | null;
};

type Assignment = {
  id: string; team_member_id: string; project_id: string;
  role_on_project: string | null; allocated_hours: number;
  hours_per_week: number; start_date: string | null; end_date: string | null;
  project?: Project;
};

type MemberWithLoad = TeamMember & {
  assignments: Assignment[];
  total_allocated_pw: number;
  utilization_pct: number;
};

export default function CapacityPage() {
  const router = useRouter();
  const [allowed, setAllowed]       = useState<boolean | null>(null);
  const [members, setMembers]       = useState<MemberWithLoad[]>([]);
  const [projects, setProjects]     = useState<Project[]>([]);
  const [loading, setLoading]       = useState(true);
  const [memberModal, setMemberModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberWithLoad | null>(null);
  const [saving, setSaving]         = useState(false);
  const [memberForm] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [msgApi, ctx] = message.useMessage();
  const supabase = createClient();

  useEffect(() => {
    isFeatureEnabled("capacity_planning").then(ok => {
      setAllowed(ok);
      if (ok) loadAll();
      else setLoading(false);
    });
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [membersRes, projectsRes, assignRes] = await Promise.all([
      supabase.from("team_members").select("*").eq("owner_id", user.id).eq("is_active", true).order("name"),
      supabase.from("projects").select("id,name,color,status,due_date,clients(name)").eq("user_id", user.id).not("status","in","(completed,cancelled)").order("name"),
      supabase.from("project_assignments").select("*, project:projects(id,name,color,status,due_date)").eq("owner_id", user.id),
    ]);

    const rawMembers = (membersRes.data || []) as TeamMember[];
    const rawAssignments = (assignRes.data || []) as Assignment[];
    setProjects((projectsRes.data || []) as Project[]);

    const enriched: MemberWithLoad[] = rawMembers.map(m => {
      const mine = rawAssignments.filter(a => a.team_member_id === m.id);
      const totalPW = mine.reduce((s, a) => s + (a.hours_per_week || 0), 0);
      return {
        ...m,
        assignments: mine,
        total_allocated_pw: totalPW,
        utilization_pct: m.capacity_hours_pw > 0 ? Math.min(100, Math.round((totalPW / m.capacity_hours_pw) * 100)) : 0,
      };
    });

    setMembers(enriched);
    setLoading(false);
  };

  const saveMember = async (values: any) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const color = editingMember?.avatar_color || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    if (editingMember) {
      await supabase.from("team_members").update({
        name: values.name, title: values.title,
        capacity_hours_pw: values.capacity_hours_pw,
        hourly_rate: values.hourly_rate || 0,
        skills: values.skills || [],
      }).eq("id", editingMember.id);
    } else {
      await supabase.from("team_members").insert({
        owner_id: user.id, email: values.email, name: values.name,
        title: values.title, avatar_color: color,
        capacity_hours_pw: values.capacity_hours_pw || 40,
        hourly_rate: values.hourly_rate || 0,
        skills: values.skills || [],
        status: "active", is_active: true,
      });
    }

    setSaving(false);
    setMemberModal(false);
    setEditingMember(null);
    memberForm.resetFields();
    loadAll();
  };

  const deleteMember = async (id: string) => {
    await supabase.from("team_members").update({ is_active: false }).eq("id", id);
    loadAll();
  };

  const saveAssignment = async (values: any) => {
    if (!selectedMember) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("project_assignments").upsert({
      owner_id: user.id,
      team_member_id: selectedMember.id,
      project_id: values.project_id,
      role_on_project: values.role_on_project || null,
      allocated_hours: values.allocated_hours || 0,
      hours_per_week: values.hours_per_week || 0,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
    }, { onConflict: "team_member_id,project_id" });

    setSaving(false);
    setAssignModal(false);
    assignForm.resetFields();
    loadAll();
  };

  const removeAssignment = async (id: string) => {
    await supabase.from("project_assignments").delete().eq("id", id);
    loadAll();
  };

  const utilizationColor = (pct: number) => {
    if (pct >= 100) return "#ef4444";
    if (pct >= 80)  return "#f59e0b";
    return "#10b981";
  };

  const utilizationLabel = (pct: number) => {
    if (pct >= 100) return "Over capacity";
    if (pct >= 80)  return "Near capacity";
    if (pct === 0)  return "Available";
    return "On track";
  };

  // ── Feature gate ──────────────────────────────────────────────────────────────
  if (allowed === null || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ padding: "80px 40px", textAlign: "center" }}>
        <LockOutlined style={{ fontSize: 48, color: "#94a3b8", marginBottom: 16 }} />
        <Title level={4} style={{ color: "#475569" }}>Capacity Planning</Title>
        <Text type="secondary">This feature is not available on your current plan.</Text>
      </div>
    );
  }

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const totalCapacity   = members.reduce((s, m) => s + m.capacity_hours_pw, 0);
  const totalAllocated  = members.reduce((s, m) => s + m.total_allocated_pw, 0);
  const overCapacity    = members.filter(m => m.utilization_pct >= 100).length;
  const available       = members.filter(m => m.utilization_pct < 50).length;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      {ctx}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Title level={3} style={{ margin: 0 }}>📊 Capacity Planning</Title>
            <Tag color="blue" style={{ borderRadius: 20, fontSize: 11 }}>Beta</Tag>
          </div>
          <Text type="secondary">Track team workload, project assignments, and availability at a glance.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingMember(null); memberForm.resetFields(); setMemberModal(true); }}
          style={{ borderRadius: 8, fontWeight: 600 }}>
          Add Team Member
        </Button>
      </div>

      {/* KPI cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {[
          { label: "Team Members",     value: members.length, color: "#0ea5e9", icon: "👥" },
          { label: "Total Capacity",   value: `${totalCapacity}h/wk`, color: "#7c3aed", icon: "⏱" },
          { label: "Allocated",        value: `${totalAllocated}h/wk`, color: "#f59e0b", icon: "📋" },
          { label: "Over Capacity",    value: overCapacity, color: overCapacity > 0 ? "#ef4444" : "#10b981", icon: overCapacity > 0 ? "⚠️" : "✅" },
        ].map(c => (
          <Col key={c.label} xs={12} md={6}>
            <Card style={{ borderRadius: 14, border: "1px solid #e2e8f0" }} styles={{ body: { padding: "16px 20px" } }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Team members */}
      {members.length === 0 ? (
        <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0", textAlign: "center", padding: "48px 0" }}>
          <TeamOutlined style={{ fontSize: 48, color: "#e2e8f0", marginBottom: 16 }} />
          <Title level={5} style={{ color: "#94a3b8" }}>No team members yet</Title>
          <Text type="secondary">Add your team to start planning capacity and project assignments.</Text>
          <br /><br />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setMemberModal(true)}>Add First Team Member</Button>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {members.map(member => {
            const initials = (member.name || member.email).split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
            const color = utilizationColor(member.utilization_pct);

            return (
              <Card key={member.id} style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} styles={{ body: { padding: 0 } }}>
                {/* Member header */}
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: member.assignments.length > 0 ? "1px solid #f1f5f9" : "none" }}>
                  <Avatar size={44} style={{ background: member.avatar_color, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{initials}</Avatar>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <Text strong style={{ fontSize: 15 }}>{member.name || member.email}</Text>
                      {member.title && <Text type="secondary" style={{ fontSize: 12 }}>· {member.title}</Text>}
                      <Tag style={{ borderRadius: 20, fontSize: 10, marginLeft: 4,
                        color, background: color + "15", border: `1px solid ${color}40` }}>
                        {utilizationLabel(member.utilization_pct)}
                      </Tag>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{member.email}</Text>
                      {member.hourly_rate > 0 && <Text type="secondary" style={{ fontSize: 12 }}>· ${member.hourly_rate}/hr</Text>}
                      {member.skills?.length > 0 && member.skills.slice(0, 3).map(s => (
                        <Tag key={s} style={{ borderRadius: 20, fontSize: 10, margin: 0 }}>{s}</Tag>
                      ))}
                    </div>
                  </div>

                  {/* Utilization bar */}
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ fontSize: 11, color: "#64748b" }}>
                        {member.total_allocated_pw}h / {member.capacity_hours_pw}h per week
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: 700, color }}>{member.utilization_pct}%</Text>
                    </div>
                    <Progress percent={member.utilization_pct} showInfo={false} size="small"
                      strokeColor={color} trailColor="#f1f5f9" style={{ margin: 0 }} />
                  </div>

                  {/* Actions */}
                  <Space>
                    <Tooltip title="Assign to project">
                      <Button size="small" icon={<ProjectOutlined />} onClick={() => { setSelectedMember(member); assignForm.resetFields(); setAssignModal(true); }}
                        style={{ borderRadius: 7 }} />
                    </Tooltip>
                    <Tooltip title="Edit member">
                      <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditingMember(member);
                        memberForm.setFieldsValue({ ...member, skills: member.skills || [] });
                        setMemberModal(true);
                      }} style={{ borderRadius: 7 }} />
                    </Tooltip>
                    <Popconfirm title="Remove from team?" onConfirm={() => deleteMember(member.id)} okText="Remove" okButtonProps={{ danger: true }}>
                      <Tooltip title="Remove member">
                        <Button size="small" icon={<DeleteOutlined />} danger style={{ borderRadius: 7 }} />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                </div>

                {/* Assignments */}
                {member.assignments.length > 0 && (
                  <div style={{ padding: "12px 20px 16px 80px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {member.assignments.map(a => {
                      const proj = a.project;
                      if (!proj) return null;
                      const allocPct = member.capacity_hours_pw > 0 ? Math.round(((a.hours_per_week || 0) / member.capacity_hours_pw) * 100) : 0;
                      return (
                        <div key={a.id} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          background: "#f8fafc", border: "1px solid #e2e8f0",
                          borderRadius: 10, padding: "7px 12px",
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: proj.color, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{proj.name}</div>
                            {a.role_on_project && <div style={{ fontSize: 10, color: "#94a3b8" }}>{a.role_on_project}</div>}
                          </div>
                          <Tag style={{ margin: 0, fontSize: 10, borderRadius: 20, background: "#eff6ff", color: "#0369a1", border: "none" }}>
                            {a.hours_per_week}h/wk · {allocPct}%
                          </Tag>
                          <Popconfirm title="Remove this assignment?" onConfirm={() => removeAssignment(a.id)} okText="Remove" okButtonProps={{ danger: true }}>
                            <Button type="text" size="small" style={{ fontSize: 11, color: "#94a3b8", padding: "0 4px", height: "auto" }}>✕</Button>
                          </Popconfirm>
                        </div>
                      );
                    })}
                    <Button type="dashed" size="small" icon={<PlusOutlined />}
                      style={{ borderRadius: 10, fontSize: 11, height: 34 }}
                      onClick={() => { setSelectedMember(member); assignForm.resetFields(); setAssignModal(true); }}>
                      Add project
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit team member modal ─────────────────────────────────────────── */}
      <Modal
        open={memberModal}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        onCancel={() => { setMemberModal(false); setEditingMember(null); memberForm.resetFields(); }}
        footer={null}
        width={500}
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form form={memberForm} layout="vertical" onFinish={saveMember}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Alex Johnson" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: !editingMember, message: "Required" }, { type: "email" }]}>
                <Input placeholder="alex@studio.com" disabled={!!editingMember} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="title" label="Role / Title">
                <Input placeholder="Senior Designer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hourly_rate" label="Hourly Rate ($)">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="85" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="capacity_hours_pw" label="Capacity (hours/week)" rules={[{ required: true }]}>
            <InputNumber min={1} max={80} style={{ width: "100%" }} placeholder="40" />
          </Form.Item>
          <Form.Item name="skills" label="Skills (optional)">
            <Select mode="tags" placeholder="React, Figma, Copywriting..." tokenSeparators={[","]} />
          </Form.Item>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
            <Button onClick={() => { setMemberModal(false); setEditingMember(null); memberForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Assign to project modal ────────────────────────────────────────────── */}
      <Modal
        open={assignModal}
        title={`Assign ${selectedMember?.name || "member"} to a project`}
        onCancel={() => { setAssignModal(false); assignForm.resetFields(); }}
        footer={null}
        width={480}
      >
        <Form form={assignForm} layout="vertical" onFinish={saveAssignment} style={{ paddingTop: 8 }}>
          <Form.Item name="project_id" label="Project" rules={[{ required: true, message: "Select a project" }]}>
            <Select placeholder="Select project..." showSearch optionFilterProp="label">
              {projects
                .filter(p => !selectedMember?.assignments.find(a => a.project_id === p.id))
                .map(p => (
                  <Option key={p.id} value={p.id} label={p.name}>
                    <Space>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                      {p.name}
                      <Tag style={{ borderRadius: 20, fontSize: 10 }}>{p.status}</Tag>
                    </Space>
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item name="role_on_project" label="Role on this project">
            <Input placeholder="e.g. Lead Designer, Backend Dev, PM" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="hours_per_week" label="Hours / week" rules={[{ required: true }]}>
                <InputNumber min={0} max={80} style={{ width: "100%" }} placeholder="20" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="allocated_hours" label="Total hours allocated">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="120" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
            <Button onClick={() => { setAssignModal(false); assignForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>Assign</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
