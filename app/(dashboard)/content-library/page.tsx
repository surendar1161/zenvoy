"use client";

import { useEffect, useState } from "react";
import {
  Button, Card, Col, Empty, Input, Modal, Row, Select, Space, Tag, Typography, message, Tooltip,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, CopyOutlined, EditOutlined, BookOutlined,
} from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CATEGORIES = ["General", "About Me", "Case Study", "Scope of Work", "Terms & Conditions", "Why Choose Me", "Pricing", "Timeline", "Testimonials"];

interface LibraryItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  use_count: number;
  created_at: string;
}

export default function ContentLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<LibraryItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("content_library").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as LibraryItem[]);
    setLoading(false);
  }

  async function save() {
    if (!editItem?.title?.trim() || !editItem?.content?.trim()) {
      msgApi.error("Title and content are required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    if (editItem.id) {
      await supabase.from("content_library").update({
        title: editItem.title, content: editItem.content,
        category: editItem.category ?? "General", tags: editItem.tags ?? [],
      }).eq("id", editItem.id);
    } else {
      await supabase.from("content_library").insert({
        title: editItem.title, content: editItem.content,
        category: editItem.category ?? "General", tags: editItem.tags ?? [],
      });
    }
    setSaving(false);
    setEditItem(null);
    msgApi.success(editItem.id ? "Updated!" : "Saved to library!");
    load();
  }

  async function remove(id: string) {
    Modal.confirm({
      title: "Delete this item?", okText: "Delete", okType: "danger",
      onOk: async () => {
        const supabase = createClient();
        await supabase.from("content_library").delete().eq("id", id);
        setItems(prev => prev.filter(i => i.id !== id));
        msgApi.success("Deleted");
      },
    });
  }

  function copyContent(content: string) {
    navigator.clipboard.writeText(content);
    msgApi.success("Copied to clipboard!");
  }

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || i.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      {ctx}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <Space align="center" style={{ marginBottom: 6 }}>
            <BookOutlined style={{ fontSize: 24, color: "#0ea5e9" }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Content Library</Title>
          </Space>
          <Text type="secondary" style={{ fontSize: 15 }}>Save reusable sections — case studies, T&Cs, about pages — and insert them into any proposal with one click.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => setEditItem({ title: "", content: "", category: "General", tags: [] })}
          style={{ borderRadius: 10, fontWeight: 600 }}>
          Add Section
        </Button>
      </div>

      {/* Filters */}
      <Space style={{ marginBottom: 24 }} wrap>
        <Input prefix={<span>🔍</span>} placeholder="Search…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ width: 260, borderRadius: 10 }} allowClear />
        <Select placeholder="All categories" allowClear value={category ?? undefined}
          onChange={v => setCategory(v ?? null)} style={{ width: 180, borderRadius: 10 }}
          options={CATEGORIES.map(c => ({ value: c, label: c }))} />
      </Space>

      {loading ? null : filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, textAlign: "center" }} styles={{ body: { padding: "80px 40px" } }}>
          <Empty image={<BookOutlined style={{ fontSize: 64, color: "#cbd5e1" }} />}
            imageStyle={{ height: 80 }}
            description={<><Title level={4} style={{ color: "#64748b" }}>No saved sections yet</Title><Text type="secondary">Create reusable content blocks — About Me, Case Studies, T&Cs — and insert them anywhere.</Text></>}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditItem({ title: "", content: "", category: "General", tags: [] })}>
              Create First Section
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map(item => (
            <Col key={item.id} xs={24} sm={12} lg={8}>
              <Card hoverable style={{ borderRadius: 16, border: "1px solid #e2e8f0", height: "100%" }}
                styles={{ body: { padding: 20 } }}
                actions={[
                  <Tooltip key="copy" title="Copy content"><Button type="text" icon={<CopyOutlined />} onClick={() => copyContent(item.content)} /></Tooltip>,
                  <Tooltip key="edit" title="Edit"><Button type="text" icon={<EditOutlined />} onClick={() => setEditItem(item)} /></Tooltip>,
                  <Tooltip key="del" title="Delete"><Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(item.id)} /></Tooltip>,
                ]}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <Text strong style={{ fontSize: 15 }}>{item.title}</Text>
                    <Tag style={{ borderRadius: 20, fontSize: 11, flexShrink: 0 }}>{item.category}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 13, display: "block" }}>
                    {item.content.replace(/<[^>]+>/g, " ").slice(0, 120)}…
                  </Text>
                  {item.tags?.length > 0 && (
                    <Space wrap>
                      {item.tags.slice(0, 3).map(t => <Tag key={t} style={{ borderRadius: 20, fontSize: 11 }}>{t}</Tag>)}
                    </Space>
                  )}
                  <Text type="secondary" style={{ fontSize: 11 }}>Used {item.use_count}× · {new Date(item.created_at).toLocaleDateString()}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit/Create Modal */}
      <Modal
        open={!!editItem}
        onCancel={() => setEditItem(null)}
        title={editItem?.id ? "Edit Section" : "Add to Content Library"}
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setEditItem(null)}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={save}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            {editItem?.id ? "Update" : "Save to Library"}
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Title *</Text>
            <Input value={editItem?.title ?? ""} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. About Me, Case Study: Acme Corp" style={{ borderRadius: 8 }} />
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Category</Text>
            <Select value={editItem?.category ?? "General"} onChange={v => setEditItem(p => ({ ...p, category: v }))}
              style={{ width: "100%" }} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Content * (HTML or plain text)</Text>
            <TextArea rows={8} value={editItem?.content ?? ""}
              onChange={e => setEditItem(p => ({ ...p, content: e.target.value }))}
              placeholder="Write or paste your reusable content here…"
              style={{ borderRadius: 8, fontFamily: "monospace", fontSize: 13 }} />
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Tags (comma separated)</Text>
            <Input value={(editItem?.tags ?? []).join(", ")}
              onChange={e => setEditItem(p => ({ ...p, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
              placeholder="e.g. NDA, freelance, tech" style={{ borderRadius: 8 }} />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
