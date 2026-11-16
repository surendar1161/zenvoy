"use client";

import { useState } from "react";
import { Alert, Button, Drawer, Empty, Form, Input, Modal, Progress, Select, Space, Switch, Tag, Typography, message } from "antd";
import {
  ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  FIELD_TYPES, MAX_NAME_LENGTH, sortedDefinitions,
  type CustomFieldDefinition, type FieldEntity, type FieldType,
} from "@/lib/custom-fields";
import type { CustomFieldsApi } from "@/lib/use-custom-fields";

const { Text } = Typography;

interface FormValues { name: string; field_type: FieldType; options?: string[]; required?: boolean; show_in_list?: boolean }

/**
 * Create, rename, reorder and delete custom fields for projects or tasks,
 * with the Free-plan usage meter.
 */
export default function ManageFieldsDrawer({
  open, onClose, entity, api,
}: { open: boolean; onClose: () => void; entity: FieldEntity; api: CustomFieldsApi }) {
  const [msgApi, ctx] = message.useMessage();
  const [editing, setEditing] = useState<CustomFieldDefinition | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const fieldType: FieldType | undefined = Form.useWatch("field_type", form);

  const title = entity === "project" ? "Project custom fields" : "Task custom fields";
  const limitNumber = api.limit === "unlimited" ? null : api.limit;
  const ordered = sortedDefinitions(api.defs);

  function openAdd() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ field_type: "text", required: false, show_in_list: true, options: [] });
    setFormOpen(true);
  }

  function openEdit(def: CustomFieldDefinition) {
    setEditing(def);
    form.resetFields();
    form.setFieldsValue({
      name: def.name, field_type: def.field_type, options: def.options,
      required: def.required, show_in_list: def.show_in_list,
    });
    setFormOpen(true);
  }

  async function submit() {
    const v = await form.validateFields();
    setSaving(true);
    const res = editing
      ? await api.update(editing.id, { name: v.name, options: v.options ?? [], required: !!v.required, show_in_list: v.show_in_list !== false })
      : await api.add({ name: v.name, field_type: v.field_type, options: v.options ?? [], required: !!v.required, show_in_list: v.show_in_list !== false });
    setSaving(false);
    if (!res.ok) { msgApi.error(res.error); return; }
    msgApi.success(editing ? "Field updated" : "Field added");
    setFormOpen(false);
  }

  function confirmDelete(def: CustomFieldDefinition) {
    Modal.confirm({
      title: `Delete "${def.name}"?`,
      content: `This removes the field and every value you entered for it on your ${entity}s. This cannot be undone.`,
      okText: "Delete field", okType: "danger",
      onOk: async () => {
        const res = await api.remove(def.id);
        if (res.ok) msgApi.success("Field deleted"); else msgApi.error(res.error);
      },
    });
  }

  async function toggleListing(def: CustomFieldDefinition, show: boolean) {
    const res = await api.update(def.id, { name: def.name, options: def.options, required: def.required, show_in_list: show });
    if (!res.ok) msgApi.error(res.error);
  }

  return (
    <Drawer open={open} onClose={onClose} width={520} title={title} destroyOnHidden={false}>
      {ctx}
      <div data-testid="manage-fields-drawer">
        <Text type="secondary" style={{ fontSize: 13 }}>
          Your own fields for every {entity}. They appear in the {entity} form, and as columns in the {entity} table when "Show in list" is on.
        </Text>

        <div style={{ margin: "16px 0" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text strong data-testid="fields-usage">
              {limitNumber === null ? `${api.defs.length} fields (unlimited on your plan)` : `${api.defs.length} of ${limitNumber} fields used`}
            </Text>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} disabled={api.atLimit} data-testid="add-field-button">
              Add field
            </Button>
          </Space>
          {limitNumber !== null && (
            <Progress percent={Math.min(100, Math.round(api.defs.length / limitNumber * 100))} showInfo={false}
              strokeColor={api.atLimit ? "#ef4444" : "#0ea5e9"} style={{ marginTop: 6 }} />
          )}
          {api.atLimit && (
            <Alert style={{ marginTop: 10 }} type="warning" showIcon data-testid="fields-limit-alert"
              message="You have used all 3 custom fields on the Free plan."
              description={<Link href="/subscription">Upgrade to Pro for unlimited custom fields</Link>} />
          )}
        </div>

        {ordered.length === 0 ? (
          <Empty description="No custom fields yet. Add one, for example PO number or Stage." />
        ) : (
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            {ordered.map((def, i) => (
              <div key={def.id} data-testid={`field-row-${def.name}`}
                style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }} align="start">
                  <div>
                    <Space size={8} wrap>
                      <Text strong>{def.name}</Text>
                      <Tag style={{ borderRadius: 20, margin: 0 }}>{FIELD_TYPES.find(t => t.value === def.field_type)?.label}</Tag>
                      {def.required && <Tag color="red" style={{ borderRadius: 20, margin: 0 }}>Required</Tag>}
                    </Space>
                    {def.field_type === "select" && (
                      <Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 4 }}>
                        Choices: {def.options.join(", ")}
                      </Text>
                    )}
                  </div>
                  <Space size={2}>
                    <Button type="text" size="small" icon={<ArrowUpOutlined />} disabled={i === 0} onClick={() => api.move(def.id, -1)} aria-label="Move up" />
                    <Button type="text" size="small" icon={<ArrowDownOutlined />} disabled={i === ordered.length - 1} onClick={() => api.move(def.id, 1)} aria-label="Move down" />
                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(def)} aria-label="Edit field" />
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => confirmDelete(def)} aria-label="Delete field" />
                  </Space>
                </Space>
                <Space size={8} style={{ marginTop: 8 }}>
                  <Switch size="small" checked={def.show_in_list} onChange={checked => toggleListing(def, checked)} />
                  <Text type="secondary" style={{ fontSize: 12 }}>Show in the {entity} table</Text>
                </Space>
              </div>
            ))}
          </Space>
        )}
      </div>

      <Modal open={formOpen} onCancel={() => setFormOpen(false)} title={editing ? "Edit field" : "Add a custom field"}
        okText={editing ? "Save" : "Add field"} confirmLoading={saving} onOk={submit} destroyOnHidden={false}>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Field name" rules={[{ required: true, message: "Give the field a name" }, { max: MAX_NAME_LENGTH }]}>
            <Input placeholder={entity === "project" ? "e.g. PO number" : "e.g. Estimated hours"} maxLength={MAX_NAME_LENGTH} />
          </Form.Item>
          <Form.Item name="field_type" label="Type" extra={editing ? "The type cannot be changed after the field is created." : undefined}>
            <Select disabled={!!editing} options={FIELD_TYPES.map(t => ({ value: t.value, label: t.label }))} />
          </Form.Item>
          {fieldType === "select" && (
            <Form.Item name="options" label="Choices" extra="Press Enter after each choice. At least two."
              rules={[{ validator: (_, v: string[] | undefined) => (v && v.filter(x => x.trim()).length >= 2 ? Promise.resolve() : Promise.reject(new Error("Add at least two choices"))) }]}>
              <Select mode="tags" tokenSeparators={[","]} placeholder="e.g. Design, Build, Review" open={false} />
            </Form.Item>
          )}
          {fieldType !== "checkbox" && (
            <Form.Item name="required" valuePropName="checked" label="Required">
              <Switch />
            </Form.Item>
          )}
          <Form.Item name="show_in_list" valuePropName="checked" label={`Show in the ${entity} table`} style={{ marginBottom: 0 }}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
}
