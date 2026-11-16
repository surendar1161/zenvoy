import { Typography } from "antd";
import type { TableColumnsType } from "antd";
import {
  formatFieldValue, sortedDefinitions, type CustomFieldDefinition, type CustomFieldValues,
} from "@/lib/custom-fields";

const { Text } = Typography;

/** Table columns for the custom fields marked "show in list". */
export function customFieldColumns<T extends { custom_fields?: CustomFieldValues | null }>(
  defs: CustomFieldDefinition[],
): TableColumnsType<T> {
  return sortedDefinitions(defs)
    .filter(d => d.show_in_list)
    .map(def => ({
      title: def.name,
      key: `cf_${def.id}`,
      width: def.field_type === "text" ? 160 : 130,
      ellipsis: true,
      render: (_: unknown, row: T) => {
        const raw = row.custom_fields?.[def.id];
        const text = formatFieldValue(def, raw);
        const isSet = def.field_type === "checkbox" ? raw === true : text !== "";
        return isSet
          ? <Text style={{ fontSize: 13 }}>{text}</Text>
          : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
      },
    }));
}
