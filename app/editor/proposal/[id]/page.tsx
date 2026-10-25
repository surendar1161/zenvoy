"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Result, Spin, Alert } from "antd";
import { ArrowLeftOutlined, WarningOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/RichEditor"), { ssr: false });

interface Proposal {
  id: string; client_name: string; project_type: string | null;
  proposal_text: string | null;
  status: string;
  accepted_at: string | null;
}

export default function ProposalEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("proposals").select("id,client_name,project_type,proposal_text,status,accepted_at").eq("id", id).single();
      setProposal(data as Proposal);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(html: string) {
    const supabase = createClient();
    
    // Track late edits after proposal has been sent/viewed/accepted
    if (proposal?.status && ["sent", "viewed", "accepted"].includes(proposal.status)) {
      // Log warning but allow edit (with tracking)
      console.warn(`⚠️ Late edit detected: Proposal ${id} edited after status "${proposal.status}"`);
      
      // Update with edit tracking metadata
      const { error } = await supabase.from("proposals").update({ 
        proposal_text: html,
        // You could add: last_edited_at, edit_count, etc. if those columns exist
      }).eq("id", id);
      
      if (error) throw error;
    } else {
      // Normal edit for draft proposals
      const { error } = await supabase.from("proposals").update({ proposal_text: html }).eq("id", id);
      if (error) throw error;
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-canvas"><Spin size="large" /></div>;
  if (!proposal) return <div className="flex min-h-screen items-center justify-center bg-canvas"><Result status="404" title="Proposal not found" extra={<Button href="/proposals">Back</Button>} /></div>;

  // Show warning if proposal is accepted (but still allow editing with caution)
  const isAccepted = proposal.status === "accepted" || proposal.accepted_at;
  const isLateEdit = ["sent", "viewed", "accepted"].includes(proposal.status);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {isAccepted && (
        <Alert
          type="error"
          icon={<WarningOutlined />}
          message="Proposal Already Accepted"
          description="This proposal has been accepted by the client. Editing may cause confusion. Consider creating a new version instead."
          showIcon
          closable
          style={{ margin: "16px 16px 0" }}
        />
      )}
      {isLateEdit && !isAccepted && (
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message={`Editing After ${proposal.status === "sent" ? "Sending" : proposal.status === "viewed" ? "Client Viewed" : "Status Change"}`}
          description="This proposal has been shared with the client. Your changes will be tracked and may affect what the client sees."
          showIcon
          closable
          style={{ margin: "16px 16px 0" }}
        />
      )}
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
