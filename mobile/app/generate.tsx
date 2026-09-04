import { useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { colors, spacing } from "@/design-system";

export default function GenerateScreen() {
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [timeline, setTimeline] = useState("4 weeks");
  const [budget, setBudget] = useState("5000");
  const [jobPost, setJobPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  async function parseJob() {
    if (!jobPost.trim()) return;
    setParsing(true);
    try {
      const data = await api.parseJobPost(jobPost);
      if (data.projectType) setProjectType(String(data.projectType));
      if (data.projectDescription) setDescription(String(data.projectDescription));
      if (data.deliverables) setDeliverables(String(data.deliverables));
      if (data.timeline) setTimeline(String(data.timeline));
      if (data.budget) setBudget(String(data.budget));
      if (data.clientCompany) setClientName(String(data.clientCompany));
    } catch {
      setError("Could not parse job post");
    }
    setParsing(false);
  }

  async function generate() {
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setError("Not signed in");
      return;
    }
    setLoading(true);
    try {
      const form = {
        freelancerName: (user.user_metadata?.full_name as string) ?? "Freelancer",
        freelancerTitle: "Freelancer",
        freelancerEmail: user.email,
        clientName,
        clientCompany: "",
        projectType,
        projectDescription: description,
        deliverables,
        timeline,
        totalBudget: Number(budget) || 5000,
        depositPercent: 50,
        currency: "USD",
        tone: "professional",
        sections: [],
      };
      const text = await api.generateProposal(form);
      const { data: saved, error: saveErr } = await supabase.from("proposals").insert({
        user_id: user.id,
        client_name: clientName,
        project_type: projectType,
        project_description: description,
        deliverables,
        timeline,
        proposal_text: text,
        total_budget: Number(budget),
        deposit_percent: 50,
        deposit_amount: Math.round(Number(budget) * 0.5),
        currency: "USD",
        tone: "professional",
        status: "draft",
        freelancer_name: form.freelancerName,
        freelancer_email: user.email,
      }).select("id").single();
      if (saveErr) throw saveErr;
      router.replace(`/proposal/${saved!.id}`);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card style={styles.section}>
          <Text variant="label">Paste job brief</Text>
          <Input
            value={jobPost}
            onChangeText={setJobPost}
            placeholder="Upwork listing, email, LinkedIn post…"
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />
          <Button title="Auto-fill from brief" variant="secondary" onPress={parseJob} loading={parsing} />
        </Card>

        <Text variant="label" style={styles.label}>Client name *</Text>
        <Input value={clientName} onChangeText={setClientName} placeholder="Sarah Chen" />

        <Text variant="label" style={styles.label}>Project type *</Text>
        <Input value={projectType} onChangeText={setProjectType} placeholder="Website redesign" />

        <Text variant="label" style={styles.label}>Description *</Text>
        <Input value={description} onChangeText={setDescription} multiline numberOfLines={3} style={styles.multiline} />

        <Text variant="label" style={styles.label}>Deliverables *</Text>
        <Input value={deliverables} onChangeText={setDeliverables} multiline numberOfLines={2} style={styles.multiline} />

        <Text variant="label" style={styles.label}>Timeline *</Text>
        <Input value={timeline} onChangeText={setTimeline} />

        <Text variant="label" style={styles.label}>Total budget (USD)</Text>
        <Input value={budget} onChangeText={setBudget} keyboardType="numeric" />

        {error ? <Text variant="bodySmall" color={colors.error}>{error}</Text> : null}

        <Button title="Generate proposal" onPress={generate} loading={loading} size="lg" style={styles.generate} />
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text variant="bodySmall">Claude is writing your proposal…</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.lg },
  label: { marginTop: spacing.md, marginBottom: spacing.xs },
  multiline: { minHeight: 88, textAlignVertical: "top" },
  generate: { marginTop: spacing.xl },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
});
