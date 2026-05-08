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

export default function HowToWriteAFreelanceProposal() {
  return (
    <BlogArticle
      tag="Guide"
      title="How to Write a Freelance Proposal That Wins"
      subtitle="A step-by-step guide to writing proposals that close deals — covering structure, tone, pricing, and the psychology behind why clients say yes."
      date="May 7, 2026"
      readTime="12 min read"
    >
      <p style={pStyle}>
        I spent my first two years as a freelancer losing projects I was perfectly qualified for. Not because my work
        was bad — it wasn&apos;t — but because my proposals were. They were generic, unfocused, and read like every
        other template the client had already dismissed. It took losing a $40,000 project to a competitor with half
        my experience before I finally tore the whole thing apart and rebuilt my proposal process from scratch.
      </p>
      <p style={pStyle}>
        This article is everything I learned. Whether you&apos;re a designer, developer, copywriter, or consultant,
        the principles are the same: a great proposal isn&apos;t about showing off — it&apos;s about showing the
        client you understand their problem better than anyone else in their inbox.
      </p>

      {/* Section 1 */}
      <h2 style={h2Style}>Why Your Proposal Matters More Than Your Portfolio</h2>
      <p style={pStyle}>
        Here&apos;s an uncomfortable truth: clients don&apos;t hire the most talented freelancer. They hire the
        freelancer who makes them feel the most confident. Your portfolio proves you <em>can</em> do the work.
        Your proposal proves you <em>will</em> do it — on time, on budget, and exactly the way they need it done.
      </p>
      <p style={pStyle}>
        Think about it from the client&apos;s side. They&apos;re reviewing five to fifteen proposals. Most are
        copy-pasted walls of text about the freelancer&apos;s experience, awards, and toolset. Then one proposal
        arrives that opens by describing the client&apos;s exact problem, breaks down a clear plan to solve it,
        and ends with a concrete next step. Who do you think gets the call?
      </p>
      <p style={pStyle}>
        A strong proposal does three things simultaneously: it demonstrates competence, reduces perceived risk,
        and creates urgency. Miss any one of those, and you&apos;re relying on luck.
      </p>
      <blockquote style={bqStyle}>
        <p style={{ ...pStyle, margin: 0 }}>
          &ldquo;The proposal is your first deliverable. If it&apos;s sloppy, late, or generic, the client will
          assume your actual work will be too.&rdquo;
        </p>
      </blockquote>

      {/* Section 2 */}
      <h2 style={h2Style}>The Anatomy of a Winning Proposal: 7 Essential Sections</h2>
      <p style={pStyle}>
        After analyzing hundreds of successful proposals — both my own and from freelancers I&apos;ve mentored —
        a clear pattern emerges. Every proposal that wins follows a structure that guides the client from
        &ldquo;I have a problem&rdquo; to &ldquo;This is the right person to solve it.&rdquo; Here are the seven
        sections you need.
      </p>

      <h3 style={h3Style}>1. Cover Page / Branding</h3>
      <p style={pStyle}>
        First impressions are formed in under three seconds. Your cover page should include your logo or name,
        the client&apos;s name, the project title, and the date. That&apos;s it. No paragraphs, no walls of text.
        Keep it clean, branded, and professional. If you&apos;re sending a PDF, make it look like something worth
        reading — not a Word document with Times New Roman.
      </p>
      <p style={pStyle}>
        Use your brand colors consistently. If you don&apos;t have brand guidelines, pick a primary color and a
        neutral palette and stick with them across every proposal. Consistency signals professionalism.
      </p>

      <h3 style={h3Style}>2. Executive Summary (Mirror the Client&apos;s Language)</h3>
      <p style={pStyle}>
        This is the most important section of your entire proposal, and most freelancers get it wrong. The executive
        summary is <strong>not</strong> about you. It&apos;s a one-paragraph summary of the client&apos;s situation,
        their goals, and how you plan to help them get there.
      </p>
      <p style={pStyle}>
        The secret weapon here is <strong>mirroring</strong>. Go back to the client&apos;s original brief, email,
        or conversation notes. Pull out the exact words and phrases they used to describe their problem. When a
        client reads their own language reflected back to them, they immediately feel understood — and that feeling
        is worth more than a decade of case studies.
      </p>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Pro tip:</strong>
        <span style={{ color: "#334155" }}>
          {" "}Start your executive summary with the client&apos;s name and their goal, not your name and your
          services. Instead of &ldquo;We are a full-service design agency...&rdquo; try &ldquo;Acme Corp needs
          a landing page that converts demo requests at 5% or higher — here&apos;s exactly how we&apos;ll make
          that happen.&rdquo;
        </span>
      </Card>

      <h3 style={h3Style}>3. Problem Statement (Show You Understand)</h3>
      <p style={pStyle}>
        Before you pitch your solution, prove you understand the problem. Dedicate two to four paragraphs
        to articulating the challenge the client is facing, the business impact of not solving it, and any
        constraints you&apos;ve identified (budget, timeline, technical limitations).
      </p>
      <p style={pStyle}>
        This section builds trust. When you can describe a problem more clearly than the client described it
        themselves, they assume you&apos;ve solved it before. Even if you haven&apos;t, the depth of your
        understanding signals expertise.
      </p>
      <p style={pStyle}>
        Don&apos;t be afraid to mention risks or challenges here. Clients are wary of freelancers who make
        everything sound easy. Acknowledging complexity — and showing you&apos;ve thought about how to handle
        it — is a massive trust signal.
      </p>

      <h3 style={h3Style}>4. Proposed Solution (Scope + Deliverables)</h3>
      <p style={pStyle}>
        Now you can talk about what you&apos;ll actually do. Break this into specific deliverables with clear
        descriptions. Avoid vague language like &ldquo;we&apos;ll optimize your website.&rdquo; Instead, spell
        out exactly what that means:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Audit of current homepage performance (heatmaps, analytics, conversion funnels)</li>
        <li style={liStyle}>Redesign of homepage layout with 3 variations for A/B testing</li>
        <li style={liStyle}>Implementation in Webflow with responsive breakpoints for mobile, tablet, and desktop</li>
        <li style={liStyle}>Two rounds of revisions based on your feedback</li>
        <li style={liStyle}>Post-launch monitoring for 14 days with a performance report</li>
      </ul>
      <p style={pStyle}>
        Specificity eliminates ambiguity. Ambiguity creates scope creep. Scope creep creates resentment — on
        both sides. List exactly what&apos;s included and, just as importantly, what&apos;s <em>not</em> included.
      </p>

      <h3 style={h3Style}>5. Timeline & Milestones</h3>
      <p style={pStyle}>
        Clients need to know when things will happen. Break the project into phases with specific milestones
        and delivery dates. Even a simple table works:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}><strong>Week 1-2:</strong> Discovery & research — kickoff call, stakeholder interviews, competitive audit</li>
        <li style={liStyle}><strong>Week 3-4:</strong> Design phase — wireframes, two design concepts, client review</li>
        <li style={liStyle}><strong>Week 5-6:</strong> Development — responsive build, CMS integration, QA testing</li>
        <li style={liStyle}><strong>Week 7:</strong> Launch — deployment, post-launch monitoring, handoff documentation</li>
      </ul>
      <p style={pStyle}>
        A timeline does two things: it shows you&apos;ve thought about the work in detail, and it gives the
        client something concrete to evaluate. If they need it faster, they&apos;ll tell you — and that opens
        a conversation about rush fees or scope reduction, not vague expectations.
      </p>

      <h3 style={h3Style}>6. Investment (Not &ldquo;Pricing&rdquo; — Frame as Value)</h3>
      <p style={pStyle}>
        Words matter. &ldquo;Pricing&rdquo; frames your work as a cost. &ldquo;Investment&rdquo; frames it as
        something that generates returns. This isn&apos;t semantic gymnastics — it genuinely changes how clients
        perceive your numbers.
      </p>
      <p style={pStyle}>
        Present your price clearly and confidently. Don&apos;t bury it on page 12 or hide it behind a
        &ldquo;contact us for pricing&rdquo; wall. Clients respect transparency. If you offer tiered pricing
        (and you should — more on this in our pricing guide), present it as Good / Better / Best options so
        the client has a choice rather than a yes-or-no decision.
      </p>
      <p style={pStyle}>
        Whenever possible, connect the price to the business outcome. &ldquo;Your investment of $8,500 will
        fund a complete homepage redesign projected to increase demo conversions by 40-60%, based on results
        from similar projects.&rdquo; That&apos;s infinitely more persuasive than a line item that just
        says &ldquo;Homepage redesign — $8,500.&rdquo;
      </p>

      <h3 style={h3Style}>7. Terms & Next Steps</h3>
      <p style={pStyle}>
        End with a clear call to action. Don&apos;t leave the client wondering what to do next. Spell it out:
      </p>
      <ol style={ulStyle}>
        <li style={liStyle}>Review this proposal and let me know if you have questions</li>
        <li style={liStyle}>If everything looks good, sign the attached agreement</li>
        <li style={liStyle}>50% deposit to secure your start date of [specific date]</li>
        <li style={liStyle}>We&apos;ll kick off with a 60-minute discovery call within 48 hours of deposit</li>
      </ol>
      <p style={pStyle}>
        Include your standard payment terms (Net 15, 50/50 split, milestone-based — whatever works for your
        business), a validity period (&ldquo;This proposal is valid for 14 days&rdquo;), and any relevant
        legal terms. Keep it concise. Nobody wants to read a five-page contract inside a proposal.
      </p>

      {/* Section 3 */}
      <h2 style={h2Style}>Tone: Professional vs Friendly vs Bold — When to Use Each</h2>
      <p style={pStyle}>
        Your proposal&apos;s tone should match two things: your personality and the client&apos;s culture.
        There&apos;s no single &ldquo;right&rdquo; tone, but there are guidelines.
      </p>
      <p style={pStyle}>
        <strong>Professional</strong> works best for enterprise clients, government contracts, and industries
        like finance, healthcare, or legal. Keep sentences structured, avoid slang, and lean on data.
        Use &ldquo;we recommend&rdquo; instead of &ldquo;I think.&rdquo;
      </p>
      <p style={pStyle}>
        <strong>Friendly</strong> is ideal for startups, small businesses, and creative projects. You can use
        contractions, first person, and a conversational rhythm. The goal is to sound like a trusted advisor,
        not a corporation. Most freelancers should default to this tone.
      </p>
      <p style={pStyle}>
        <strong>Bold</strong> works when you&apos;re confident, the client is looking for someone opinionated,
        and you want to stand out from a crowd of safe, generic proposals. Challenge assumptions. Make strong
        recommendations. Say &ldquo;Here&apos;s what I&apos;d do differently&rdquo; instead of &ldquo;Here are
        some options to consider.&rdquo; Use this carefully — it can backfire with conservative clients.
      </p>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Tone-matching tip:</strong>
        <span style={{ color: "#334155" }}>
          {" "}Read the client&apos;s original message or job post carefully. If they write with exclamation marks
          and emojis, a formal proposal will feel cold. If their brief is structured with bullet points and
          technical requirements, a casual tone will feel unprofessional. Mirror their energy.
        </span>
      </Card>

      {/* Section 4 */}
      <h2 style={h2Style}>Common Mistakes That Kill Proposals</h2>
      <p style={pStyle}>
        I&apos;ve reviewed hundreds of proposals from freelancers in my network. The same mistakes appear
        over and over. Avoid these and you&apos;re already ahead of 80% of the competition.
      </p>

      <h3 style={h3Style}>Using Generic Templates Without Customization</h3>
      <p style={pStyle}>
        Templates are fine as a starting point. Using them without customization is a death sentence. If your
        proposal reads like it could be sent to any client for any project, it will land in the trash. Every
        proposal needs at least three client-specific elements: their name and company throughout, a problem
        statement tailored to their situation, and deliverables written for their project — not a generic
        services list.
      </p>
      <p style={pStyle}>
        Tools like DealPilot can help here — they generate a personalized first draft based on the specific
        project details you provide, so you start with something tailored rather than something generic. But
        even an AI-generated draft should be reviewed and refined with your voice and expertise.
      </p>

      <h3 style={h3Style}>Talking About Yourself Too Much</h3>
      <p style={pStyle}>
        This is the most common mistake I see. Freelancers fill half the proposal with their bio, their awards,
        their process, their tools. Clients don&apos;t care about your process — they care about their results.
        For every sentence about yourself, ask: &ldquo;Does this help the client understand how I&apos;ll solve
        their problem?&rdquo; If not, cut it.
      </p>
      <p style={pStyle}>
        A good ratio: 70% about the client and their project, 20% about your approach and deliverables,
        10% about your background and qualifications. If you flip those numbers — and most freelancers
        do — your proposal becomes a brochure, not a business case.
      </p>

      <h3 style={h3Style}>Burying the Price</h3>
      <p style={pStyle}>
        Some freelancers hide pricing at the very end or leave it out entirely (&ldquo;Let&apos;s discuss
        pricing on a call&rdquo;). This backfires. Clients who can&apos;t find the price assume it&apos;s
        too high. Be transparent. Put your investment section where it&apos;s easy to find, and present it
        with confidence.
      </p>

      <h3 style={h3Style}>No Clear Call to Action</h3>
      <p style={pStyle}>
        If your proposal ends with &ldquo;Let me know what you think!&rdquo; you&apos;ve just handed the client
        an excuse to procrastinate. End with a specific next step: &ldquo;I&apos;ll follow up on Thursday.
        If you&apos;d like to move forward before then, just reply to this email and I&apos;ll send the
        agreement.&rdquo; Give them a clear path forward and a gentle deadline.
      </p>

      {/* Section 5 */}
      <h2 style={h2Style}>How Long Should a Proposal Be?</h2>
      <p style={pStyle}>
        The honest answer: as long as it needs to be and not a word longer. But here are practical guidelines
        based on project size:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong>Small projects ($500 - $3,000):</strong> 1-2 pages. Keep it tight. A brief summary,
          deliverables, timeline, price, and next steps. Anything more and you&apos;re over-engineering it.
        </li>
        <li style={liStyle}>
          <strong>Medium projects ($3,000 - $15,000):</strong> 3-5 pages. Include all seven sections above
          but keep each section concise. This is the sweet spot for most freelance work.
        </li>
        <li style={liStyle}>
          <strong>Large projects ($15,000+):</strong> 5-10 pages. These require more detail in the problem
          statement, solution, and timeline sections. You might also include case studies, team bios (if
          you&apos;re subcontracting), and a more detailed breakdown of phases.
        </li>
      </ul>
      <p style={pStyle}>
        The key principle: every page needs to earn its place. If a section doesn&apos;t help the client make a
        decision, it&apos;s just noise. DealPilot&apos;s AI-generated proposals typically hit the 3-5 page sweet
        spot because the algorithm focuses on what clients actually need to see — not padding.
      </p>

      {/* Section 6 */}
      <h2 style={h2Style}>The Follow-Up Strategy</h2>
      <p style={pStyle}>
        Writing a great proposal is only half the battle. What you do after you send it is just as important.
        Most freelancers send a proposal and then wait passively, checking their inbox every fifteen minutes
        like a nervous wreck. Don&apos;t be that person.
      </p>
      <p style={pStyle}>
        Build a follow-up plan into your proposal process. Here&apos;s the sequence that works:
      </p>
      <ol style={ulStyle}>
        <li style={liStyle}>
          <strong>Day 0 (Send day):</strong> Send the proposal with a brief, friendly email. Let them know
          you&apos;re available for questions and when you&apos;ll follow up.
        </li>
        <li style={liStyle}>
          <strong>Day 2-3:</strong> First follow-up. Short and specific: &ldquo;Just checking if you had a
          chance to review the proposal. Happy to jump on a quick call if anything needs clarification.&rdquo;
        </li>
        <li style={liStyle}>
          <strong>Day 7:</strong> Second follow-up. Add value: share a relevant case study, an article,
          or a quick idea you had since submitting.
        </li>
        <li style={liStyle}>
          <strong>Day 14:</strong> Final follow-up. Polite close: &ldquo;I know timing may not be right.
          No worries at all — I&apos;ll leave this with you and if the project comes back around, I&apos;d
          love to chat.&rdquo;
        </li>
      </ol>
      <p style={pStyle}>
        The follow-up is a deep enough topic that it deserves its own guide — check out our article
        on <a href="/blog/how-to-follow-up-on-a-proposal" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 600 }}>how to follow up on a proposal without being annoying</a> for
        the complete playbook.
      </p>

      {/* Section 7 */}
      <h2 style={h2Style}>Quick Summary: Your Proposal Checklist</h2>
      <p style={pStyle}>
        Before you hit send on your next proposal, run through this checklist:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Cover page with your branding and the client&apos;s name</li>
        <li style={liStyle}>Executive summary that mirrors the client&apos;s language and goals</li>
        <li style={liStyle}>Problem statement that proves you understand the challenge</li>
        <li style={liStyle}>Proposed solution with specific, numbered deliverables</li>
        <li style={liStyle}>Timeline with milestones and delivery dates</li>
        <li style={liStyle}>Investment section framed as value, not cost</li>
        <li style={liStyle}>Clear call to action with a specific next step</li>
        <li style={liStyle}>Tone matches the client&apos;s culture and communication style</li>
        <li style={liStyle}>Zero mentions of your awards or tools that don&apos;t serve the client</li>
        <li style={liStyle}>Price is visible and easy to find — not buried</li>
        <li style={liStyle}>Proposal has been proofread (typos kill credibility)</li>
        <li style={liStyle}>Follow-up dates are in your calendar</li>
      </ul>
      <Card style={tipCard} styles={{ body: { padding: 20 } }}>
        <strong style={{ color: "#1e40af" }}>Final thought:</strong>
        <span style={{ color: "#334155" }}>
          {" "}The best proposal you ever write is the one you improve after every send. Track which proposals
          win and which don&apos;t. Look for patterns. Ask clients who chose you what stood out. Ask clients
          who didn&apos;t choose you what was missing. Every proposal is a data point — use them. And if you
          want a head start, DealPilot can generate a polished first draft in about 60 seconds, giving you
          a strong foundation to customize with your expertise.
        </span>
      </Card>
    </BlogArticle>
  );
}