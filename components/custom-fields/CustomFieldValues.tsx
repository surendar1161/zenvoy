"use client";

import { Button, Space, Typography } from "antd";
import { EditOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import {
  formatFieldValue, sortedDefinitions, type CustomFieldDefinition, type CustomFieldValues as Values, type FieldEntity,
} from "@/lib/custom-fields";

const { Text } = Typography;

/**
 * Read-only "label: value" strip, shown on the project page so the custom
 * fields are visible without opening a form.
 */
export default function CustomFieldValues({
  defs, values, entity, accent = "#0ea5e9", onEdit, onManage,
}: {
  defs: CustomFieldDefinition[];
  values: Values | null | undefined;
  entity: FieldEntity;
  accent?: string;
  onEdit: () => void;
  onManage: () => void;
}) {
  if (defs.length === 0) {
    return (
      <div data-testid="custom-fields-values-empty"
        style={{ marginTop: 20, padding: "12px 16px", borderRadius: 12, border: `1px dashed ${accent}60`, background: "#ffffffaa" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Add custom fields to track your own details on every {entity}, such as PO number or stage.
          </Text>
          <Button size="small" icon={<PlusOutlined />} onClick={onManage}>Add custom fields</Button>
        </Space>
      </div>
    );
  }

  return (
    <div data-testid="custom-fields-values" style={{ marginTop: 20 }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }} wrap>
        <Text strong style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", color: "#64748b" }}>
          Custom fields
        </Text>
        <Space size={4}>
          <Button size="small" type="text" icon={<EditOutlined />} onClick={onEdit}>Edit values</Button>
          <Button size="small" type="text" icon={<SettingOutlined />} onClick={onManage}>Manage fields</Button>
        </Space>
      </Space>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {sortedDefinitions(defs).map(def => {
          const raw = values?.[def.id];
          const text = formatFieldValue(def, raw);
          const isSet = def.field_type === "checkbox" ? raw === true : text !== "";
          return (
            <div key={def.id} data-testid={`custom-field-chip-${def.id}`}
              style={{
                display: "inline-flex", alignItems: "baseline", gap: 6, padding: "6px 12px", borderRadius: 10,
                border: `1px solid ${isSet ? `${accent}40` : "#e2e8f0"}`, background: isSet ? `${accent}0d` : "#f8fafc",
              }}>
              <Text type="secondary" style={{ fontSize: 12 }}>{def.name}</Text>
              <Text strong={isSet} style={{ fontSize: 13, color: isSet ? "#0f172a" : "#94a3b8" }}>
                {isSet ? text : "—"}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
