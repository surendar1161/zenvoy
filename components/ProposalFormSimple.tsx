"use client";

import { useState, useEffect } from "react";
import {
  Alert, Button, Card, Col, DatePicker, Form, Input, InputNumber,
  Row, Select, Space, Typography, message, Collapse, Tag, Progress,
  Divider,
} from "antd";
import {
  ThunderboltOutlined, CheckCircleOutlined, UserOutlined,
  DollarOutlined, CalendarOutlined, FileTextOutlined,
  PlusOutlined, SaveOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const CURRENCIES = ["USD", "GBP", "EUR", "AUD", "CAD", "INR", "SGD", "AED"];
const PROJECT_TYPES = [
  "Web Design & Development",
  "Mobile App Development",
  "Branding & Identity",
  "SEO & Content Marketing",
  "Social Media Management",
  "Copywriting",
  "Video Production",
  "UI/UX Design",
  "Data Analysis",
  "Consulting",
  "Other",
];

interface SimpleFormData {
  clientId?: string;
  clientName: string;
  clientCompany?: string;
  projectType: string;
  projectDescription: string;
  budget: number;
  currency: string;
  timeline: [Dayjs, Dayjs] | null;
  depositPercent: number;
}

interface ProposalFormSimpleProps {
  onGenerate: (data: any) => void;
  loading: boolean;
}

export default function ProposalFormSimple({ onGenerate, loading }: ProposalFormSimpleProps) {
  const [form] = Form.useForm<SimpleFormData>();
  const [msgApi, ctx] = message.useMessage();
  const [user, setUser] = useState<User | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [completedFields, setCompletedFields] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Total required fields
  const REQUIRED_FIELDS = 5;

  // Load user info
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("dealpilot_proposal_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.setFieldsValue({
          ...parsed,
          timeline: parsed.timeline
            ? [dayjs(parsed.timeline[0]), dayjs(parsed.timeline[1])]
            : null,
        });
        msgApi.info("Draft restored from last session");
        setLastSaved(new Date(parsed.savedAt));
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [form, msgApi]);

  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getFieldsValue();
      if (values.clientName || values.projectDescription) {
        setAutoSaving(true);
        const draft = {
          ...values,
          timeline: values.timeline
            ? [values.timeline[0]?.toISOString(), values.timeline[1]?.toISOString()]
            : null,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("dealpilot_proposal_draft", JSON.stringify(draft));
        setLastSaved(new Date());
        setTimeout(() => setAutoSaving(false), 500);
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(interval);
  }, [form]);

  // Track field completion
  const handleFieldsChange = () => {
    const values = form.getFieldsValue();
    let completed = 0;
    if (values.clientName) completed++;
    if (values.projectType) completed++;
    if (values.projectDescription && values.projectDescription.length >= 50) completed++;
    if (values.budget && values.budget >= 100) completed++;
    if (values.timeline && values.timeline[0] && values.timeline[1]) completed++;
    setCompletedFields(completed);
  };

  const handleClientSelect = (client: ClientOption | null) => {
    if (client) {
      form.setFieldsValue({
        clientName: client.name,
        clientCompany: client.company ?? undefined,
        clientId: client.id,
      });
      handleFieldsChange();
    }
  };

  const handleSubmit = async (values: SimpleFormData) => {
    // Clear draft after successful generation
    localStorage.removeItem("dealpilot_proposal_draft");

    // Calculate deposit
    const depositAmount = Math.round(values.budget * values.depositPercent / 100);

    // Prepare data for generation
    const proposalData = {
      freelancerName: user?.user_metadata?.full_name || "",
      freelancerEmail: user?.email || "",
      freelancerTitle: "Professional", // Can be enhanced later
      clientName: values.clientName,
      clientCompany: values.clientCompany,
      projectType: values.projectType,
      projectDescription: values.projectDescription,
      deliverables: "", // Will be extracted by AI
      timeline: values.timeline
        ? `${values.timeline[0].format("MMM D, YYYY")} → ${values.timeline[1].format("MMM D, YYYY")}`
        : "",
      totalBudget: values.budget,
      currency: values.currency,
      depositPercent: values.depositPercent,
      depositAmount,
      tone: "professional", // Default tone
      sections: [], // Use defaults
    };

    onGenerate(proposalData);
  };

  const progressPercent = (completedFields / REQUIRED_FIELDS) * 100;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {ctx}

      {/* Progress Indicator */}
      <Card
        size="small"
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #eff6ff 0%, #fff 100%)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={8}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Space>
              <Text strong style={{ fontSize: 13 }}>
                {completedFields === REQUIRED_FIELDS ? "✅ Ready to generate!" : `📝 ${completedFields} of ${REQUIRED_FIELDS} required fields`}
              </Text>
              {autoSaving && <Tag color="blue" style={{ fontSize: 11 }}>Saving...</Tag>}
              {!autoSaving && lastSaved && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Saved {dayjs(lastSaved).fromNow()}
                </Text>
              )}
            </Space>
            {completedFields === REQUIRED_FIELDS && (
              <CheckCircleOutlined style={{ color: "#10b981", fontSize: 18 }} />
            )}
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{
              "0%": "#0ea5e9",
              "100%": "#10b981",
            }}
            trailColor="#e2e8f0"
            strokeWidth={8}
            style={{ marginBottom: 0 }}
          />
        </Space>
      </Card>

      {/* Main Form */}
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={handleSubmit}
        onFieldsChange={handleFieldsChange}
        initialValues={{
          currency: "USD",
          depositPercent: 50,
        }}
      >
        <Card
          style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}
          styles={{ body: { padding: 32 } }}
        >
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            {/* Client Selection */}
            <div>
              <Form.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: "#7c3aed" }} />
                    <Text strong style={{ fontSize: 14 }}>Client</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="clientName"
                rules={[{ required: true, message: "Please select or enter a client name" }]}
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Choose from your existing clients or create a new one
                  </Text>
                }
                style={{ marginBottom: 0 }}
              >
                <ClientSelect
                  onSelect={handleClientSelect}
                  placeholder="Select a client or type to create new..."
                  size="large"
                />
              </Form.Item>
            </div>

            {/* Project Type */}
            <div>
              <Form.Item
                label={
                  <Space>
                    <FileTextOutlined style={{ color: "#10b981" }} />
                    <Text strong style={{ fontSize: 14 }}>Project Type</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="projectType"
                rules={[{ required: true, message: "Please select a project type" }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="What type of project is this?"
                  showSearch
                  optionFilterProp="children"
                >
                  {PROJECT_TYPES.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Project Description */}
            <div>
              <Form.Item
                label={
                  <Space>
                    <FileTextOutlined style={{ color: "#3b82f6" }} />
                    <Text strong style={{ fontSize: 14 }}>What does the client need?</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="projectDescription"
                rules={[
                  { required: true, message: "Please describe the project" },
                  { min: 50, message: "Please provide at least 50 characters for better AI generation" },
                ]}
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    The more detail you provide, the better the AI-generated proposal will be
                  </Text>
                }
                style={{ marginBottom: 0 }}
              >
                <TextArea
                  rows={4}
                  placeholder="Example: Redesign e-commerce website with modern UI, integrate payment gateway, add product search and filtering, mobile-responsive design..."
                  showCount
                  maxLength={2000}
                />
              </Form.Item>
            </div>

            <Divider style={{ margin: "8px 0" }} />

            {/* Budget & Currency */}
            <Row gutter={16}>
              <Col xs={24} sm={16}>
                <Form.Item
                  label={
                    <Space>
                      <DollarOutlined style={{ color: "#f59e0b" }} />
                      <Text strong style={{ fontSize: 14 }}>Total Budget</Text>
                      <Text type="danger">*</Text>
                    </Space>
                  }
                  name="budget"
                  rules={[
                    { required: true, message: "Please enter a budget" },
                    { type: "number", min: 100, message: "Budget must be at least 100" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="5000"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as unknown as number}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={
                    <Text strong style={{ fontSize: 14 }}>Currency</Text>
                  }
                  name="currency"
                  style={{ marginBottom: 0 }}
                >
                  <Select>
                    {CURRENCIES.map((curr) => (
                      <Option key={curr} value={curr}>
                        {curr}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Deposit Percentage */}
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const budget = getFieldValue("budget") || 0;
                const currency = getFieldValue("currency") || "USD";
                const depositPercent = getFieldValue("depositPercent") || 50;
                const depositAmount = Math.round(budget * depositPercent / 100);
                const balanceAmount = budget - depositAmount;

                return (
                  <div>
                    <Form.Item
                      label={<Text strong style={{ fontSize: 14 }}>Deposit Percentage</Text>}
                      name="depositPercent"
                      style={{ marginBottom: 12 }}
                    >
                      <Select>
                        {[25, 30, 40, 50, 60, 100].map((percent) => (
                          <Option key={percent} value={percent}>
                            {percent}%
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {budget > 0 && (
                      <div
                        style={{
                          background: "#eff6ff",
                          borderRadius: 10,
                          padding: "12px 16px",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                              Deposit ({depositPercent}%)
                            </Text>
                            <Text strong style={{ fontSize: 16, color: "#1d4ed8" }}>
                              {currency} {depositAmount.toLocaleString()}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                              Balance on completion
                            </Text>
                            <Text strong style={{ fontSize: 16, color: "#3b82f6" }}>
                              {currency} {balanceAmount.toLocaleString()}
                            </Text>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                );
              }}
            </Form.Item>

            {/* Timeline */}
            <div>
              <Form.Item
                label={
                  <Space>
                    <CalendarOutlined style={{ color: "#0ea5e9" }} />
                    <Text strong style={{ fontSize: 14 }}>Project Timeline</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="timeline"
                rules={[{ required: true, message: "Please select start and end dates" }]}
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    When will the project start and when should it be completed?
                  </Text>
                }
                style={{ marginBottom: 0 }}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="MMM D, YYYY"
                  placeholder={["Start date", "End date"]}
                  separator="→"
                  disabledDate={(date) => date && date < dayjs().startOf("day")}
                />
              </Form.Item>
            </div>
          </Space>
        </Card>

        {/* Optional Advanced Options (Collapsed by default) */}
        <Collapse
          ghost
          bordered={false}
          expandIcon={({ isActive }) => (
            <PlusOutlined
              rotate={isActive ? 45 : 0}
              style={{ fontSize: 16, color: "#64748b" }}
            />
          )}
          onChange={(keys) => setShowAdvanced(keys.length > 0)}
          style={{ marginBottom: 20 }}
        >
          <Panel
            header={
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  border: "1.5px dashed #e2e8f0",
                  background: "#fafafa",
                  cursor: "pointer",
                }}
                styles={{ body: { padding: "14px 16px" } }}
              >
                <Space>
                  <InfoCircleOutlined style={{ color: "#0ea5e9", fontSize: 18 }} />
                  <div>
                    <Text strong style={{ display: "block", fontSize: 14 }}>
                      ✨ Optional Enhancements
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Add pricing tiers, payment milestones, Stripe link, etc. (You can also add these after generation)
                    </Text>
                  </div>
                </Space>
              </Card>
            }
            key="advanced"
            showArrow={false}
          >
            <Card
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                marginTop: 12,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Alert
                type="info"
                showIcon
                message="Coming Soon"
                description="Advanced options like pricing tiers, milestones, and custom sections will be available here. For now, you can add these after generating your proposal."
                style={{ borderRadius: 10 }}
              />
            </Card>
          </Panel>
        </Collapse>

        {/* Generate Button */}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          disabled={completedFields < REQUIRED_FIELDS}
          icon={<ThunderboltOutlined />}
          style={{
            height: 56,
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            boxShadow: completedFields === REQUIRED_FIELDS ? "0 4px 12px rgba(14, 165, 233, 0.3)" : "none",
          }}
        >
          {loading ? "Generating Your Proposal..." : "Generate Proposal with AI"}
        </Button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ⚡ Takes ~30 seconds • ✏️ You can edit after generation • 💾 Auto-saves every 10s
          </Text>
        </div>
      </Form>
    </div>
  );
}
