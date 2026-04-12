"use client";

import { Card, Col, Row, Tag, Typography, Space, Divider } from "antd";
import {
  DollarOutlined, ClockCircleOutlined, FontSizeOutlined,
  ArrowRightOutlined, TrophyOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { industryGroups } from "@/lib/templates";
import { FREELANCER_TEMPLATES } from "@/lib/templates-by-type";

const { Title, Text } = Typography;

const ACCENT_COLORS: Record<string, string> = {
  designer: "#7c3aed",
  developer: "#0ea5e9",
  copywriter: "#f59e0b",
  consultant: "#334155",
  marketing: "#10b981",
};

export default function TemplatesPage() {
  const industryTotal = industryGroups.reduce((s, g) => s + g.templates.length, 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ marginBottom: 36 }}>
        <Title level={2} style={{ margin: "0 0 6px", fontWeight: 800 }}>Templates</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          {FREELANCER_TEMPLATES.length} freelancer-type + {industryTotal} industry templates. Click any to use it.
        </Text>
      </div>

      {/* F17 — Freelancer type templates */}
      <div style={{ marginBottom: 40 }}>
        <Space style={{ marginBottom: 20 }} align="center">
          <TrophyOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
          <Title level={4} style={{ margin: 0 }}>By Freelancer Type</Title>
          
        </Space>
        <Row gutter={[16, 16]}>
          {FREELANCER_TEMPLATES.map(tpl => {
            const accent = ACCENT_COLORS[tpl.id] ?? "#0ea5e9";
            return (
              <Col key={tpl.id} xs={24} sm={12} lg={8}>
                <Link href={`/generate?ftype=${tpl.id}`}>
                  <Card
                    hoverable
                    style={{ borderRadius: 18, overflow: "hidden", border: "1px solid #e2e8f0", cursor: "pointer" }}
                    bodyStyle={{ padding: 0 }}
                  >
                    {/* colour banner */}
                    <div style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})`, padding: "28px 24px 40px" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{tpl.icon}</div>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{tpl.type}</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{tpl.tagline}</div>
                    </div>
                    {/* body */}
                    <div style={{ padding: "20px 24px 24px", marginTop: -16, background: "#fff", borderRadius: "16px 16px 0 0" }}>
                      <Space wrap style={{ marginBottom: 12 }}>
                        {tpl.sampleSections.slice(0, 4).map(s => (
                          <Tag key={s} style={{ borderRadius: 20, fontSize: 11 }}>{s}</Tag>
                        ))}
                      </Space>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <DollarOutlined style={{ color: "#64748b" }} />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {tpl.defaults.currency ?? "USD"} {(tpl.defaults.totalBudget ?? 0).toLocaleString()}
                          </Text>
                        </Space>
                        <Text style={{ fontSize: 13, color: accent, fontWeight: 600 }}>
                          Use template <ArrowRightOutlined />
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </div>

      <Divider />

      {/* Industry templates */}
      <div>
        <Title level={4} style={{ marginBottom: 24 }}>By Industry</Title>
        {industryGroups.map(group => (
          <div key={group.industry} style={{ marginBottom: 40 }}>
            <Space style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{group.icon}</span>
              <Title level={5} style={{ margin: 0 }}>{group.industry}</Title>
              <Tag>{group.templates.length}</Tag>
            </Space>
            <Row gutter={[14, 14]}>
              {group.templates.map(tpl => (
                <Col key={tpl.id} xs={24} sm={12} lg={8}>
                  <Link href={`/generate?template=${tpl.id}`}>
                    <Card
                      hoverable
                      size="small"
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", cursor: "pointer" }}
                      bodyStyle={{ padding: 20 }}
                    >
                      <Space align="start" style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 24, lineHeight: 1 }}>{tpl.icon}</span>
                        <div>
                          <Text strong style={{ fontSize: 14, display: "block" }}>{tpl.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{tpl.description}</Text>
                        </div>
                      </Space>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Space size={12}>
                          <Space size={4}>
                            <DollarOutlined style={{ color: "#94a3b8", fontSize: 12 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {tpl.defaults.currency ?? "USD"} {(tpl.defaults.totalBudget ?? 0).toLocaleString()}
                            </Text>
                          </Space>
                          <Space size={4}>
                            <ClockCircleOutlined style={{ color: "#94a3b8", fontSize: 12 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>{tpl.defaults.timeline}</Text>
                          </Space>
                        </Space>
                        <Space size={4}>
                          <FontSizeOutlined style={{ color: "#94a3b8", fontSize: 12 }} />
                          <Text type="secondary" style={{ fontSize: 12, textTransform: "capitalize" }}>{tpl.defaults.tone}</Text>
                        </Space>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
}
