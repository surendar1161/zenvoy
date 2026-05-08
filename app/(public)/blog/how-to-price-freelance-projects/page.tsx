"use client";

import { Card } from "antd";
import BlogArticle from "@/components/marketing/BlogArticle";

const h2Style: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "48px 0 16px", letterSpacing: "-0.3px" };
const h3Style: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "32px 0 12px" };
const pStyle: React.CSSProperties = { fontSize: 16, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" };
const ulStyle: React.CSSProperties = { fontSize: 16, color: "#334155", lineHeight: 1.8, paddingLeft: 20, margin: "0 0 24px" };
const liStyle: React.CSSProperties = { margin: "0 0 10px" };
const bqStyle: React.CSSProperties = { borderLeft: "4px solid #0ea5e9", paddingLeft: 20, margin: "28px 0", fontStyle: "italic", color: "#475569" };
const tipCard: React.CSSProperties = { borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 28 };

export default function HowToPriceFreelanceProjects() {
  return (
    <BlogArticle
      tag="Pricing"
      title="How to Price Freelance Projects (Without Undercharging)"
      subtitle="The complete pricing guide for freelancers — hourly vs project-based, value pricing, rate calculators, and how to present pricing that clients respect."
      date="May 7, 2026"
      readTime="14 min read"
    >
      <p style={pStyle}>
        Pricing is the single hardest skill in freelancing, and it has nothing to do with math. The formulas are
        simple. What&apos;s hard is the psychology — the fear that you&apos;ll quote too high and lose the deal,
        the anxiety of not knowing what everyone else charges, and the nagging suspicion that you&apos;re leaving
        money on the table every single time you send a proposal.
      </p>
      <p style={pStyle}>
        I&apos;ve been on both sides of this. I&apos;ve undercharged so badly that I resented the project by week
        two. And I&apos;ve quoted numbers that made my palms sweat — only to have the client accept without
        blinking. Pricing isn&apos;t about finding the &ldquo;right&rdquo; number. It&apos;s about understanding
        what the work is worth, communicating that value clearly, and having the confidence to stand behind it.
      </p>
      <p style={pStyle}>
        This guide covers everything: the three pricing models, how to calculate your minimum rate, the psychology
        of tiered pricing, how to present numbers in a proposal, handling objections, and when to raise your rates.
        Bookmark it — you&apos;ll come back to it.
      </p>

      {/* Section 1 */}
      <h2 style={h2Style}>Why Most Freelancers Undercharge (and the Real Cost)</h2>
      <p style={pStyle}>
        Let&apos;s start with the uncomfortable question: are you undercharging? If you&apos;re reading this article,
        the answer is almost certainly yes. A 2024 survey by Payoneer found that 62% of freelancers believe they
        charge below market rate. And the ones who don&apos;t think they&apos;re undercharging? Many of them are too.
      </p>
      <p style={pStyle}>
        Undercharging happens for predictable reasons:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong>Imposter syndrome.</strong> You compare yourself to freelancers with more experience and
          assume you should charge less. But clients aren&apos;t paying for years of experience — they&apos;re
          paying for the outcome you deliver.
        </li>
        <li style={liStyle}>
          <strong>Fear of rejection.</strong> You&apos;d rather win a project at a low rate than risk losing it
          at a fair one. This creates a vicious cycle: low rates attract price-sensitive clients who are the
          hardest to work with, which burns you out, which makes you less productive, which makes you feel
          like you can&apos;t charge more.
        </li>
        <li style={liStyle}>
          <strong>No pricing system.</strong> Without a framework, you&apos;re guessing. And when you guess,
          you default to whatever feels &ldquo;safe&rdquo; — which is always too low.
        </li>
        <li style={liStyle}>
          <strong>Anchoring to employee salaries.</strong> You divide your old salary by 2,080 hours and call
          it your rate. But freelancers have overhead, taxes, insurance, unbillable hours, and no paid vacation.
          Your freelance rate needs to be 2-3x your employee hourly equivalent, minimum.
        </li>
      </ul>
      <p style={pStyle}>
        The real cost of undercharging isn&apos;t just less money in your account. It&apos;s working 50-hour weeks
        to earn what you could make in 30. It&apos;s taking on too many projects because each one pays too little.
        It&apos;s burnout. It&apos;s resenting your clients. And eventually, it&apos;s quitting freelancing entirely
        and going back to a job — not because freelancing doesn&apos;t work, but because your pricing didn&apos;t.
      </p>
      <blockquote style={bqStyle}>
        <p style={{ ...pStyle, margin: 0 }}>
          &ldquo;Undercharging doesn&apos;t make you more competitive. It makes you more exhausted.&rdquo;
        </p>
      </blockquote>

      {/* Section 2 */}
      <h2 style={h2Style}>Three Pricing Models: Which One Should You Use?</h2>
      <p style={pStyle}>
        Every freelance project can be priced using one of three models. Each has a place — but most freelancers
        default to hourly when they should be using project-based or value-based pricing. Let&apos;s break down
        all three.
      </p>

      <h3 style={h3Style}>Hourly Pricing</h3>
      <p style={pStyle}>
        <strong>How it works:</strong> You charge a fixed rate per hour worked. You track time, invoice for
        hours, and the client pays based on actual time spent.
      </p>
      <p style={pStyle}>
        <strong>When it works well:</strong>
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Ongoing retainer relationships where scope shifts week to week</li>
        <li style={liStyle}>Projects where the scope is genuinely undefined (R&D, exploration, audits)</li>
        <li style={liStyle}>Early client relationships where you&apos;re still learning their workflow</li>
        <li style={liStyle}>Consulting engagements where you&apos;re billing for access and advice</li>
      </ul>
      <p style={pStyle}>
        <strong>When it fails:</strong>
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          It punishes efficiency. The faster and better you get at your craft, the less you earn per project.
          A logo that takes a senior designer 4 hours would take a junior 20 hours — but the senior&apos;s
          logo is better. Hourly pricing makes the junior designer more &ldquo;profitable.&rdquo; That&apos;s
          backwards.
        </li>
        <li style={liStyle}>It creates adversarial dynamics. Clients watch the clock. You feel guilty about
          bathroom breaks. Nobody wins.
        </li>
        <li style={liStyle}>It caps your income. There are only so many hours in a day.</li>
      </ul>

      <h3 style={h3Style}>Project-Based Pricing</h3>
      <p style={pStyle}>
        <strong>How it works:</strong> You quote a fixed price for a defined scope of work. The client pays the
        same amount regardless of how long it takes you.
      </p>
      <p style={pStyle}>
        <strong>Why it&apos;s the sweet spot for most freelancers:</strong>
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          Clients love predictability. They know exactly what they&apos;re paying before work begins.
        </li>
        <li style={liStyle}>
          You&apos;re rewarded for efficiency. Finish in 20 hours instead of 40? You still earn the full
          project fee.
        </li>
        <li style={liStyle}>
          It shifts the conversation from &ldquo;how long will this take?&rdquo; to &ldquo;what will I
          get?&rdquo; — which is what clients actually care about.
        </li>
        <li style={liStyle}>
          It&apos;s easier to scale. You can systematize your process, build templates, and complete projects
          faster over time without earning less.
        </li>
      </ul>
      <p style={pStyle}>
        <strong>The catch:</strong> You need to be good at scoping. If you underestimate the work, you eat the
        difference. Protect yourself with a clear scope document, a defined number of revision rounds, and a
        change order process for anything outside the original scope.
      </p>

      <h3 style={h3Style}>Value-Based Pricing</h3>
      <p style={pStyle}>
        <strong>How it works:</strong> You price the project based on the value it creates for the client, not
        the time it takes you. A landing page that&apos;s expected to generate $500,000 in revenue is worth
        $25,000 — even if it takes you 30 hours to build.
      </p>
      <p style={pStyle}>
        <strong>When it&apos;s the right move:</strong>
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>The client has a clear, measurable business outcome (revenue, leads, conversions)</li>
        <li style={liStyle}>You have a track record of delivering results in this area</li>
        <li style={liStyle}>The project has high leverage — a small amount of work creates outsized value</li>
        <li style={liStyle}>The client is sophisticated enough to understand ROI-based pricing</li>
      </ul>
      <p style={pStyle}>
        Value-based pricing is the most profitable model, but it requires confidence, strong discovery skills,
        and the ability to quantify outcomes. If you&apos;re just starting out, begin with project-based pricing
        and graduate to value-based as you build case studies and confidence.
      </p>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Key question for value pricing:</strong>
        <span style={{ color: "#334155" }}>
          {" "}During your discovery call, ask: &ldquo;If this project goes perfectly, what&apos;s the business
          impact over the next 12 months?&rdquo; If the answer is &ldquo;$200,000 in new revenue,&rdquo; a
          $15,000 fee is a bargain. Frame your price as a percentage of the expected return.
        </span>
      </Card>

      {/* Section 3 */}
      <h2 style={h2Style}>How to Calculate Your Minimum Rate</h2>
      <p style={pStyle}>
        Before you can price any project, you need to know your floor — the minimum you can charge and still
        run a sustainable business. Here&apos;s the formula:
      </p>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af", fontSize: 17 }}>The Freelancer Rate Formula</strong>
        <p style={{ ...pStyle, margin: "12px 0 0", fontFamily: "monospace", fontSize: 15, color: "#1e293b" }}>
          (Annual Expenses + Desired Profit + Tax Reserve) / Annual Billable Hours = Minimum Hourly Rate
        </p>
      </Card>
      <p style={pStyle}>
        Let&apos;s walk through each variable:
      </p>
      <p style={pStyle}>
        <strong>Annual expenses</strong> include everything it costs to run your business and your life:
        rent, health insurance, software subscriptions, equipment, internet, coworking spaces, professional
        development, and retirement contributions. Don&apos;t forget the stuff that&apos;s easy to overlook —
        accounting software, liability insurance, professional memberships, and the occasional conference.
        For most solo freelancers in a major city, this number is between $50,000 and $90,000.
      </p>
      <p style={pStyle}>
        <strong>Desired profit</strong> is what you want to earn on top of expenses. This isn&apos;t
        &ldquo;nice to have&rdquo; money — it&apos;s your compensation for the risk and effort of running
        a business. Aim for at least 20-30% above your expenses.
      </p>
      <p style={pStyle}>
        <strong>Tax reserve</strong> varies by location, but a safe estimate for US freelancers is 25-35%
        of your gross income. Set this aside religiously. Quarterly tax surprises kill more freelance
        businesses than bad clients do.
      </p>
      <p style={pStyle}>
        <strong>Annual billable hours</strong> is the number most freelancers get wrong. A full-time
        employee works roughly 2,080 hours per year. But freelancers aren&apos;t billing every hour.
        You&apos;re spending time on marketing, sales, admin, invoicing, learning, and managing client
        relationships. Realistically, most freelancers bill 1,000 to 1,400 hours per year. Use 1,200 as
        a starting estimate.
      </p>
      <p style={pStyle}>
        <strong>Example calculation:</strong>
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Annual expenses: $70,000</li>
        <li style={liStyle}>Desired profit (25%): $17,500</li>
        <li style={liStyle}>Subtotal: $87,500</li>
        <li style={liStyle}>Tax reserve (30%): $26,250</li>
        <li style={liStyle}>Total needed: $113,750</li>
        <li style={liStyle}>Billable hours: 1,200</li>
        <li style={liStyle}><strong>Minimum hourly rate: $95/hour</strong></li>
      </ul>
      <p style={pStyle}>
        That&apos;s your floor, not your target. Your actual rate should be higher — this is just the minimum
        needed to keep the lights on, pay taxes, and earn a modest profit. For project pricing, estimate the
        hours a project will take, multiply by your hourly rate, then add a 15-20% buffer for scope creep
        and revisions.
      </p>

      {/* Section 4 */}
      <h2 style={h2Style}>The Good / Better / Best Pricing Strategy</h2>
      <p style={pStyle}>
        This is the single most effective pricing tactic I&apos;ve ever used, and it&apos;s backed by decades
        of behavioral economics research. Instead of presenting one price, offer three tiers:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong>Good (the essential package):</strong> Covers the core deliverables. This is the minimum
          viable version of the project. Price it at your baseline.
        </li>
        <li style={liStyle}>
          <strong>Better (the recommended package):</strong> Everything in Good, plus strategic additions that
          meaningfully improve the outcome. This is where you want most clients to land. Price it 40-60%
          above Good.
        </li>
        <li style={liStyle}>
          <strong>Best (the premium package):</strong> The full white-glove experience. Everything in Better,
          plus extras like priority support, additional deliverables, extended revisions, or post-launch
          maintenance. Price it 80-120% above Good.
        </li>
      </ul>
      <p style={pStyle}>
        Why this works: it leverages <strong>anchoring</strong>. The Best tier makes the Better tier look
        reasonable by comparison. The Good tier makes clients feel like they&apos;re getting a deal if they
        choose Better. Research consistently shows that when presented with three options, most people choose
        the middle one — which is exactly where you want them.
      </p>
      <p style={pStyle}>
        It also changes the client&apos;s decision from &ldquo;Should I hire this freelancer?&rdquo; to
        &ldquo;Which package should I choose?&rdquo; That&apos;s a fundamentally different psychological
        frame — and it works in your favor.
      </p>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Example for a website redesign:</strong>
        <ul style={{ ...ulStyle, margin: "10px 0 0" }}>
          <li style={liStyle}><strong>Good ($6,000):</strong> Homepage redesign, mobile-responsive, 2 revision rounds</li>
          <li style={liStyle}><strong>Better ($9,500):</strong> Homepage + 4 inner pages, CMS setup, SEO optimization, 3 revision rounds</li>
          <li style={liStyle}><strong>Best ($15,000):</strong> Full site (up to 10 pages), CMS, SEO, copywriting, 60 days post-launch support</li>
        </ul>
      </Card>

      {/* Section 5 */}
      <h2 style={h2Style}>How to Present Pricing in Your Proposal</h2>
      <p style={pStyle}>
        Pricing presentation is just as important as the number itself. Two freelancers can quote the exact
        same price — $10,000 — and get completely different reactions based on how they present it. Here are
        the rules:
      </p>

      <h3 style={h3Style}>Don&apos;t Bury It</h3>
      <p style={pStyle}>
        Put pricing in its own clearly labeled section. Don&apos;t make the client hunt for it. If they have
        to scroll through 8 pages of your process description to find the number, they&apos;ll be annoyed
        before they even see it. When you use DealPilot to generate a proposal, the investment section is
        always positioned prominently with clear formatting — because burying the price is the fastest way
        to lose a client&apos;s trust.
      </p>

      <h3 style={h3Style}>Frame It as Investment, Not Cost</h3>
      <p style={pStyle}>
        Use the word &ldquo;investment&rdquo; instead of &ldquo;price,&rdquo; &ldquo;cost,&rdquo; or
        &ldquo;fee.&rdquo; Call the section &ldquo;Your Investment&rdquo; or &ldquo;Project Investment,&rdquo;
        not &ldquo;Pricing&rdquo; or &ldquo;Quote.&rdquo; This isn&apos;t manipulative — it&apos;s accurate.
        The client is investing in a business outcome, not purchasing a commodity.
      </p>

      <h3 style={h3Style}>Show ROI Whenever Possible</h3>
      <p style={pStyle}>
        If you can connect your price to a measurable business outcome, do it. &ldquo;Your investment of
        $12,000 will fund an e-commerce redesign projected to increase average order value by 15-20%.
        Based on your current revenue of $80,000/month, that represents $144,000-$192,000 in additional
        annual revenue.&rdquo; Now $12,000 looks like a steal.
      </p>

      <h3 style={h3Style}>Include Payment Terms Upfront</h3>
      <p style={pStyle}>
        Don&apos;t make the client guess how payment works. Clearly state your terms:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>50% deposit before work begins, 50% on completion</li>
        <li style={liStyle}>Three milestone payments: 40% / 30% / 30%</li>
        <li style={liStyle}>Net 15 payment terms on all invoices</li>
        <li style={liStyle}>Accepted payment methods (bank transfer, credit card, PayPal)</li>
      </ul>
      <p style={pStyle}>
        Payment terms that are clear and simple make you look professional and make the client feel secure.
        Ambiguity in payment terms is a red flag from both directions.
      </p>

      {/* Section 6 */}
      <h2 style={h2Style}>Handling &ldquo;That&apos;s Too Expensive&rdquo; Objections</h2>
      <p style={pStyle}>
        Every freelancer hears this at some point. How you respond determines whether you lose the deal,
        discount your way into resentment, or win the project at your full rate. Here&apos;s the framework:
      </p>

      <h3 style={h3Style}>1. Don&apos;t Panic</h3>
      <p style={pStyle}>
        &ldquo;That&apos;s more than we expected&rdquo; is not the same as &ldquo;No.&rdquo; Often, it&apos;s
        the client processing the number out loud. Give them space. Don&apos;t immediately offer a discount.
        Silence is your friend here.
      </p>

      <h3 style={h3Style}>2. Ask, Don&apos;t Assume</h3>
      <p style={pStyle}>
        Respond with a question: &ldquo;I appreciate the transparency. Can you share what range you had in
        mind?&rdquo; or &ldquo;Which part of the scope feels most important to you?&rdquo; This gives you
        information to work with. Sometimes the gap is $500. Sometimes it&apos;s $15,000. You need to know
        before you respond.
      </p>

      <h3 style={h3Style}>3. Adjust Scope, Not Rate</h3>
      <p style={pStyle}>
        If the client genuinely can&apos;t afford your full proposal, don&apos;t drop your rate — reduce
        the scope. &ldquo;I can absolutely work within your budget. At $5,000 instead of $9,500, we&apos;d
        focus on the homepage redesign and mobile optimization, and table the inner pages for a future phase.&rdquo;
        This maintains your rate integrity while giving the client a path forward.
      </p>

      <h3 style={h3Style}>4. Reframe the Value</h3>
      <p style={pStyle}>
        Sometimes the client needs help seeing the ROI. &ldquo;I understand $12,000 is a significant
        investment. Let me share some context: our last client with a similar project saw a 35% increase
        in qualified leads within 90 days. At their average deal size, that was over $200,000 in new
        pipeline. The redesign paid for itself in the first month.&rdquo;
      </p>

      <h3 style={h3Style}>5. Know When to Walk Away</h3>
      <p style={pStyle}>
        Not every client is your client. If someone&apos;s budget is $2,000 and your minimum is $8,000,
        no amount of negotiation will bridge that gap. Be gracious: &ldquo;It sounds like we might not be
        the right fit budget-wise for this project. I&apos;d be happy to recommend some talented freelancers
        who work at a different price point.&rdquo; Referrals build goodwill, and they often come back when
        their budget grows.
      </p>
      <blockquote style={bqStyle}>
        <p style={{ ...pStyle, margin: 0 }}>
          &ldquo;The goal isn&apos;t to win every project. It&apos;s to win the right projects at rates
          that let you do your best work.&rdquo;
        </p>
      </blockquote>

      {/* Section 7 */}
      <h2 style={h2Style}>When to Raise Your Rates</h2>
      <p style={pStyle}>
        If you&apos;re winning more than 70% of the proposals you send, your rates are too low. That might
        sound counterintuitive — don&apos;t you want to win everything? No. A healthy win rate for freelancers
        is 30-50%. If nearly everyone says yes, it means nearly everyone thinks you&apos;re a bargain.
      </p>
      <p style={pStyle}>
        Here are clear signals that it&apos;s time to raise your rates:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>You&apos;re consistently booked 6-8 weeks out with no availability gaps</li>
        <li style={liStyle}>Clients accept your proposals without negotiating</li>
        <li style={liStyle}>You&apos;re turning down work because you&apos;re too busy</li>
        <li style={liStyle}>Your skills have meaningfully improved (new tools, certifications, case studies)</li>
        <li style={liStyle}>Your results have improved (better outcomes, faster delivery, more strategic work)</li>
        <li style={liStyle}>It&apos;s been more than 12 months since your last rate increase</li>
        <li style={liStyle}>Comparable freelancers in your market are charging more</li>
      </ul>
      <p style={pStyle}>
        <strong>How much to raise:</strong> 10-20% is a comfortable annual increase. If you haven&apos;t raised
        rates in years, you might need a 30-50% correction to reach market rate. Don&apos;t boil the frog —
        implement it for new clients immediately and give existing clients 30-60 days&apos; notice.
      </p>
      <p style={pStyle}>
        <strong>How to communicate it:</strong> Keep it simple and confident. &ldquo;Starting January 1, my
        project rates will increase by 15% to reflect the expanded scope of services and results I now deliver.
        Current projects will be honored at existing rates. I&apos;m happy to discuss how this affects our
        ongoing work.&rdquo; No apologies. No lengthy justifications. The best clients understand that quality
        costs more over time.
      </p>

      {/* Section 8 */}
      <h2 style={h2Style}>Quick Reference: Average Rates by Profession</h2>
      <p style={pStyle}>
        These ranges are based on 2025-2026 data from Upwork, Toptal, and independent surveys. They represent
        experienced freelancers in the US market (adjust 20-40% lower for other regions). Use these as context,
        not gospel — your rate should be based on your calculation above, not someone else&apos;s average.
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong>Web Development:</strong> $75 - $200/hr | $3,000 - $50,000+ per project
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for React/Next.js, full-stack, e-commerce, and enterprise work</span>
        </li>
        <li style={liStyle}>
          <strong>UI/UX Design:</strong> $65 - $175/hr | $2,500 - $30,000+ per project
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for product design, design systems, and user research</span>
        </li>
        <li style={liStyle}>
          <strong>Copywriting:</strong> $50 - $150/hr | $500 - $15,000+ per project
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for conversion copy, brand strategy, and long-form content</span>
        </li>
        <li style={liStyle}>
          <strong>Business Consulting:</strong> $100 - $300/hr | $5,000 - $50,000+ per engagement
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for strategy, M&amp;A advisory, and executive coaching</span>
        </li>
        <li style={liStyle}>
          <strong>SEO / Digital Marketing:</strong> $75 - $200/hr | $2,000 - $20,000+/month retainer
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for technical SEO, enterprise campaigns, and performance marketing</span>
        </li>
        <li style={liStyle}>
          <strong>Video Production:</strong> $75 - $250/hr | $1,500 - $25,000+ per video
          <br /><span style={{ fontSize: 14, color: "#64748b" }}>Higher end for commercial work, animation, and post-production</span>
        </li>
      </ul>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Important:</strong>
        <span style={{ color: "#334155" }}>
          {" "}These are averages, and averages hide enormous variation. A WordPress site builder and a
          senior React architect are both &ldquo;web developers,&rdquo; but their rates (and value) are
          worlds apart. Position yourself based on the specific outcomes you deliver, not a generic job title.
        </span>
      </Card>

      {/* Final section */}
      <h2 style={h2Style}>Putting It All Together</h2>
      <p style={pStyle}>
        Pricing isn&apos;t a one-time decision — it&apos;s an evolving practice. Here&apos;s the system that works:
      </p>
      <ol style={ulStyle}>
        <li style={liStyle}>
          Calculate your minimum rate using the formula above. This is your floor — never go below it.
        </li>
        <li style={liStyle}>
          Default to project-based pricing. Estimate hours, multiply by your rate, add a 15-20% buffer.
        </li>
        <li style={liStyle}>
          Present three tiers (Good / Better / Best) in every proposal. Let the client choose their investment level.
        </li>
        <li style={liStyle}>
          Frame pricing as investment, show ROI when possible, and make payment terms crystal clear.
        </li>
        <li style={liStyle}>
          Handle objections by adjusting scope, not rate. Protect your rate integrity above all else.
        </li>
        <li style={liStyle}>
          Raise rates annually — or sooner if your win rate exceeds 70%.
        </li>
        <li style={liStyle}>
          Track your proposals and win rates. DealPilot makes this easy by keeping all your proposals organized
          and letting you see which pricing approaches close deals — so you can iterate on what actually works
          instead of guessing.
        </li>
      </ol>
      <p style={pStyle}>
        The freelancers who earn the most aren&apos;t necessarily the most skilled. They&apos;re the ones who
        understand value, communicate it clearly, and have the confidence to charge what they&apos;re worth.
        Pricing is a skill, and like any skill, it gets better with practice.
      </p>
      <p style={pStyle}>
        Next up: learn how to put these pricing strategies into action with our guide
        on <a href="/blog/how-to-write-a-freelance-proposal" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 600 }}>writing proposals that win</a>. Because
        even the best price falls flat if the rest of your proposal doesn&apos;t back it up.
      </p>
    </BlogArticle>
  );
}