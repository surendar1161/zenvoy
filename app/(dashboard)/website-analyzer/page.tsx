"use client";

import { useState } from "react";
import {
  Button, Card, Input, Form, Typography, Alert, Spin, Progress,
  Row, Col, Tag, Space, Statistic, List, Tabs, message
} from "antd";
import {
  SearchOutlined, ThunderboltOutlined, CheckCircleOutlined,
  WarningOutlined, CloseCircleOutlined, GlobalOutlined,
  RocketOutlined, BulbOutlined, DollarOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const { Title, Text, Paragraph } = Typography;

interface AnalysisResult {
  id: string;
  url: string;
  domain: string;
  company_name: string;
  status: string;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  best_practices_score: number;
  opportunity_score: number;
  priority_level: string;
  estimated_budget_min: number;
  estimated_budget_max: number;
  issues_found: number;
  critical_issues: number;
  warnings: number;
  seo_issues: any[];
  performance_issues: any[];
  accessibility_issues: any[];
  security_issues: any[];
  technologies: string[];
  analyzed_at: string;
}

export default function WebsiteAnalyzerPage() {
  const [form] = Form.useForm();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [msgApi, ctx] = message.useMessage();

  async function handleAnalyze(values: { url: string; companyName?: string }) {
    setAnalyzing(true);
    setResult(null);

    try {
      // Call API to analyze website
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: values.url,
          companyName: values.companyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      if (data.cached) {
        msgApi.info("Showing recent analysis (less than 7 days old)");
      }

      // Fetch full analysis result
      const supabase = createClient();
      const { data: analysis, error } = await supabase
        .from("website_analyses")
        .select("*")
        .eq("id", data.analysisId || data.id)
        .single();

      if (error) throw error;

      setResult(analysis);
      msgApi.success("Website analysis completed!");
    } catch (error: any) {
      msgApi.error(error.message || "Failed to analyze website");
    } finally {
      setAnalyzing(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#52c41a";
    if (score >= 70) return "#faad14";
    if (score >= 50) return "#ff7a45";
    return "#f5222d";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "red",
      high: "orange",
      medium: "gold",
      low: "green",
    };
    return colors[priority] || "default";
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <RocketOutlined style={{ fontSize: 28, color: "#0ea5e9" }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
            Website Analyzer
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Analyze any website to discover opportunities and estimate project value
        </Text>
      </div>

      {/* Analysis Form */}
      <Card
        style={{ marginBottom: 32, borderRadius: 16, border: "1px solid #e2e8f0" }}
        styles={{ body: { padding: 32 } }}
      >
        <Form form={form} layout="vertical" onFinish={handleAnalyze}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="url"
                label={<Text strong>Website URL</Text>}
                rules={[
                  { required: true, message: "Enter a website URL" },
                  { type: "url", message: "Enter a valid URL (including https://)" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<GlobalOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="https://example.com"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyName"
                label={<Text strong>Company Name (Optional)</Text>}
              >
                <Input
                  size="large"
                  placeholder="Acme Corporation"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={analyzing}
            icon={<SearchOutlined />}
            style={{
              borderRadius: 10,
              height: 48,
              fontWeight: 700,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            {analyzing ? "Analyzing..." : "Analyze Website"}
          </Button>
        </Form>

        {analyzing && (
          <Alert
            type="info"
            message="Analysis in progress..."
            description="This may take 10-30 seconds. We're checking performance, SEO, accessibility, and security."
            showIcon
            style={{ marginTop: 24, borderRadius: 10 }}
          />
        )}
      </Card>

      {/* Analysis Results */}
      {result && (
        <>
          {/* Overview Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} md={6}>
              <Card
                style={{
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Statistic
                  title="Opportunity Score"
                  value={result.opportunity_score}
                  suffix="/ 100"
                  valueStyle={{ color: getScoreColor(result.opportunity_score) }}
                />
                <Tag
                  color={getPriorityColor(result.priority_level)}
                  style={{ marginTop: 8 }}
                >
                  {result.priority_level?.toUpperCase()} PRIORITY
                </Tag>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card
                style={{
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Statistic
                  title="Issues Found"
                  value={result.issues_found}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff7a45" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {result.critical_issues} critical
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Space direction="vertical" size={4}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ESTIMATED PROJECT VALUE
                  </Text>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>
                    ${result.estimated_budget_min?.toLocaleString()} - $
                    {result.estimated_budget_max?.toLocaleString()}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Based on issues and opportunity score
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Lighthouse Scores */}
          <Card
            title={
              <Space>
                <ThunderboltOutlined />
                <span>Performance Metrics</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 16 }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <Progress
                    type="circle"
                    percent={result.performance_score}
                    strokeColor={getScoreColor(result.performance_score)}
                    size={100}
                  />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>Performance</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <Progress
                    type="circle"
                    percent={result.seo_score}
                    strokeColor={getScoreColor(result.seo_score)}
                    size={100}
                  />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>SEO</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <Progress
                    type="circle"
                    percent={result.accessibility_score}
                    strokeColor={getScoreColor(result.accessibility_score)}
                    size={100}
                  />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>Accessibility</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <Progress
                    type="circle"
                    percent={result.best_practices_score}
                    strokeColor={getScoreColor(result.best_practices_score)}
                    size={100}
                  />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>Best Practices</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Issues & Opportunities */}
          <Card
            title={
              <Space>
                <BulbOutlined />
                <span>Issues & Opportunities</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 16 }}
          >
            <Tabs
              items={[
                {
                  key: "seo",
                  label: `SEO (${result.seo_issues?.length || 0})`,
                  children: <IssuesList issues={result.seo_issues} />,
                },
                {
                  key: "performance",
                  label: `Performance (${result.performance_issues?.length || 0})`,
                  children: <IssuesList issues={result.performance_issues} />,
                },
                {
                  key: "accessibility",
                  label: `Accessibility (${result.accessibility_issues?.length || 0})`,
                  children: <IssuesList issues={result.accessibility_issues} />,
                },
                {
                  key: "security",
                  label: `Security (${result.security_issues?.length || 0})`,
                  children: <IssuesList issues={result.security_issues} />,
                },
              ]}
            />
          </Card>

          {/* Technologies */}
          {result.technologies && result.technologies.length > 0 && (
            <Card
              title="Technologies Detected"
              style={{ marginBottom: 24, borderRadius: 16 }}
            >
              <Space wrap>
                {result.technologies.map((tech) => (
                  <Tag key={tech} color="blue" style={{ fontSize: 13, padding: "4px 12px" }}>
                    {tech}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* Actions */}
          <Card style={{ borderRadius: 16, background: "#f8fafc" }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Button block size="large" style={{ borderRadius: 10 }}>
                  Generate Proposal
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button block size="large" style={{ borderRadius: 10 }}>
                  Export PDF Report
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button block size="large" style={{ borderRadius: 10 }}>
                  Save as Lead
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
}

function IssuesList({ issues }: { issues: any[] }) {
  if (!issues || issues.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }} />
        <Paragraph type="secondary">No issues found in this category</Paragraph>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <CloseCircleOutlined style={{ color: "#f5222d" }} />;
      case "high":
        return <WarningOutlined style={{ color: "#ff7a45" }} />;
      case "medium":
        return <WarningOutlined style={{ color: "#faad14" }} />;
      default:
        return <WarningOutlined style={{ color: "#1890ff" }} />;
    }
  };

  return (
    <List
      dataSource={issues}
      renderItem={(issue) => (
        <List.Item>
          <List.Item.Meta
            avatar={getSeverityIcon(issue.severity)}
            title={
              <Space>
                <span>{issue.title}</span>
                <Tag color={issue.severity === "critical" ? "red" : issue.severity === "high" ? "orange" : "gold"}>
                  {issue.severity.toUpperCase()}
                </Tag>
              </Space>
            }
            description={
              <div>
                <Paragraph style={{ marginBottom: 8 }}>{issue.description}</Paragraph>
                <Alert
                  type="info"
                  message="Recommendation"
                  description={issue.recommendation}
                  showIcon
                  style={{ fontSize: 13 }}
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
