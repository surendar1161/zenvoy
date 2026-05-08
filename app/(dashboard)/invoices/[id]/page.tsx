"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Col, Divider, Row, Select, Space, Spin, Tag, Typography, message,
} from "antd";
import {
  ArrowLeftOutlined, PrinterOutlined, DownloadOutlined, CopyOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STATUS_COLOR: Record<string, string> = {
  draft: "#94a3b8", sent: "#3b82f6", viewed: "#8b5cf6",
  paid: "#10b981", overdue: "#ef4444", cancelled: "#94a3b8",
};

interface LineItem { description: string; quantity: number; unit_price: number; amount: number; }
interface Invoice {
  id: string; invoice_number: string | null; title: string;
  line_items: LineItem[]; subtotal: number; tax_rate: number;
  tax_amount: number; discount: number; total: number;
  currency: string; status: string; due_date: string | null;
  paid_at: string | null; sent_at: string | null;
  payment_link: string | null; notes: string | null; footer: string | null;
  is_recurring: boolean; recurrence: string | null; created_at: string;
  clients?: {
    name: string; company: string | null; email: string | null;
    phone: string | null; website: string | null; address: string | null;
  } | null;
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; company?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgApi, ctx] = message.useMessage();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const supabase = createClient();
    const [{ data: { user: u } }, { data: inv }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("invoices").select("*, clients(name,company,email,phone,website,address)").eq("id", id).single(),
    ]);
    if (!inv) { router.push("/invoices"); return; }
    setUser(u);
    setProfile({
      full_name: u?.user_metadata?.full_name as string ?? "",
      email: u?.email ?? "",
      company: u?.user_metadata?.company as string ?? "",
    });
    setInvoice(inv as Invoice);
    setLoading(false);
  }

  async function updateStatus(status: string) {
    const supabase = createClient();
    const extra = status === "paid" ? { paid_at: new Date().toISOString() } : {};
    await supabase.from("invoices").update({ status, ...extra }).eq("id", id);
    setInvoice(prev => prev ? { ...prev, status, ...(status === "paid" ? { paid_at: new Date().toISOString() } : {}) } : prev);
    msgApi.success("Status updated");
  }

  function handlePrint() { window.print(); }

  function handleCopyLink() {
    if (invoice?.payment_link) {
      navigator.clipboard.writeText(invoice.payment_link);
      msgApi.success("Payment link copied!");
    }
  }

  async function stopRecurring() {
    const supabase = createClient();
    await supabase.from("invoices").update({ is_recurring: false, next_invoice_at: null }).eq("id", id);
    setInvoice(prev => prev ? { ...prev, is_recurring: false } : prev);
    msgApi.success("Recurring stopped");
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 120 }}><Spin size="large" /></div>;
  if (!invoice) return null;

  const cur = invoice.currency;
  const fmt = (n: number) => `${cur} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== "paid";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px" }}>
      {ctx}

      {/* Toolbar — hidden on print */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <Link href="/invoices">
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#64748b", padding: "4px 0" }}>All Invoices</Button>
        </Link>
        <Space wrap>
          <Select
            value={invoice.status}
            style={{ width: 130 }}
            onChange={updateStatus}
            options={["draft","sent","viewed","paid","overdue","cancelled"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
          {invoice.is_recurring && (
            <Button danger icon={<StopOutlined />} onClick={stopRecurring}>Stop Recurring</Button>
          )}
          {invoice.payment_link && (
            <Button icon={<CopyOutlined />} onClick={handleCopyLink}>Copy Payment Link</Button>
          )}
          <Button icon={<DownloadOutlined />} onClick={() => window.open(`/api/pdf/invoice/${id}`, "_blank")}>Download PDF</Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
        </Space>
      </div>

      {/* Invoice document */}
      <div ref={printRef} style={{
        background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
      }}>
        {/* Header band */}
        <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0ea5e9)", padding: "36px 44px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={1} style={{ color: "#fff", margin: 0, fontWeight: 900, fontSize: 42, letterSpacing: "-1px" }}>
                INVOICE
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, display: "block", marginTop: 4 }}>
                {invoice.invoice_number ?? "—"}
              </Text>
              {invoice.is_recurring && (
                <Tag style={{ marginTop: 8, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 12 }}>
                  🔄 Recurring {invoice.recurrence}
                </Tag>
              )}
            </Col>
            <Col style={{ textAlign: "right" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", display: "inline-block" }}>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, display: "block", marginBottom: 2 }}>AMOUNT DUE</Text>
                <Text style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>{fmt(invoice.total)}</Text>
              </div>
              <div style={{ marginTop: 12 }}>
                <Tag style={{
                  borderRadius: 20, fontSize: 13, fontWeight: 700, padding: "4px 16px",
                  background: invoice.status === "paid" ? "#10b981" : isOverdue ? "#ef4444" : "rgba(255,255,255,0.2)",
                  border: "none", color: "#fff", textTransform: "capitalize",
                }}>
                  {invoice.status === "paid" ? <><CheckCircleOutlined style={{ marginRight: 6 }} />Paid</> : isOverdue ? <><ClockCircleOutlined style={{ marginRight: 6 }} />Overdue</> : invoice.status}
                </Tag>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ padding: "36px 44px" }}>
          {/* From / To / Dates */}
          <Row gutter={[32, 24]} style={{ marginBottom: 36 }}>
            {/* From — Freelancer */}
            <Col xs={24} sm={8}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>FROM</Text>
              <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                {profile?.full_name || user?.email?.split("@")[0] || "Freelancer"}
              </Text>
              {profile?.company && <Text style={{ display: "block", color: "#374151", fontSize: 14 }}>{profile.company}</Text>}
              <Text style={{ display: "block", color: "#64748b", fontSize: 13 }}>{user?.email}</Text>
            </Col>

            {/* To — Client */}
            <Col xs={24} sm={8}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>BILLED TO</Text>
              {invoice.clients ? (
                <>
                  <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>{invoice.clients.name}</Text>
                  {invoice.clients.company && <Text style={{ display: "block", color: "#374151", fontSize: 14 }}>{invoice.clients.company}</Text>}
                  {invoice.clients.email && <Text style={{ display: "block", color: "#64748b", fontSize: 13 }}>{invoice.clients.email}</Text>}
                  {invoice.clients.phone && <Text style={{ display: "block", color: "#64748b", fontSize: 13 }}>{invoice.clients.phone}</Text>}
                  {invoice.clients.address && <Text style={{ display: "block", color: "#64748b", fontSize: 13, marginTop: 4, whiteSpace: "pre-line" }}>{invoice.clients.address}</Text>}
                </>
              ) : (
                <Text type="secondary">No client linked</Text>
              )}
            </Col>

            {/* Dates */}
            <Col xs={24} sm={8}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>DETAILS</Text>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {[
                  { label: "Invoice #",    value: invoice.invoice_number ?? "—" },
                  { label: "Issue Date",   value: dayjs(invoice.created_at).format("MMM D, YYYY") },
                  { label: "Due Date",     value: invoice.due_date ? dayjs(invoice.due_date).format("MMM D, YYYY") : "—", highlight: !!isOverdue },
                  ...(invoice.paid_at ? [{ label: "Paid On", value: dayjs(invoice.paid_at).format("MMM D, YYYY"), highlight: false }] : []),
                ].map(d => (
                  <div key={d.label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>{d.label}</Text>
                    <Text strong style={{ fontSize: 13, color: d.highlight ? "#ef4444" : "#0f172a" }}>{d.value}</Text>
                  </div>
                ))}
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: "0 0 28px" }} />

          {/* Invoice title */}
          <div style={{ marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, color: "#0f172a" }}>{invoice.title}</Title>
          </div>

          {/* Line items table */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 28 }}>
            {/* Table header */}
            <div style={{ background: "#f8fafc", padding: "12px 20px", display: "grid", gridTemplateColumns: "1fr 80px 100px 100px", gap: 12, borderBottom: "1px solid #e2e8f0" }}>
              {["Description", "Qty", "Rate", "Amount"].map((h, i) => (
                <Text key={h} strong style={{ fontSize: 12, color: "#64748b", textAlign: i > 0 ? "right" : "left" }}>{h}</Text>
              ))}
            </div>
            {/* Rows */}
            {(invoice.line_items ?? []).map((item, i) => (
              <div key={i} style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 80px 100px 100px", gap: 12, borderBottom: i < invoice.line_items.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <Text style={{ fontSize: 14 }}>{item.description || "—"}</Text>
                <Text style={{ fontSize: 14, textAlign: "right" }}>{item.quantity}</Text>
                <Text style={{ fontSize: 14, textAlign: "right" }}>{fmt(item.unit_price)}</Text>
                <Text strong style={{ fontSize: 14, textAlign: "right" }}>{fmt(item.amount)}</Text>
              </div>
            ))}
          </div>

          {/* Totals */}
          <Row justify="end">
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>Subtotal</Text>
                  <Text style={{ fontSize: 14 }}>{fmt(invoice.subtotal)}</Text>
                </div>
                {invoice.tax_rate > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text type="secondary" style={{ fontSize: 14 }}>Tax ({invoice.tax_rate}%)</Text>
                    <Text style={{ fontSize: 14 }}>{fmt(invoice.tax_amount)}</Text>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text type="secondary" style={{ fontSize: 14 }}>Discount</Text>
                    <Text style={{ fontSize: 14, color: "#10b981" }}>− {fmt(invoice.discount)}</Text>
                  </div>
                )}
                <Divider style={{ margin: "6px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ fontSize: 16 }}>Total Due</Text>
                  <Text strong style={{ fontSize: 22, color: "#0ea5e9" }}>{fmt(invoice.total)}</Text>
                </div>
                {invoice.status === "paid" && (
                  <div style={{ textAlign: "center", background: "#f0fdf4", borderRadius: 10, padding: "10px", border: "1px solid #bbf7d0", marginTop: 4 }}>
                    <Text style={{ color: "#10b981", fontWeight: 700 }}><CheckCircleOutlined style={{ marginRight: 6 }} />PAID IN FULL</Text>
                  </div>
                )}
              </Space>
            </Col>
          </Row>

          {/* Payment link */}
          {invoice.payment_link && invoice.status !== "paid" && (
            <div style={{ marginTop: 28, background: "#eff6ff", borderRadius: 12, padding: "16px 20px", border: "1px solid #bfdbfe" }}>
              <Text strong style={{ color: "#1d4ed8", display: "block", marginBottom: 8 }}>💳 Pay Online</Text>
              <a href={invoice.payment_link} target="_blank" rel="noopener noreferrer">
                <Button type="primary" size="large" style={{ borderRadius: 10, fontWeight: 700, background: "#0ea5e9", borderColor: "#0ea5e9" }}>
                  Pay {fmt(invoice.total)} Now
                </Button>
              </a>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div style={{ marginTop: 28 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>NOTES & PAYMENT TERMS</Text>
              <Text style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{invoice.notes}</Text>
            </div>
          )}

          {/* Footer */}
          <Divider style={{ marginTop: 36, marginBottom: 16 }} />
          <Text type="secondary" style={{ fontSize: 12, textAlign: "center", display: "block" }}>
            {invoice.footer ?? `Thank you for your business, ${invoice.clients?.name ?? ""}! Questions? Contact ${user?.email ?? ""}`}
          </Text>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
