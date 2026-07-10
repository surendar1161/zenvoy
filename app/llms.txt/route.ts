import { NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealpilot.co.in";

export async function GET() {
  const body = `# DealPilot

> AI proposal and contract software for freelancers. Generate proposals with Claude AI, collect e-signatures, send Stripe payment links, and manage clients in one place.

## Product

- Website: ${APP_URL}
- Pricing: ${APP_URL}/pricing
- Sign up (free): ${APP_URL}/sign-up

## Key pages

- AI Proposal Generator: ${APP_URL}/ai-proposal-generator
- Free Proposal Maker: ${APP_URL}/free-proposal-maker
- Proposal Software Comparison: ${APP_URL}/compare/proposal-software
- Blog: ${APP_URL}/blog

## Alternatives

- Proposify Alternative: ${APP_URL}/alternative/proposify
- PandaDoc Alternative: ${APP_URL}/alternative/pandadoc
- HoneyBook Alternative: ${APP_URL}/alternative/honeybook
- Bonsai Alternative: ${APP_URL}/alternative/bonsai

## Features

- E-signatures: ${APP_URL}/features/e-signatures
- AI Contracts: ${APP_URL}/features/contracts
- Client Portal: ${APP_URL}/features/client-portal
- Invoicing: ${APP_URL}/features/invoicing

## Plans

- Free: 5 proposals/month, 2 contracts/month
- Pro: $12/mo — unlimited proposals, e-signatures, analytics, client portals
- Business: $29/mo — everything in Pro + up to 5 team members

## Contact

Built for freelancers, consultants, designers, developers, and agencies.
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
