/**
 * /alternative/rocketlane: an honest comparison for small teams.
 *
 * Every statement about Rocketlane comes from https://www.rocketlane.com/pricing and its home and
 * "why Rocketlane" pages, read on 2026-11-11. Do not add a Rocketlane claim without a source there.
 * Re-check the pricing row before editing it. An older G2 landing page quotes "$19/user/month", which
 * the current pricing page does not show, so that figure is deliberately not used.
 * DealPilot's own figures come from lib/plans.ts.
 */
import LandingHero from "@/components/marketing/LandingHero";
import ComparisonTable from "@/components/marketing/ComparisonTable";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";
import { getPlan } from "@/lib/plans";

const pro = getPlan("pro");
const business = getPlan("business");

const COMPARISON = [
  {
    name: "Built for",
    values: {
      Rocketlane: "Professional-services, onboarding and implementation teams, plus agencies and consultancies",
      DealPilot: "Freelancers and small agencies",
    },
  },
  {
    name: "How you buy",
    values: {
      Rocketlane: "Free trial or demo booking; its sign-up form asks for a business email address",
      DealPilot: "Self-serve sign-up with a free plan",
    },
  },
  {
    name: "Pricing model",
    values: {
      Rocketlane: "Per team member: Standard $49 and Premium $69 a month billed annually, each with a minimum of 5 team members (at least $245 a month on Standard). Enterprise is custom",
      DealPilot: `Free; Pro $${pro.monthlyPrice}/mo ($${pro.yearlyPrice}/mo billed yearly); Business $${business.monthlyPrice}/mo for up to ${business.limits.teamMembers} team members`,
    },
  },
  {
    name: "Capacity planning",
    values: {
      Rocketlane: "Capacity management and utilization tracking on Premium",
      DealPilot: "A capacity page in the dashboard",
    },
  },
  {
    name: "Skills matrix and SAML sign-in",
    values: { Rocketlane: "Listed on its Enterprise plan", DealPilot: "Not offered" },
  },
  {
    name: "SOC 2",
    values: { Rocketlane: "Listed on its pricing page", DealPilot: "Not claimed" },
  },
  {
    name: "Where the product starts",
    values: {
      Rocketlane: "Delivery: project plans, resourcing, time, financials, client collaboration",
      DealPilot: "The sale: AI proposal, contract, e-signature and payment link, then projects and a client portal",
    },
  },
];

const FAQS = [
  {
    q: "Is DealPilot a replacement for Rocketlane?",
    a: "Not for the teams Rocketlane is built for. Rocketlane describes itself as a platform for professional-services delivery, and its pricing page lists resource management, revenue recognition, a skills matrix and SAML sign-in. DealPilot is for a freelancer or a team of up to five who want to win the work, get it signed and paid, and run the project in one place.",
  },
  {
    q: "How much does Rocketlane cost?",
    a: "On 11 November 2026 Rocketlane's pricing page showed Standard at $49 and Premium at $69 per team member per month billed annually, each with a minimum of 5 team members, and Enterprise on custom pricing. Five team members on Standard comes to at least $245 a month. Check rocketlane.com/pricing for current numbers.",
  },
  {
    q: "How much does DealPilot cost?",
    a: `The Free plan costs nothing and includes ${getPlan("free").limits.proposals} proposals and ${getPlan("free").limits.contracts} contracts a month. Pro is $${pro.monthlyPrice} a month ($${pro.yearlyPrice} a month billed yearly). Business is $${business.monthlyPrice} a month for up to ${business.limits.teamMembers} team members. Prices are in US dollars.`,
  },
  {
    q: "Can I move my projects from Rocketlane?",
    a: "DealPilot has no importer for Rocketlane projects. You would start new projects in DealPilot and keep finished ones in Rocketlane.",
  },
  {
    q: "When should I stay with Rocketlane?",
    a: "Stay if you run onboarding or implementation projects with a larger delivery team, need staffing by skill, need SAML sign-in or SOC 2, or need revenue recognition. DealPilot does not offer a skills matrix, SAML sign-in, SOC 2 or revenue recognition.",
  },
];

const FIT = [
  {
    heading: "Pick Rocketlane if",
    tone: "border-line bg-white",
    points: [
      "You run customer onboarding or implementation with a delivery team",
      "You need staffing by skill, utilisation reporting or revenue recognition",
      "Your security review asks for SAML sign-in or SOC 2",
      "Per-seat pricing with a five-member minimum and a demo-led purchase suit you",
    ],
  },
  {
    heading: "Pick DealPilot if",
    tone: "border-brand-200 bg-brand-50/60",
    points: [
      "You are a freelancer or an agency of up to five people",
      "You want one tool from the first proposal to the paid invoice",
      "You want to start free and upgrade only when you need e-signatures or a client portal",
      "You prefer a flat plan price to paying per user",
    ],
  },
];

export default function RocketlaneAlternativePage() {
  return (
    <>
      <LandingHero
        tag="Rocketlane alternative"
        title={<>A Rocketlane alternative for freelancers and small agencies</>}
        subtitle="Rocketlane is a professional-services platform sold per user. If you are one to five people who need proposals, e-signatures, payments and a client portal, DealPilot is a self-serve option. Here is how they differ and who should pick which."
        primaryCTA={{ text: "Try DealPilot free", href: "/sign-up" }}
        secondaryCTA={{ text: "See how they differ", href: "#comparison" }}
        footnote="Rocketlane details come from its own public pages, read on 11 November 2026."
      />

      <section aria-label="Who each tool is for" className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {FIT.map((card) => (
            <div key={card.heading} className={`rounded-3xl border p-7 shadow-soft ${card.tone}`}>
              <h2 className="text-[22px] font-extrabold text-ink">{card.heading}</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-600">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="comparison" aria-label="Comparison" className="border-t border-line px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[30px] font-extrabold text-ink sm:text-[36px]">Rocketlane and DealPilot side by side</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[16px] text-ink-500">
            Only facts we can source are in this table. Plans and prices change, so check each vendor&apos;s own pricing page before you decide.
          </p>
          <div className="mt-10">
            <ComparisonTable
              competitors={[{ name: "Rocketlane" }, { name: "DealPilot", highlight: true }]}
              features={COMPARISON}
            />
          </div>
        </div>
      </section>

      <section aria-label="What DealPilot covers" className="border-t border-line px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[28px] font-extrabold text-ink sm:text-[32px]">What a small team gets in DealPilot</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-600">
            You paste a client brief or a job post and get an editable proposal and contract. Your client opens one link, reads it, and
            signs (e-signature is on Pro) and pays a deposit through Stripe from the same page. Behind that sit clients, projects,
            time tracking, invoices, a capacity page and client portals (portals are on Pro). It does not try to be a full
            professional-services automation suite.
          </p>
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Rocketlane or DealPilot: common questions" />

      <CTASection
        title="Start with the free plan"
        subtitle="Send your first proposal and see whether it fits how you work. Upgrade only if you need e-signatures or a client portal."
        buttonText="Create a free account"
        footnote="No credit card needed for the free plan"
      />
    </>
  );
}
