#!/usr/bin/env node
/**
 * Prints DealPilot directory-listing copy and optionally opens submit pages.
 * Does not log in, solve CAPTCHAs, or POST listings — those sites require a human.
 *
 *   node scripts/open-directory-listings.mjs
 *   node scripts/open-directory-listings.mjs --open
 */
import { exec } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Lightweight copy here so the script runs without a TS build step.
const COPY = {
  name: "DealPilot",
  website: "https://www.dealpilot.co.in",
  signup: "https://www.dealpilot.co.in/sign-up",
  tagline:
    "AI proposals, contracts, and invoices for freelancers — send a branded proposal in 60 seconds.",
  short:
    "DealPilot is AI proposal software for freelancers. Paste a brief, generate a scoped proposal with Claude, collect an e-signature, and attach a Stripe payment link.",
  long:
    "DealPilot helps independent designers, consultants, and other freelancers close client work without a 90-minute proposal ritual. Paste a job post or brief, generate a personalised proposal (scope, pricing tiers, timeline, terms), send a branded link, and collect e-signatures plus Stripe deposits in the same workspace. Free plan: 5 proposals/month. Pro from $12/month.",
};

const LISTINGS = [
  ["AlternativeTo", "https://alternativeto.net/manage/add-item/"],
  ["There's An AI For That", "https://theresanaiforthat.com/submit/"],
  ["Futurepedia", "https://www.futurepedia.io/submit-tool"],
  ["Toolify", "https://www.toolify.ai/submit"],
  ["Product Hunt", "https://www.producthunt.com/posts/new"],
  ["BetaList", "https://betalist.com/submit"],
  ["Uneed", "https://www.uneed.best/submit"],
  ["SaaSHub", "https://www.saashub.com/submit"],
  ["G2 (vendor)", "https://sell.g2.com/"],
  ["Capterra (vendor)", "https://www.capterra.com/vendors/"],
];

const openFlag = process.argv.includes("--open");

console.log("DealPilot listing copy (paste into each form)\n");
console.log(`Name:     ${COPY.name}`);
console.log(`Website:  ${COPY.website}`);
console.log(`Signup:   ${COPY.signup}?source=<directory>`);
console.log(`Tagline:  ${COPY.tagline}\n`);
console.log("Short description:\n");
console.log(COPY.short);
console.log("\nLong description:\n");
console.log(COPY.long);
console.log("\nSubmit URLs (account + CAPTCHA required):\n");
for (const [name, url] of LISTINGS) {
  console.log(`- ${name}: ${url}`);
}

if (!openFlag) {
  console.log("\nRe-run with --open to launch these URLs in your browser.");
  console.log(`Canonical copy also lives in ${join(root, "lib/directory-listings.ts")}`);
  process.exit(0);
}

const opener =
  process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";

for (const [, url] of LISTINGS) {
  exec(`${opener} "${url}"`);
}

console.log("\nOpened submit pages. Complete each form yourself.");
