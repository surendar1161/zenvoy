"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, ColorPicker, Form, Input, Row, Select,
  Space, Tag, Typography, Upload, message, Divider, Radio,
} from "antd";
import type { Color } from "antd/es/color-picker";
import {
  UploadOutlined, BgColorsOutlined, FontSizeOutlined,
  SaveOutlined, EyeOutlined, EyeInvisibleOutlined, ArrowRightOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import type { BrandKit } from "@/lib/brand";
import { DEFAULT_BRAND, FONT_OPTIONS, loadBrand, saveBrand } from "@/lib/brand";
import ProposalCover from "@/components/ProposalCover";

const { Title, Text } = Typography;

const PRESET_PALETTES = [
  { name: "Ocean",   primary: "#0ea5e9", secondary: "#0369a1" },
  { name: "Violet",  primary: "#7c3aed", secondary: "#5b21b6" },
  { name: "Emerald", primary: "#059669", secondary: "#065f46" },
  { name: "Rose",    primary: "#e11d48", secondary: "#9f1239" },
  { name: "Slate",   primary: "#334155", secondary: "#0f172a" },
  { name: "Amber",   primary: "#d97706", secondary: "#92400e" },
];

export default function BrandPage() {
  const [brand, setBrand] = useState<BrandKit>(DEFAULT_BRAND);
  const [preview, setPreview] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { setBrand(loadBrand()); }, []);

  function set<K extends keyof BrandKit>(key: K, value: BrandKit[K]) {
    setBrand(b => ({ ...b, [key]: value }));
  }

  function handleSave() {
    saveBrand(brand);
    msgApi.success("Brand kit saved! All new proposals will use your brand.");
  }

  function handleLogoUpload(file: File) {
    if (file.size > 500_000) { msgApi.error("Logo must be under 500 KB"); return false; }
    const reader = new FileReader();
    reader.onload = ev => set("logoUrl", ev.target?.result as string ?? null);
    reader.readAsDataURL(file);
    return false; // prevent auto upload
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Brand Kit</Title>
            
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Your logo, colours, and font — applied to every proposal. Clients never see Zenvoy branding.
          </Text>
        </div>
        <Space>
          <Button icon={preview ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setPreview(p => !p)}>
            {preview ? "Hide Preview" : "Preview Cover"}
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large" style={{ fontWeight: 600 }}>
            Save Brand Kit
          </Button>
        </Space>
      </div>

      <Row gutter={[28, 28]}>
        {/* Editor */}
        <Col xs={24} lg={preview ? 12 : 14}>
          <Card style={{ borderRadius: 16, border: "1px solid #e2e8f0" }} bodyStyle={{ padding: 32 }}>
            <Form layout="vertical" size="large">

              {/* Logo */}
              <Form.Item
                label={<Space><BgColorsOutlined /><span style={{ fontWeight: 600 }}>Logo</span></Space>}
              >
                <Space align="start" size={16}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 16, border: "2px dashed #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#f8fafc", overflow: "hidden", flexShrink: 0,
                  }}>
                    {brand.logoUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={brand.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} />
                      : <span style={{ fontSize: 32 }}>🏢</span>
                    }
                  </div>
                  <div>
                    <Upload beforeUpload={f => handleLogoUpload(f)} showUploadList={false} accept="image/*">
                      <Button icon={<UploadOutlined />}>{brand.logoUrl ? "Change Logo" : "Upload Logo"}</Button>
                    </Upload>
                    {brand.logoUrl && (
                      <Button type="link" danger style={{ padding: "4px 0", display: "block" }} onClick={() => set("logoUrl", null)}>
                        Remove
                      </Button>
                    )}
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>PNG, SVG, JPG · Max 500 KB</Text>
                  </div>
                </Space>
                <Form.Item label="Company / Studio Name" style={{ marginTop: 16, marginBottom: 0 }}>
                  <Input
                    placeholder="Your studio name (shown if no logo)"
                    value={brand.companyName}
                    onChange={e => set("companyName", e.target.value)}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Form.Item>

              <Divider />

              {/* Colours */}
              <Form.Item label={<Space><BgColorsOutlined /><span style={{ fontWeight: 600 }}>Brand Colours</span></Space>}>
                {/* Palette presets */}
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 10 }}>Quick presets:</Text>
                <Space wrap style={{ marginBottom: 20 }}>
                  {PRESET_PALETTES.map(p => (
                    <Tag
                      key={p.name}
                      style={{
                        cursor: "pointer", borderRadius: 20, padding: "4px 12px",
                        border: `2px solid ${brand.primaryColor === p.primary ? p.primary : "#e2e8f0"}`,
                        fontWeight: brand.primaryColor === p.primary ? 700 : 400,
                      }}
                      onClick={() => { set("primaryColor", p.primary); set("secondaryColor", p.secondary); }}
                    >
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: p.primary, marginRight: 6, verticalAlign: "middle" }} />
                      {p.name}
                      {brand.primaryColor === p.primary && <CheckCircleFilled style={{ marginLeft: 6, color: p.primary }} />}
                    </Tag>
                  ))}
                </Space>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Primary" style={{ marginBottom: 0 }}>
                      <Space>
                        <ColorPicker
                          value={brand.primaryColor}
                          onChange={(c: Color) => set("primaryColor", c.toHexString())}
                          showText
                          size="large"
                        />
                      </Space>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Secondary" style={{ marginBottom: 0 }}>
                      <ColorPicker
                        value={brand.secondaryColor}
                        onChange={(c: Color) => set("secondaryColor", c.toHexString())}
                        showText
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Divider />

              {/* Font */}
              <Form.Item label={<Space><FontSizeOutlined /><span style={{ fontWeight: 600 }}>Proposal Font</span></Space>}>
                <Radio.Group
                  value={brand.fontFamily}
                  onChange={e => set("fontFamily", e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {FONT_OPTIONS.map(f => (
                      <Radio
                        key={f.value}
                        value={f.value}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${brand.fontFamily === f.value ? "#0ea5e9" : "#e2e8f0"}`,
                          background: brand.fontFamily === f.value ? "#eff6ff" : "#fff",
                          marginInlineEnd: 0,
                        }}
                      >
                        <Space style={{ marginLeft: 8 }}>
                          <span style={{ fontFamily: `'${f.value}', sans-serif`, fontWeight: 600, fontSize: 15 }}>{f.label}</span>
                          <Text type="secondary" style={{ fontSize: 12 }}>— {f.preview}</Text>
                        </Space>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>

          <Card
            style={{ borderRadius: 14, marginTop: 16, border: "1px solid #dbeafe", background: "#eff6ff" }}
            bodyStyle={{ padding: 18 }}
          >
            <Space>
              <CheckCircleFilled style={{ color: "#0ea5e9", fontSize: 18 }} />
              <div>
                <Text strong style={{ color: "#1d4ed8" }}>White-label included</Text>
                <Text style={{ color: "#2563eb", display: "block", fontSize: 13 }}>
                  Your logo and colours appear on every proposal. Clients never see Zenvoy.
                </Text>
              </div>
            </Space>
          </Card>

          <Link href="/generate" style={{ display: "block", marginTop: 16 }}>
            <Button type="primary" icon={<ArrowRightOutlined />} block size="large" style={{ borderRadius: 12, fontWeight: 600, height: 48 }}>
              Generate Branded Proposal
            </Button>
          </Link>
        </Col>

        {/* Live preview */}
        {preview && (
          <Col xs={24} lg={12}>
            <div style={{ position: "sticky", top: 80 }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8, textAlign: "center" }}>
                Live Cover Page Preview
              </Text>
              <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }}>
                <div style={{ background: "#1e293b", padding: "10px 16px", display: "flex", gap: 6, alignItems: "center" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
                  <Text style={{ color: "#64748b", fontSize: 11, marginLeft: 8 }}>Cover Page Preview</Text>
                </div>
                <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "161.3%", height: "auto" }}>
                  <ProposalCover
                    clientName="Sarah Chen"
                    clientCompany="Acme Corp"
                    projectType="Website Redesign"
                    freelancerName={brand.companyName || "Your Name"}
                    freelancerTitle="Freelancer"
                    brand={brand}
                  />
                </div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}
