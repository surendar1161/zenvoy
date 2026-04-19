"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Result, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/RichEditor"), { ssr: false });

interface Proposal {
  id: string; client_name: string; project_type: string | null;
  proposal_text: string | null;
}

export default function ProposalEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("proposals").select("id,client_name,project_type,proposal_text").eq("id", id).single();
      setProposal(data as Proposal);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(html: string) {
    const supabase = createClient();
    await supabase.from("proposals").update({ proposal_text: html }).eq("id", id);
  }

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spin size="large" /></div>;
  if (!proposal) return <Result status="404" title="Proposal not found" extra={<Button href="/proposals">Back</Button>} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <RichEditor
        content={proposal.proposal_text ?? ""}
        documentId={id}
        documentType="proposal"
        title={`${proposal.client_name} — ${proposal.project_type ?? "Proposal"}`}
        onSave={handleSave}
        backHref="/proposals"
        backLabel="My Proposals"
      />
    </div>
  );
}
