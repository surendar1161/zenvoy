"use client";

import { useEffect, useState } from "react";
import {
  Modal, Form, Input, InputNumber, DatePicker, Select, Switch, Space, Typography, Row, Col,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";

const { Text } = Typography;

interface Project { id: string; name: string; client_id: string | null; default_hourly_rate: number | null; }
interface Task { id: string; title: string; project_id: string; }

export interface TimeEntryData {
  id?: string;
  description: string;
  project_id: string | null;
  task_id: string | null;
  client_id: string | null;
  date: string;
  duration: number;
  billable: boolean;
  hourly_rate: number | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (entry: TimeEntryData) => void;
  initialData?: TimeEntryData | null;
  saving?: boolean;
}

export default function TimeEntryModal({ open, onClose, onSave, initialData, saving }: Props) {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.from("projects").select("id, name, client_id, default_hourly_rate").order("name").then(({ data }) => {
      setProjects((data ?? []) as Project[]);
    });
  }, [open]);

  useEffect(() => {
    if (!selectedProjectId) { setTasks([]); return; }
    const supabase = createClient();
    supabase.from("tasks").select("id, title, project_id").eq("project_id", selectedProjectId).order("title").then(({ data }) => {
      setTasks((data ?? []) as Task[]);
    });
  }, [selectedProjectId]);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        description: initialData.description,
        project_id: initialData.project_id,
        task_id: initialData.task_id,
        date: initialData.date ? dayjs(initialData.date) : dayjs(),
        hours: Math.floor(initialData.duration / 60),
        minutes: initialData.duration % 60,
        billable: initialData.billable,
        hourly_rate: initialData.hourly_rate,
      });
      setSelectedProjectId(initialData.project_id);
    } else if (open) {
      form.resetFields();
      setSelectedProjectId(null);
    }
  }, [open, initialData, form]);

  function handleProjectChange(projectId: string | null) {
    setSelectedProjectId(projectId);
    form.setFieldValue("task_id", null);
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj?.default_hourly_rate && !form.getFieldValue("hourly_rate")) {
        form.setFieldValue("hourly_rate", proj.default_hourly_rate);
      }
    }
  }

  async function handleSubmit() {
    const values = await form.validateFields();
    const hours = values.hours ?? 0;
    const mins = values.minutes ?? 0;
    const duration = hours * 60 + mins;
    if (duration <= 0) { return; }

    const proj = projects.find(p => p.id === values.project_id);

    onSave({
      id: initialData?.id,
      description: values.description ?? "",
      project_id: values.project_id ?? null,
      task_id: values.task_id ?? null,
      client_id: proj?.client_id ?? null,
      date: values.date?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      duration,
      billable: values.billable ?? true,
      hourly_rate: values.hourly_rate ?? null,
    });
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<Space><ClockCircleOutlined style={{ color: "#0ea5e9" }} />{initialData?.id ? "Edit Time Entry" : "Add Time Entry"}</Space>}
      width={560}
      okText={initialData?.id ? "Update" : "Add Entry"}
      onOk={handleSubmit}
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical" size="large" style={{ marginTop: 16 }}
        initialValues={{ billable: true, date: dayjs(), hours: 0, minutes: 0 }}>
        <Form.Item name="description" label={<Text strong style={{ fontSize: 13 }}>Description</Text>}>
          <Input placeholder="What did you work on?" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="project_id" label={<Text strong style={{ fontSize: 13 }}>Project</Text>}>
              <Select
                allowClear placeholder="Select project"
                options={projects.map(p => ({ value: p.id, label: p.name }))}
                onChange={handleProjectChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="task_id" label={<Text strong style={{ fontSize: 13 }}>Task</Text>}>
              <Select
                allowClear placeholder={selectedProjectId ? "Select task" : "Select project first"}
                disabled={!selectedProjectId}
                options={tasks.map(t => ({ value: t.id, label: t.title }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="date" label={<Text strong style={{ fontSize: 13 }}>Date</Text>}>
              <DatePicker style={{ width: "100%", borderRadius: 8 }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<Text strong style={{ fontSize: 13 }}>Duration</Text>}>
              <Space>
                <Form.Item name="hours" noStyle>
                  <InputNumber min={0} max={23} placeholder="0" style={{ width: 70, borderRadius: 8 }} addonAfter="h" />
                </Form.Item>
                <Form.Item name="minutes" noStyle>
                  <InputNumber min={0} max={59} placeholder="0" style={{ width: 70, borderRadius: 8 }} addonAfter="m" />
                </Form.Item>
              </Space>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="hourly_rate" label={<Text strong style={{ fontSize: 13 }}>Hourly Rate</Text>}>
              <InputNumber min={0} prefix="$" placeholder="0" style={{ width: "100%", borderRadius: 8 }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="billable" valuePropName="checked" style={{ marginBottom: 0 }}>
          <Space>
            <Switch size="small" />
            <Text style={{ fontSize: 13 }}>Billable</Text>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
