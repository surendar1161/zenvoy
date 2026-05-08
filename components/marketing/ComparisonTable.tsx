"use client";

import { Card, Typography } from "antd";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Competitor {
  name: string;
  highlight?: boolean;
}

interface Feature {
  name: string;
  values: Record<string, boolean | string>;
}

interface ComparisonTableProps {
  competitors: Competitor[];
  features: Feature[];
}

export default function ComparisonTable({ competitors, features }: ComparisonTableProps) {
  return (
    <Card style={{ borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 14, fontWeight: 700, color: "#334155" }}>Feature</th>
              {competitors.map(c => (
                <th key={c.name} style={{
                  padding: "16px 16px",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: c.highlight ? "#0369a1" : "#334155",
                  background: c.highlight ? "#f0f9ff" : undefined,
                }}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={f.name} style={{ borderBottom: i < features.length - 1 ? "1px solid #f1f5f9" : undefined }}>
                <td style={{ padding: "13px 20px", fontSize: 14, color: "#475569" }}>{f.name}</td>
                {competitors.map(c => {
                  const val = f.values[c.name];
                  return (
                    <td key={c.name} style={{
                      padding: "13px 16px",
                      textAlign: "center",
                      background: c.highlight ? "#f0f9ff" : undefined,
                    }}>
                      {val === true ? (
                        <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />
                      ) : val === false ? (
                        <CloseCircleOutlined style={{ color: "#e2e8f0", fontSize: 18 }} />
                      ) : (
                        <Text style={{ fontSize: 13, color: "#475569" }}>{val}</Text>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
