"use client";

import { useState } from "react";
import { Modal, Table, Typography, Space, Tag, message } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  hourly_rate: number | null;
  amount: number;
  date: string;
  client_id: string | null;
  projects?: { name: string } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  entries: TimeEntry[];
  onCreated: (invoiceId: string) => void;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function InvoiceFromTimeEntries({ open, onClose, entries, onCreated }: Props) {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const totalHours = entries.reduce((s, e) => s + e.duration, 0);
  const totalAmount = entries.reduce((s, e) => s + (e.amount ?? 0), 0);

  const clientIds = [...new Set(entries.map(e => e.client_id).filter(Boolean))];
  const multipleClients = clientIds.length > 1;

  async function handleCreate() {
    if (entries.length === 0) return;
    setCreating(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreating(false); return; }

    const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true });
    const invNum = `INV-${String((count ?? 0) + 1).padStart(4, "0")}`;

    const lineItems = entries.map(e => ({
      description: `${e.description || "Time entry"}${e.projects?.name ? ` (${e.projects.name})` : ""} — ${formatDuration(e.duration)}`,
      quantity: parseFloat((e.duration / 60).toFixed(2)),
      unit_price: e.hourly_rate ?? 0,
      amount: e.amount ?? 0,
    }));

    const subtotal = lineItems.reduce((s, l) => s + l.amount, 0);

    const { data: invoice, error } = await supabase.from("invoices").insert({
      user_id: user.id,
      client_id: clientIds[0] ?? null,
      invoice_number: invNum,
      title: `Time-based Invoice`,
      line_items: lineItems,
      subtotal,
      tax_rate: 0,
      tax_amount: 0,
      discount: 0,
      total: subtotal,
      currency: "USD",
      status: "draft",
    }).select("id").single();

    if (error) {
      message.error(error.message);
      setCreating(false);
      return;
    }

    const entryIds = entries.map(e => e.id);
    await supabase.from("time_entries")
      .update({ invoiced: true, invoice_id: invoice.id })
      .in("id", entryIds);

    setCreating(false);
    message.success(`Invoice ${invNum} created from ${entries.length} time entries`);
    onCreated(invoice.id);
    router.push(`/invoices/${invoice.id}`);
  }

  const columns = [
    {
      title: "Description", dataIndex: "description", key: "desc",
      render: (v: string, r: TimeEntry) => (
        <div>
          <Text style={{ fontSize: 13 }}>{v || "Untitled"}</Text>
          {r.projects?.name && <Tag style={{ marginLeft: 6, fontSize: 11 }}>{r.projects.name}</Tag>}
        </div>
      ),
    },
    {
      title: "Duration", dataIndex: "duration", key: "dur", width: 100,
      render: (v: number) => <Text style={{ fontSize: 13 }}>{formatDuration(v)}</Text>,
    },
    {
      title: "Rate", dataIndex: "hourly_rate", key: "rate", width: 90,
      render: (v: number | null) => <Text style={{ fontSize: 13 }}>{v ? `$${v}/hr` : "—"}</Text>,
    },
    {
      title: "Amount", dataIndex: "amount", key: "amt", width: 100,
      render: (v: number) => <Text strong style={{ fontSize: 13, color: "#10b981" }}>${(v ?? 0).toFixed(2)}</Text>,
    },
  ];

  return (
    <Modal
      open={open} onCancel={onClose}
      title={<Space><DollarOutlined style={{ color: "#0ea5e9" }} />Create Invoice from Time Entries</Space>}
      width={680}
      okText="Create Invoice"
      onOk={handleCreate}
      confirmLoading={creating}
      okButtonProps={{ disabled: entries.length === 0 || multipleClients }}
    >
      {multipleClients && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
          <Text style={{ color: "#c2410c", fontSize: 13 }}>
            Selected entries belong to different clients. Please select entries from a single client.
          </Text>
        </div>
      )}

      <Table dataSource={entries} columns={columns} rowKey="id" pagination={false} size="small" />

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#f0fdf4", borderRadius: 10 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Total Time</Text>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{formatDuration(totalHours)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Total Amount</Text>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>${totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </Modal>
  );
}
