"use client";

import { useState, useEffect } from "react";
import {
  Alert, Button, Card, Col, DatePicker, Form, Input, Row, Select,
  Space, Typography, message, Progress, Radio, Divider, Tag,
} from "antd";
import {
  ThunderboltOutlined, CheckCircleOutlined, SafetyCertificateOutlined,
  UserOutlined, GlobalOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";
import { getContractType } from "@/lib/contract-types";
import type { ContractType } from "@/lib/contract-types";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Top 10 US states by population
const US_TOP_STATES = [
  "California", "Texas", "Florida", "New York", "Pennsylvania",
  "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
];

// All US states (alphabetical after top 10)
const US_ALL_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "Colorado", "Connecticut",
  "Delaware", "Hawaii", "Idaho", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "North Dakota", "Oklahoma", "Oregon", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

type JurisdictionType = "US" | "UK" | "EU" | "Other";

interface SimpleContractData {
  contractTypeId: string;
  jurisdiction: JurisdictionType;
  state?: string;
  country?: string;
  companyName: string;
  clientId?: string;
  clientName: string;
  clientCompany?: string;
  contractFields: Record<string, any>;
}

interface ContractFormSimpleProps {
  contractType: ContractType;
  onGenerate: (data: any) => void;
  loading: boolean;
}

export default function ContractFormSimple({
  contractType,
  onGenerate,
  loading,
}: ContractFormSimpleProps) {
  const [form] = Form.useForm<SimpleContractData>();
  const [msgApi, ctx] = message.useMessage();
  const [user, setUser] = useState<User | null>(null);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>("US");
  const [completedFields, setCompletedFields] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Required fields count (varies by contract type)
  const baseRequiredFields = 4; // Jurisdiction, Company, Client, State/Country
  const contractSpecificFields = contractType.fields.filter(f => f.required).length;
  const REQUIRED_FIELDS = baseRequiredFields + contractSpecificFields;

  // Load user info
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUser(data.user);
      // Pre-fill company name if available
      if (data.user?.user_metadata?.company) {
        form.setFieldValue("companyName", data.user.user_metadata.company);
      }
    });
  }, [form]);

  // Load draft from localStorage
  useEffect(() => {
    const draftKey = `dealpilot_contract_draft_${contractType.id}`;
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.setFieldsValue(parsed);
        setJurisdiction(parsed.jurisdiction || "US");
        msgApi.info("Draft restored from last session");
        setLastSaved(new Date(parsed.savedAt));
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [form, contractType.id, msgApi]);

  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getFieldsValue();
      if (values.companyName || values.clientName) {
        setAutoSaving(true);
        const draft = {
          ...values,
          jurisdiction,
          savedAt: new Date().toISOString(),
        };
        const draftKey = `dealpilot_contract_draft_${contractType.id}`;
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setLastSaved(new Date());
        setTimeout(() => setAutoSaving(false), 500);
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(interval);
  }, [form, contractType.id, jurisdiction]);

  // Track field completion
  const handleFieldsChange = () => {
    const values = form.getFieldsValue();
    let completed = 0;

    // Base fields
    if (jurisdiction) completed++;
    if (jurisdiction === "US" && values.state) completed++;
    if (jurisdiction === "Other" && values.country) completed++;
    if (jurisdiction === "UK" || jurisdiction === "EU") completed++; // Auto-satisfied
    if (values.companyName) completed++;
    if (values.clientName) completed++;

    // Contract-specific required fields
    contractType.fields.filter(f => f.required).forEach(field => {
      if (values.contractFields?.[field.key]) completed++;
    });

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

  const handleSubmit = async (values: SimpleContractData) => {
    // Clear draft after successful generation
    const draftKey = `dealpilot_contract_draft_${contractType.id}`;
    localStorage.removeItem(draftKey);

    // Prepare jurisdiction string
    let jurisdictionString = "";
    if (jurisdiction === "US") {
      jurisdictionString = values.state || "United States";
    } else if (jurisdiction === "UK") {
      jurisdictionString = "United Kingdom";
    } else if (jurisdiction === "EU") {
      jurisdictionString = "European Union";
    } else {
      jurisdictionString = values.country || "International";
    }

    // Prepare data for generation
    const contractData = {
      contractTypeId: contractType.id,
      state: jurisdictionString,
      governingCountry: jurisdiction === "US" ? "US" : jurisdiction === "UK" ? "GB" : undefined,
      governingState: jurisdiction === "US" ? values.state : undefined,
      partyA: {
        name: values.companyName,
        role: contractType.id === "nda" ? "Disclosing Party" : 
              contractType.id === "lease" ? "Landlord" :
              contractType.id === "loan" ? "Lender" : "Company",
        address: "",
      },
      partyB: {
        name: values.clientName + (values.clientCompany ? ` (${values.clientCompany})` : ""),
        role: contractType.id === "nda" ? "Receiving Party" :
              contractType.id === "lease" ? "Tenant" :
              contractType.id === "loan" ? "Borrower" : "Counterparty",
        address: "",
      },
      fields: values.contractFields || {},
    };

    onGenerate(contractData);
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
          background: "linear-gradient(135deg, #fef3c7 0%, #fff 100%)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={8}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Space>
              <Text strong style={{ fontSize: 13 }}>
                {completedFields === REQUIRED_FIELDS 
                  ? "✅ Ready to generate!" 
                  : `📝 ${completedFields} of ${REQUIRED_FIELDS} required fields`}
              </Text>
              {autoSaving && <Tag color="gold" style={{ fontSize: 11 }}>Saving...</Tag>}
              {!autoSaving && lastSaved && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Saved {dayjs(lastSaved).fromNow()}
                </Text>
              )}
            </Space>
            {completedFields === REQUIRED_FIELDS && (
              <CheckCircleOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
            )}
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{
              "0%": "#f59e0b",
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
          jurisdiction: "US",
          contractFields: {},
        }}
      >
        <Card
          style={{ borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}
          styles={{ body: { padding: 32 } }}
        >
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Jurisdiction Selector (Cards) */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <Space>
                  <GlobalOutlined style={{ color: "#3b82f6" }} />
                  <Text strong style={{ fontSize: 14 }}>Jurisdiction</Text>
                  <Text type="danger">*</Text>
                </Space>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Which country's law governs this contract?
                  </Text>
                </div>
              </div>

              <Radio.Group
                value={jurisdiction}
                onChange={(e) => {
                  setJurisdiction(e.target.value);
                  handleFieldsChange();
                }}
                style={{ width: "100%" }}
              >
                <Row gutter={[12, 12]}>
                  {[
                    { value: "US", flag: "🇺🇸", label: "United States", popular: true },
                    { value: "UK", flag: "🇬🇧", label: "United Kingdom", popular: true },
                    { value: "EU", flag: "🇪🇺", label: "European Union", popular: false },
                    { value: "Other", flag: "🌍", label: "Other Country", popular: false },
                  ].map((item) => (
                    <Col xs={12} sm={6} key={item.value}>
                      <Radio.Button
                        value={item.value}
                        style={{
                          width: "100%",
                          height: "auto",
                          padding: "16px 8px",
                          textAlign: "center",
                          borderRadius: 12,
                          border: `2px solid ${jurisdiction === item.value ? "#3b82f6" : "#e2e8f0"}`,
                          background: jurisdiction === item.value ? "#eff6ff" : "#fff",
                          position: "relative",
                        }}
                      >
                        {item.popular && (
                          <div
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              background: "#10b981",
                              color: "#fff",
                              fontSize: 9,
                              padding: "2px 6px",
                              borderRadius: 8,
                              fontWeight: 700,
                            }}
                          >
                            POPULAR
                          </div>
                        )}
                        <div style={{ fontSize: 32, marginBottom: 4 }}>{item.flag}</div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: jurisdiction === item.value ? "#1d4ed8" : "#374151",
                          }}
                        >
                          {item.label}
                        </div>
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </div>

            {/* US State Selector (only if US selected) */}
            {jurisdiction === "US" && (
              <div>
                <Form.Item
                  label={
                    <Space>
                      <Text strong style={{ fontSize: 14 }}>State</Text>
                      <Text type="danger">*</Text>
                    </Space>
                  }
                  name="state"
                  rules={[{ required: true, message: "Please select a state" }]}
                  extra={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      US state law governs interpretation and enforcement
                    </Text>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    showSearch
                    placeholder="Select state..."
                    optionFilterProp="children"
                  >
                    <Select.OptGroup label="Most Popular">
                      {US_TOP_STATES.map((state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      ))}
                    </Select.OptGroup>
                    <Select.OptGroup label="All States">
                      {US_ALL_STATES.map((state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      ))}
                    </Select.OptGroup>
                  </Select>
                </Form.Item>
              </div>
            )}

            {/* Other Country Selector (only if Other selected) */}
            {jurisdiction === "Other" && (
              <div>
                <Form.Item
                  label={
                    <Space>
                      <Text strong style={{ fontSize: 14 }}>Country</Text>
                      <Text type="danger">*</Text>
                    </Space>
                  }
                  name="country"
                  rules={[{ required: true, message: "Please enter a country" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="e.g., Canada, Australia, Singapore..." />
                </Form.Item>
              </div>
            )}

            <Divider style={{ margin: "8px 0" }} />

            {/* Your Company */}
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
                YOUR COMPANY
              </Text>
              <Form.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: "#10b981" }} />
                    <Text strong style={{ fontSize: 14 }}>Company / Your Name</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="companyName"
                rules={[{ required: true, message: "Please enter your company or name" }]}
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Your legal entity name or full name
                  </Text>
                }
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Your Company LLC" />
              </Form.Item>
            </div>

            <Divider style={{ margin: "8px 0" }} />

            {/* Client / Counterparty */}
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
                CLIENT / COUNTERPARTY
              </Text>
              <Form.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: "#7c3aed" }} />
                    <Text strong style={{ fontSize: 14 }}>Client</Text>
                    <Text type="danger">*</Text>
                  </Space>
                }
                name="clientName"
                rules={[{ required: true, message: "Please select or enter a client" }]}
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

            {/* Contract-Specific Fields */}
            {contractType.fields.length > 0 && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
                    CONTRACT TERMS
                  </Text>
                  <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    {contractType.fields.map((field) => (
                      <Form.Item
                        key={field.key}
                        label={
                          <Space>
                            <Text strong style={{ fontSize: 13 }}>{field.label}</Text>
                            {field.required && <Text type="danger">*</Text>}
                          </Space>
                        }
                        name={["contractFields", field.key]}
                        rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
                        extra={field.hint && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {field.hint}
                          </Text>
                        )}
                        style={{ marginBottom: 0 }}
                      >
                        {field.type === "text" && (
                          <Input placeholder={field.placeholder} />
                        )}
                        {field.type === "number" && (
                          <Input type="number" placeholder={field.placeholder} />
                        )}
                        {field.type === "select" && (
                          <Select placeholder="Select...">
                            {field.options?.map((opt) => (
                              <Option key={opt} value={opt}>
                                {opt}
                              </Option>
                            ))}
                          </Select>
                        )}
                        {field.type === "date" && (
                          <DatePicker style={{ width: "100%" }} />
                        )}
                      </Form.Item>
                    ))}
                  </Space>
                </div>
              </>
            )}
          </Space>
        </Card>

        {/* Smart Defaults Info */}
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message="Smart Defaults Active"
          description={`Based on: ${jurisdiction === "US" ? "US" : jurisdiction === "UK" ? "UK" : jurisdiction === "EU" ? "EU" : "International"} law, standard ${contractType.name} terms`}
          style={{ marginBottom: 20, borderRadius: 12, border: "1px solid #bfdbfe", background: "#eff6ff" }}
        />

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
            background: completedFields === REQUIRED_FIELDS ? "#f59e0b" : undefined,
            borderColor: completedFields === REQUIRED_FIELDS ? "#f59e0b" : undefined,
            boxShadow: completedFields === REQUIRED_FIELDS ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "none",
          }}
        >
          {loading ? "Generating Your Contract..." : "Generate Contract with AI"}
        </Button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ⚡ Takes ~40 seconds • ✏️ You can edit after generation • 💾 Auto-saves every 10s
          </Text>
        </div>
      </Form>
    </div>
  );
}
