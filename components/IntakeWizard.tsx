"use client";

import { useState } from "react";
import type { ProposalFormData } from "@/lib/types";
import ClientSelect from "@/components/ClientSelect";
import type { ClientOption } from "@/components/ClientSelect";

interface Props {
  onComplete: (data: ProposalFormData) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: "Project", title: "What's the project?" },
  { id: 2, label: "Brief", title: "Paste their brief or describe the scope" },
  { id: 3, label: "Deliverables", title: "What will you deliver?" },
  { id: 4, label: "Budget", title: "Timeline & budget" },
  { id: 5, label: "You", title: "A bit about you" },
];

const projectTypes = [
  "🌐 Web Design & Development",
  "📱 Mobile App Development",
  "🎨 Branding & Identity",
  "📈 SEO & Content Marketing",
  "📱 Social Media Management",
  "✍️ Copywriting",
  "🎬 Video Production",
  "📐 UI/UX Design",
  "📊 Data Analysis",
  "💼 Consulting",
  "⚙️ Other",
];

const currencies = ["USD", "GBP", "EUR", "AUD", "CAD", "INR", "ILS", "SGD"];

const toneOptions = [
  { value: "professional", label: "💼 Professional", desc: "Formal & polished" },
  { value: "friendly", label: "😊 Friendly", desc: "Warm & conversational" },
  { value: "bold", label: "🚀 Bold", desc: "Confident & results-focused" },
];

