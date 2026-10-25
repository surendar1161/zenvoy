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
  status: string;
  signed_at: string | null;
}

export default function ContractEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("contracts").select("id,contract_type_name,party_a_name,party_b_name,contract_text,status,signed_at").eq("id", id).single();
      setContract(data as Contract);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(html: string) {
    // Prevent editing signed contracts
    if (contract?.status === "signed" || contract?.signed_at) {
      throw new Error("Cannot edit a signed contract. Contract is legally binding and immutable.");
    }
    
    const supabase = createClient();
    const { error } = await supabase.from("contracts").update({ contract_text: html }).eq("id", id);
    
    if (error) throw error;
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-canvas"><Spin size="large" /></div>;
  if (!contract) return <div className="flex min-h-screen items-center justify-center bg-canvas"><Result status="404" title="Contract not found" extra={<Button href="/contracts">Back</Button>} /></div>;

  // Show warning if contract is signed
  if (contract.status === "signed" || contract.signed_at) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
        <Result
          status="warning"
          title="Contract is Signed"
          subTitle="This contract has been legally signed and cannot be edited. Any modifications would invalidate the signatures."
          extra={[
            <Button key="back" href="/contracts?tab=my-contracts">Back to Contracts</Button>,
            <Button key="view" type="primary" href={`/contract/${id}`}>View Contract</Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RichEditor
        content={contract.contract_text ?? ""}
        documentId={id}
        documentType="contract"
        title={`${contract.contract_type_name} — ${contract.party_a_name} & ${contract.party_b_name}`}
        onSave={handleSave}
        backHref="/contracts?tab=my-contracts"
        backLabel="My Contracts"
        readOnly={contract.status === "signed" || !!contract.signed_at}
      />
    </div>
  );
}
