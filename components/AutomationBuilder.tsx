"use client";

import { useState } from "react";
import { Button, Form, Input, Modal, Select, Space, Switch, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const TRIGGER_TYPES = [
  { value: "proposal_accepted",  label: "Proposal Accepted" },
  { value: "proposal_viewed",    label: "Proposal Viewed" },
  { value: "proposal_signed",    label: "Proposal Signed" },
  { value: "proposal_declined",  label: "Proposal Declined" },
  { value: "contract_signed",    label: "Contract Signed" },
  { value: "invoice_paid",       label: "Invoice Paid" },
  { value: "invoice_overdue",    label: "Invoice Overdue" },
  { value: "invoice_sent",       label: "Invoice Sent" },
  { value: "payment_received",   label: "Payment Received" },
  { value: "payment_failed",     label: "Payment Failed" },
  { value: "proposal_follow_up", label: "Proposal Unopened (Follow-up)" },
];

const ACTION_TYPES = [
  { value: "send_email",          label: "Send Email Notification" },
  { value: "create_notification", label: "Create In-App Notification" },
  { value: "create_task",         label: "Create Task" },
  { value: "create_invoice",      label: "Create Draft Invoice" },
  { value: "update_status",       label: "Update Document Status" },
];

const CONDITION_OPERATORS = [
  { value: "eq",       label: "equals" },
  { value: "neq",      label: "not equals" },
  { value: "gt",       label: "greater than" },
  { value: "lt",       label: "less than" },
  { value: "contains", label: "contains" },
  { value: "exists",   label: "exists (not empty)" },
];

interface Action {
  type: string;
  config: Record<string, string>;
}

interface Condition {
  field: string;
  operator: string;
  value: string;
}

export interface AutomationData {
  id?: string;
  name: string;
  description: string | null;
  trigger_type: string;
  conditions: Condition[];
  actions: Action[];
  enabled: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: AutomationData) => void;
  initial?: AutomationData | null;
  saving?: boolean;
}

export default function AutomationBuilder({ open, onClose, onSave, initial, saving }: Props) {
  const [form] = Form.useForm();
  const [actions, setActions] = useState<Action[]>(initial?.actions ?? [{ type: "create_notification", config: { title: "", body: "" } }]);
  const [conditions, setConditions] = useState<Condition[]>(initial?.conditions ?? []);

  function addAction() {
    setActions(prev => [...prev, { type: "create_notification", config: { title: "", body: "" } }]);
  }

  function removeAction(i: number) {
    setActions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateAction(i: number, field: string, value: string) {
    setActions(prev => prev.map((a, idx) => {
      if (idx !== i) return a;
      if (field === "type") return { type: value, config: {} };
      return { ...a, config: { ...a.config, [field]: value } };
    }));
  }

  function addCondition() {
    setConditions(prev => [...prev, { field: "", operator: "eq", value: "" }]);
  }

  function removeCondition(i: number) {
    setConditions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateCondition(i: number, field: string, value: string) {
    setConditions(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  async function handleSave() {
    const values = await form.validateFields();
    onSave({
      id: initial?.id,
      name: values.name,
      description: values.description ?? "",
      trigger_type: values.trigger_type,
      conditions,
      actions: actions.filter(a => a.type),
      enabled: values.enabled ?? true,
    });
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={initial?.id ? "Edit Automation" : "Create Automation"}
      width={640}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}
          style={{ borderRadius: 8, fontWeight: 600 }}>
          {initial?.id ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        trigger_type: initial?.trigger_type ?? undefined,
        enabled: initial?.enabled ?? true,
      }}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="e.g., Send contract after proposal accepted" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} placeholder="What does this automation do?" />
        </Form.Item>

        <Form.Item name="trigger_type" label="When this happens..." rules={[{ required: true }]}>
          <Select options={TRIGGER_TYPES} placeholder="Select trigger" />
        </Form.Item>

        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>

      {/* Conditions */}
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 8 }}>
          <Text strong>Conditions (optional)</Text>
          <Button size="small" icon={<PlusOutlined />} onClick={addCondition}>Add</Button>
        </Space>
        {conditions.map((c, i) => (
          <Space key={i} style={{ display: "flex", marginBottom: 8 }} align="start">
            <Input value={c.field} onChange={e => updateCondition(i, "field", e.target.value)}
              placeholder="Field (e.g. amount)" style={{ width: 140 }} />
            <Select value={c.operator} onChange={v => updateCondition(i, "operator", v)}
              options={CONDITION_OPERATORS} style={{ width: 130 }} />
            {c.operator !== "exists" && (
              <Input value={c.value} onChange={e => updateCondition(i, "value", e.target.value)}
                placeholder="Value" style={{ width: 120 }} />
            )}
            <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeCondition(i)} />
          </Space>
        ))}
      </div>

      {/* Actions */}
      <div>
        <Space style={{ marginBottom: 8 }}>
          <Text strong>Then do this...</Text>
          <Button size="small" icon={<PlusOutlined />} onClick={addAction}>Add Action</Button>
        </Space>
        {actions.map((a, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 10, border: "1px solid #e2e8f0" }}>
            <Space style={{ width: "100%", marginBottom: 8 }} align="start">
              <Select value={a.type} onChange={v => updateAction(i, "type", v)}
                options={ACTION_TYPES} style={{ width: 220 }} />
              <Button icon={<DeleteOutlined />} danger size="small" onClick={() => removeAction(i)} />
            </Space>
            {(a.type === "create_notification" || a.type === "send_email") && (
              <>
                <Input value={a.config.title ?? ""} onChange={e => updateAction(i, "title", e.target.value)}
                  placeholder="Title (use {{clientName}} for variables)" style={{ marginBottom: 6 }} />
                {a.type === "create_notification" && (
                  <Input.TextArea value={a.config.body ?? ""} onChange={e => updateAction(i, "body", e.target.value)}
                    placeholder="Body" rows={2} />
                )}
                {a.type === "send_email" && (
                  <Select value={a.config.notification_type ?? undefined}
                    onChange={v => updateAction(i, "notification_type", v)}
                    options={TRIGGER_TYPES.map(t => ({ ...t, label: `${t.label} email` }))}
                    placeholder="Email type" style={{ width: "100%" }} />
                )}
              </>
            )}
            {a.type === "create_task" && (
              <Input value={a.config.title ?? ""} onChange={e => updateAction(i, "title", e.target.value)}
                placeholder="Task title (use {{clientName}} for variables)" />
            )}
            {a.type === "create_invoice" && (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Input value={a.config.title ?? ""} onChange={e => updateAction(i, "title", e.target.value)}
                  placeholder="Invoice title" />
                <Input value={a.config.amount ?? ""} onChange={e => updateAction(i, "amount", e.target.value)}
                  placeholder="Amount" type="number" />
              </Space>
            )}
            {a.type === "update_status" && (
              <Space style={{ width: "100%" }}>
                <Select value={a.config.table ?? undefined} onChange={v => updateAction(i, "table", v)}
                  options={[{ value: "proposals", label: "Proposals" }, { value: "contracts", label: "Contracts" }, { value: "invoices", label: "Invoices" }]}
                  placeholder="Table" style={{ width: 140 }} />
                <Input value={a.config.status ?? ""} onChange={e => updateAction(i, "status", e.target.value)}
                  placeholder="New status" />
              </Space>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
