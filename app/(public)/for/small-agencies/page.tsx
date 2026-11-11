/**
 * /for/small-agencies: audience page for agencies of roughly two to five people (any discipline).
 *
 * Claims here must match what the product does today. Plan limits and prices come from lib/plans.ts;
 * the product areas named (projects, time tracking, invoices, capacity, client portals) are the dashboard
 * routes under app/(dashboard). Do not add customer counts, ratings or quotes.
 */
import Link from "next/link";
import LandingHero from "@/components/marketing/LandingHero";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";
import { getPlan } from "@/lib/plans";

const business = getPlan("business");

const STEPS = [
  {
    n: "1",
    title: "Brief to proposal",
    body: "Paste a client brief or a job post. The AI drafts a proposal and a contract. You edit every line before it goes out.",
  },
  {
    n: "2",
    title: "One link to sign and pay",
    body: "The client opens a web link, reads the proposal, signs (e-signature is on Pro) and pays a deposit through Stripe from the same page.",
  },
  {
    n: "3",
    title: "Run the project",
    body: "Projects, time tracking, invoices and a capacity page sit in the same account as your proposals and contracts.",
  },
  {
    n: "4",
    title: "Keep the client in the loop",
    body: "A client portal (on Pro) gives each client one link to their own area, instead of a thread of email attachments.",
  },
];

const TEAM_POINTS = [
  `Business plan: up to ${business.limits.teamMembers} team members for a flat $${business.monthlyPrice} a month`,
  "A content library of reusable sections, so the terms and scope wording you already trust are not retyped (Pro)",
  "Your own branding on proposals, and a custom domain for them on Business",
  "Start on the free plan with one account and upgrade when more people need access",
];

const FAQS = [
  {
    q: "What size of agency is DealPilot for?",
    a: `Freelancers and agencies of up to ${business.limits.teamMembers} people. The Business plan includes up to ${business.limits.teamMembers} team members. Beyond that, or if you need staffing by skill or revenue recognition, a professional-services platform will fit better.`,
  },
  {
    q: "Do clients need an account to sign a proposal?",
    a: "No. The client opens a web link. E-signature is a Pro feature, and a client can also accept a proposal without signing.",
  },
  {
    q: "Can my whole team use one account?",
    a: `Pro is for one user. Business adds up to ${business.limits.teamMembers} team members.`,
  },
  {
    q: "What does it cost?",
    a: `There is a free plan with ${getPlan("free").limits.proposals} proposals and ${getPlan("free").limits.contracts} contracts a month. Pro is $${getPlan("pro").monthlyPrice} a month ($${getPlan("pro").yearlyPrice} a month billed yearly) and Business is $${business.monthlyPrice} a month. Prices are in US dollars.`,
  },
];

export default function SmallAgenciesPage() {
  return (
    <>
      <LandingHero
        tag="For small agencies"
        title={<>From proposal to paid project, in one place</>}
        subtitle={`Send one link that your client reads, signs and pays through. Then run the project with time tracking, invoices and a client portal. Start free. The Business plan covers up to ${business.limits.teamMembers} team members.`}
        primaryCTA={{ text: "Start free", href: "/sign-up" }}
        secondaryCTA={{ text: "Compare plans", href: "/pricing" }}
        footnote={`Free plan: ${getPlan("free").limits.proposals} proposals and ${getPlan("free").limits.contracts} contracts a month`}
      />

      <section aria-label="How it works" className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[30px] font-extrabold text-ink sm:text-[36px]">Four steps, one account</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-3xl border border-line bg-white p-7 shadow-soft">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-[14px] font-extrabold text-brand-700">
                  {step.n}
                </span>
                <h3 className="mt-4 text-[20px] font-extrabold text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Working as a team" className="border-t border-line px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[28px] font-extrabold text-ink sm:text-[32px]">When there is more than one of you</h2>
          <ul className="mt-6 space-y-3 text-[16px] leading-relaxed text-ink-600">
            {TEAM_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Fit" className="border-t border-line px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-9">
          <h2 className="text-[24px] font-extrabold text-ink">Where it is not the right fit</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
            DealPilot has no skills matrix, SAML sign-in or revenue recognition, and the Business plan stops at {business.limits.teamMembers} team
            members. If you run larger delivery teams, read our{" "}
            <Link href="/alternative/rocketlane" className="font-semibold text-brand-700 underline">
              Rocketlane comparison
            </Link>
            . Working alone or in a niche?{" "}
            <Link href="/for/consultants" className="font-semibold text-brand-700 underline">
              Consultants
            </Link>
            ,{" "}
            <Link href="/for/marketing-agencies" className="font-semibold text-brand-700 underline">
              marketing agencies
            </Link>{" "}
            and{" "}
            <Link href="/generate/proposal" className="font-semibold text-brand-700 underline">
              proposal generators by niche
            </Link>{" "}
            have their own pages.
          </p>
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Small agency questions" />

      <CTASection
        title="Send your next proposal from DealPilot"
        subtitle="Start on the free plan with one account. Add team members on Business when you need them."
        buttonText="Create a free account"
        footnote="No credit card needed for the free plan"
      />
    </>
  );
}