export default function IntakeWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Step 1
  const [projectType, setProjectType] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");

  // Step 2
  const [jobPost, setJobPost] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [painPoints, setPainPoints] = useState("");

  // Step 3
  const [deliverables, setDeliverables] = useState("");

  // Step 4
  const [timeline, setTimeline] = useState("");
  const [totalBudget, setTotalBudget] = useState(5000);
  const [currency, setCurrency] = useState("USD");
  const [depositPercent, setDepositPercent] = useState(50);
  const [tone, setTone] = useState<"professional" | "friendly" | "bold">("professional");

  // Step 5
  const [freelancerName, setFreelancerName] = useState("");
  const [freelancerTitle, setFreelancerTitle] = useState("");
  const [freelancerEmail, setFreelancerEmail] = useState("");

  async function parseJobPost() {
    if (!jobPost.trim()) return;
    setParsing(true);
    setParseError(null);
    try {
      const res = await fetch("/api/parse-job-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPost }),
      });
      if (!res.ok) throw new Error("Failed to parse");
      const data = await res.json();
      if (data.projectType && !projectType) setProjectType(data.projectType.replace(/^[^|]+\| ?/, "").trim());
      if (data.projectDescription) setProjectDescription(data.projectDescription);
      if (data.painPoints) setPainPoints(data.painPoints);
      if (data.deliverables && !deliverables) setDeliverables(data.deliverables);
      if (data.timeline && !timeline) setTimeline(data.timeline);
      if (data.budget && data.budget > 0 && !totalBudget) setTotalBudget(data.budget);
      if (data.clientCompany && !clientCompany) setClientCompany(data.clientCompany);
    } catch {
      setParseError("Couldn't auto-fill — please fill in the fields below manually.");
    } finally {
      setParsing(false);
    }
  }

  function next() { setStep((s) => Math.min(s + 1, 5)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  function submit() {
    const clean = (s: string) => s.replace(/^[🌐📱🎨📈✍️🎬📐📊💼⚙️]\s*/, "");
    onComplete({
      freelancerName,
      freelancerTitle,
      freelancerEmail,
      clientName,
      clientCompany,
      projectType: clean(projectType),
      projectDescription: projectDescription + (painPoints ? `\n\nClient's key goals: ${painPoints}` : ""),
      deliverables,
      timeline,
      totalBudget,
      depositPercent,
      currency,
      tone,
    });
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const currentStep = STEPS[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header with progress */}
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Proposal Wizard</h2>
              <p className="text-sm text-gray-500">Step {step} of {STEPS.length} — {currentStep.label}</p>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
              ✕
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
            <div
              className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step labels */}
          <div className="flex justify-between mt-1 mb-5">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`text-xs font-medium transition-colors ${
                  s.id === step ? "text-brand-600" : s.id < step ? "text-green-600" : "text-gray-400"
                }`}
              >
                {s.id < step ? "✓" : s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">{currentStep.title}</h3>

          {/* STEP 1 — Project type + client */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">Project Type *</label>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {projectTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setProjectType(t)}
                      className={`text-left text-sm px-3 py-2.5 rounded-lg border-2 transition-all ${
                        projectType === t
                          ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Client *</label>
                <ClientSelect
                  onSelect={(client: ClientOption | null) => {
                    setClientName(client?.name ?? "");
                    setClientCompany(client?.company ?? "");
                  }}
                  placeholder="Choose an existing client…"
                  size="middle"
                />
                {clientName && (
                  <div style={{ marginTop: 8, padding: "8px 12px", background: "#f0f9ff", borderRadius: 8, fontSize: 13, color: "#0369a1" }}>
                    ✓ <strong>{clientName}</strong>{clientCompany ? ` · ${clientCompany}` : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 — Job post / scope */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Paste their job post or brief</label>
                  <span className="text-xs text-brand-600 font-medium">AI reads it and auto-fills below</span>
                </div>
                <textarea
                  className="input min-h-[110px] font-mono text-xs"
                  placeholder="Paste the client's job post, email, or brief here… AI will extract the key details automatically."
                  value={jobPost}
                  onChange={e => setJobPost(e.target.value)}
                />
                {jobPost.trim() && (
                  <button
                    type="button"
                    onClick={parseJobPost}
                    disabled={parsing}
                    className="btn-primary mt-2 text-sm py-2"
                  >
                    {parsing ? (
                      <><span className="animate-spin inline-block">⚡</span> Reading brief...</>
                    ) : "⚡ Auto-fill from brief"}
                  </button>
                )}
                {parseError && <p className="text-xs text-amber-600 mt-1">{parseError}</p>}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or describe in your own words</span></div>
              </div>

              <div>
                <label className="label">Project Description *</label>
                <textarea className="input min-h-[90px]" required
                  placeholder="Describe what the client needs and their core goal…"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)} />
              </div>
              {painPoints && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                  <p className="text-xs font-medium text-green-700 mb-1">✅ Client pain points extracted (will be woven into proposal):</p>
                  <p className="text-xs text-green-600 italic">{painPoints}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Deliverables */}
          {step === 3 && (
            <div>
              <label className="label">Key Deliverables *</label>
              <p className="text-xs text-gray-500 mb-2">
                List what the client gets. Use bullet points (•) for clarity. AI will expand these into a professional scope.
              </p>
              <textarea
                className="input min-h-[180px]"
                placeholder={`• Responsive website (5 pages)\n• CMS integration\n• SEO setup\n• 3 rounds of revisions\n• 30-day support`}
                value={deliverables}
                onChange={e => setDeliverables(e.target.value)}
              />
            </div>
          )}

          {/* STEP 4 — Timeline, budget, tone */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Project Timeline *</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="date"
                      className="input"
                      style={{ flex: 1 }}
                      min={new Date().toISOString().split("T")[0]}
                      value={timeline ? (() => { const s = timeline.split(" → ")[0]; try { return new Date(s).toISOString().split("T")[0]; } catch { return ""; } })() : ""}
                      onChange={e => {
                        const start = e.target.value ? new Date(e.target.value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
                        const end = timeline.split(" → ")[1] ?? "";
                        setTimeline(start && end ? `${start} → ${end}` : "");
                      }}
                    />
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>→</span>
                    <input
                      type="date"
                      className="input"
                      style={{ flex: 1 }}
                      min={new Date().toISOString().split("T")[0]}
                      value={timeline && timeline.includes(" → ") ? (() => { const e = timeline.split(" → ")[1]; try { return new Date(e).toISOString().split("T")[0]; } catch { return ""; } })() : ""}
                      onChange={e => {
                        const start = timeline.split(" → ")[0] ?? "";
                        const end = e.target.value ? new Date(e.target.value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
                        setTimeline(start && end ? `${start} → ${end}` : "");
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select className="input" value={currency} onChange={e => setCurrency(e.target.value)}>
                    {currencies.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Total Budget *</label>
                  <input className="input" type="number" min={100} value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label">Deposit %</label>
                  <select className="input" value={depositPercent}
                    onChange={e => setDepositPercent(Number(e.target.value))}>
                    {[25, 30, 40, 50, 60, 100].map(p => <option key={p}>{p}%</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Proposal Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {toneOptions.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value as "professional" | "friendly" | "bold")}
                      className={`rounded-xl border-2 px-3 py-3 text-center transition-all ${
                        tone === t.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">{t.label.split(" ")[0]}</div>
                      <div className={`text-xs font-semibold ${tone === t.value ? "text-brand-700" : "text-gray-700"}`}>
                        {t.label.split(" ").slice(1).join(" ")}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  {tone === "professional" && "\"We will deliver a comprehensive solution aligned with your business objectives…\""}
                  {tone === "friendly" && "\"I'd love to help you with this — here's exactly how I'll make it happen…\""}
                  {tone === "bold" && "\"This project will double your conversion rate. Here's the plan to make it happen…\""}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Freelancer details */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="label">Your Full Name *</label>
                <input className="input" placeholder="Alex Johnson" value={freelancerName}
                  onChange={e => setFreelancerName(e.target.value)} />
              </div>
              <div>
                <label className="label">Your Title *</label>
                <input className="input" placeholder="Senior UX Designer" value={freelancerTitle}
                  onChange={e => setFreelancerTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Your Email *</label>
                <input className="input" type="email" placeholder="alex@studio.com" value={freelancerEmail}
                  onChange={e => setFreelancerEmail(e.target.value)} />
              </div>
              <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 text-sm text-brand-800">
                <strong>Ready to generate!</strong> Claude Opus 4.6 will write your full proposal in seconds —
                tailored to {clientName || "your client"}'s exact needs and mirroring their language.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={back} className="btn-secondary">← Back</button>
            ) : (
              <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                disabled={
                  (step === 1 && (!projectType || !clientName)) ||
                  (step === 2 && !projectDescription) ||
                  (step === 3 && !deliverables) ||
                  (step === 4 && (!timeline || !totalBudget))
                }
                className="btn-primary"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!freelancerName || !freelancerEmail || !freelancerTitle}
                className="btn-primary"
              >
                ⚡ Generate Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
