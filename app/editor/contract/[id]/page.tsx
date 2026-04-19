"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Result, Spin } from "antd";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/RichEditor"), { ssr: false });

interface Contract {
  id: string; contract_type_name: string;
  party_a_name: string; party_b_name: string;
  contract_text: string | null;
}

export default function ContractEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("contracts").select("id,contract_type_name,party_a_name,party_b_name,contract_text").eq("id", id).single();
      setContract(data as Contract);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(html: string) {
    const supabase = createClient();
    await supabase.from("contracts").update({ contract_text: html }).eq("id", id);
  }

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spin size="large" /></div>;
  if (!contract) return <Result status="404" title="Contract not found" extra={<Button href="/contracts">Back</Button>} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <RichEditor
        content={contract.contract_text ?? ""}
        documentId={id}
        documentType="contract"
        title={`${contract.contract_type_name} — ${contract.party_a_name} & ${contract.party_b_name}`}
        onSave={handleSave}
        backHref="/contracts?tab=my-contracts"
        backLabel="My Contracts"
      />
    </div>
  );
}
