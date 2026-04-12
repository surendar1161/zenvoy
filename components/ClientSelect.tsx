"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Select, Space, Typography } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const { Text } = Typography;

export interface ClientOption {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  avatar_color: string;
}

interface Props {
  /** Called when a client is selected — passes the full client object */
  onSelect: (client: ClientOption | null) => void;
  /** Currently selected client id */
  value?: string | null;
  placeholder?: string;
  size?: "large" | "middle" | "small";
  style?: React.CSSProperties;
  /** Show a "+ New Client" option that opens the clients page */
  allowNew?: boolean;
}

export default function ClientSelect({
  onSelect,
  value,
  placeholder = "Select a client…",
  size = "large",
  style,
  allowNew = true,
}: Props) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clients")
      .select("id, name, company, email, phone, avatar_color")
      .order("name")
      .then(({ data }) => {
        setClients((data ?? []) as ClientOption[]);
        setLoading(false);
      });
  }, []);

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  const options = [
    ...clients.map(c => ({
      value: c.id,
      label: (
        <Space size={8}>
          <Avatar
            size={22}
            style={{ background: c.avatar_color, fontSize: 10, fontWeight: 700, flexShrink: 0 }}
          >
            {getInitials(c.name)}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{c.name}</span>
          {c.company && (
            <Text type="secondary" style={{ fontSize: 12 }}>— {c.company}</Text>
          )}
        </Space>
      ),
      // Plain text for search matching
      searchLabel: `${c.name} ${c.company ?? ""} ${c.email ?? ""}`.toLowerCase(),
    })),
  ];

  function handleChange(id: string) {
    if (id === "__new__") {
      window.open("/clients", "_blank");
      return;
    }
    const found = clients.find(c => c.id === id) ?? null;
    onSelect(found);
  }

  return (
    <Select
      showSearch
      allowClear
      size={size}
      style={{ width: "100%", ...style }}
      placeholder={
        <Space size={6}>
          <UserOutlined style={{ color: "#94a3b8" }} />
          <span>{placeholder}</span>
        </Space>
      }
      value={value ?? undefined}
      loading={loading}
      onChange={handleChange}
      onClear={() => onSelect(null)}
      filterOption={(input, option) =>
        (option?.searchLabel as string ?? "").includes(input.toLowerCase())
      }
      options={[
        ...options,
        ...(allowNew ? [{
          value: "__new__",
          searchLabel: "new client",
          label: (
            <Space size={6} style={{ color: "#0ea5e9" }}>
              <PlusOutlined />
              <span style={{ fontWeight: 600 }}>Add new client</span>
            </Space>
          ),
        }] : []),
      ]}
      notFoundContent={
        loading ? "Loading clients…" : (
          <div style={{ padding: "8px 12px", textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 13 }}>No clients yet.</Text>
            <br />
            <Button
              type="link"
              size="small"
              icon={<PlusOutlined />}
              href="/clients"
              target="_blank"
              style={{ padding: 0, marginTop: 4 }}
            >
              Create your first client
            </Button>
          </div>
        )
      }
    />
  );
}
