"use client";

import { Button, Checkbox, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Space, Tag, Typography } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  formKey, MAX_TEXT_LENGTH, validateFieldValue, type CustomFieldDefinition, type FieldEntity,
} from "@/lib/custom-fields";

const { Text } = Typography;

/**
 * The "Custom fields" section inside the project and task forms.
 * Render it inside an Ant Design <Form>; each field is registered as cf_<id>.
 */
export default function CustomFieldInputs({
  defs, entity, onManage,
}: { defs: CustomFieldDefinition[]; entity: FieldEntity; onManage: () => void }) {
  const noun = entity === "project" ? "project" : "task";

  if (defs.length === 0) {
    return (
      <div
        data-testid="custom-fields-empty"
        style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, border: "1px dashed #bae6fd", background: "#f0f9ff" }}
      >
        <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
          <div>
            <Text strong style={{ fontSize: 13 }}>Custom fields</Text>
            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
              Track your own details on every {noun}, such as {entity === "project" ? "PO number or stage" : "estimated hours or billable"}.
            </Text>
          </div>
          <Button icon={<PlusOutlined />} onClick={onManage}>Add custom fields</Button>
        </Space>
      </div>
    );
  }

  return (
    <div data-testid="custom-fields-section" style={{ marginTop: 8 }}>
      <Divider style={{ margin: "16px 0 12px" }}>
        <Space size={8}>
          <Text strong style={{ fontSize: 13 }}>Custom fields</Text>
          <Tag color="blue" style={{ borderRadius: 20, margin: 0 }}>{defs.length}</Tag>
        </Space>
      </Divider>
      <div style={{ textAlign: "right", marginTop: -8, marginBottom: 8 }}>
        <Button type="link" size="small" icon={<SettingOutlined />} onClick={onManage}>Manage fields</Button>
      </div>
      <Row gutter={[16, 0]}>
        {defs.map(def => (
          <Col key={def.id} span={def.field_type === "text" ? 24 : 12}>
            <FieldItem def={def} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

function FieldItem({ def }: { def: CustomFieldDefinition }) {
  const label = (
    <Text strong style={{ fontSize: 13 }}>
      {def.name}{def.required ? " *" : ""}
    </Text>
  );
  const rules = def.field_type === "checkbox" ? [] : [{
    validator: (_: unknown, v: unknown) => {
      const value = dayjs.isDayjs(v) ? v.format("YYYY-MM-DD") : v;
      const err = validateFieldValue(def, value);
      return err ? Promise.reject(new Error(err)) : Promise.resolve();
    },
  }];

  if (def.field_type === "checkbox") {
    return (
      <Form.Item name={formKey(def.id)} valuePropName="checked" label={label}>
        <Checkbox>Yes</Checkbox>
      </Form.Item>
    );
  }
  return (
    <Form.Item name={formKey(def.id)} label={label} rules={rules}>
      {def.field_type === "number" ? (
        <InputNumber style={{ width: "100%", borderRadius: 8 }} placeholder="0" />
      ) : def.field_type === "date" ? (
        <DatePicker style={{ width: "100%", borderRadius: 8 }} />
      ) : def.field_type === "select" ? (
        <Select allowClear placeholder="Select…" style={{ width: "100%" }}
          options={def.options.map(o => ({ value: o, label: o }))} />
      ) : (
        <Input maxLength={MAX_TEXT_LENGTH} placeholder={def.name} style={{ borderRadius: 8 }} />
      )}
    </Form.Item>
  );
}
