export type ContractCategory =
  | "Employment"
  | "Confidentiality"
  | "Services"
  | "Commerce"
  | "Business"
  | "Property"
  | "Finance"
  | "Legal Waiver";

export interface ContractField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date" | "toggle";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
}

export interface ContractType {
  id: string;
  name: string;
  category: ContractCategory;
  badge?: "Hot" | "New";
  description: string;
  features: string[];
  legalNotes: string[];     // warnings & auto-applied rules shown in UI
  icon: string;
  fields: ContractField[];  // contract-specific form fields beyond party/jurisdiction
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Washington D.C.",
];
export { US_STATES };

export const CONTRACT_TYPES: ContractType[] = [
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    category: "Confidentiality",
    badge: "Hot",
    description: "Mutual or one-way NDA with automatic DTSA whistleblower notice (federal law), trade secret definition, and return-of-materials clause.",
    icon: "🔒",
    features: ["Mutual or one-way NDA", "DTSA whistleblower notice auto-added", "Trade secret definition", "Return-of-materials clause", "Customisable duration"],
    legalNotes: ["DTSA (Defend Trade Secrets Act) notice is required by federal law and will be auto-included.", "Duration over 5 years may be unenforceable in some states."],
    fields: [
      { key: "ndaType",          label: "NDA Type",                  type: "select",   options: ["Mutual (both parties)", "One-way (Disclosing → Receiving)"], required: true },
      { key: "confidentialInfo", label: "Confidential Information",  type: "textarea", placeholder: "Describe what is considered confidential (e.g. business plans, source code, customer lists)…", required: true },
      { key: "duration",         label: "Duration (years)",          type: "number",   placeholder: "3", required: true, hint: "Typically 2–5 years" },
      { key: "purpose",          label: "Purpose of Disclosure",     type: "textarea", placeholder: "e.g. Evaluating a potential business partnership", required: true },
      { key: "exclusions",       label: "Exclusions",                type: "textarea", placeholder: "e.g. Information already in the public domain, independently developed…" },
      { key: "returnMaterials",  label: "Return of Materials",       type: "toggle",   placeholder: "Require return/destruction of materials on termination" },
    ],
  },
  {
    id: "independent-contractor",
    name: "Independent Contractor Agreement",
    category: "Employment",
    badge: "Hot",
    description: "Covers scope of work, IP assignment, payment terms, and non-compete enforceability checks by US state. Auto-warns for California, Montana, and North Dakota where non-competes are void.",
    icon: "🤝",
    features: ["FLSA independent contractor classification note", "State non-compete enforceability check", "IP assignment clause", "Payment structure (hourly/fixed/milestone)", "Termination provisions"],
    legalNotes: ["Non-compete clauses are void in California, Montana, and North Dakota. The AI will flag and omit them automatically for those states.", "FLSA classification criteria will be noted to distinguish contractor from employee."],
    fields: [
      { key: "scopeOfWork",   label: "Scope of Work",          type: "textarea", placeholder: "Describe services the contractor will perform…", required: true },
      { key: "paymentType",   label: "Payment Structure",      type: "select",   options: ["Fixed fee", "Hourly rate", "Milestone-based"], required: true },
      { key: "rate",          label: "Rate / Total Amount ($)",type: "number",   required: true },
      { key: "startDate",     label: "Start Date",             type: "date",     required: true },
      { key: "endDate",       label: "End Date (or Ongoing)",  type: "text",     placeholder: "e.g. 31 December 2025, or Ongoing" },
      { key: "nonCompete",    label: "Non-Compete Clause",     type: "toggle" },
      { key: "nonCompeteMo",  label: "Non-Compete Duration (months)", type: "number", placeholder: "12", hint: "Typical range: 6–24 months" },
      { key: "ipAssignment",  label: "IP / Work for Hire",     type: "toggle",   hint: "All work product assigned to client" },
      { key: "expenses",      label: "Expense Reimbursement",  type: "textarea", placeholder: "e.g. Pre-approved expenses reimbursed within 30 days with receipts" },
    ],
  },
  {
    id: "employment-contract",
    name: "Employment Contract",
    category: "Employment",
    description: "Full employment agreement with at-will vs fixed-term logic, equity vesting schedules, benefits, and state-specific non-compete rules.",
    icon: "💼",
    features: ["At-will vs fixed-term logic", "State non-compete enforceability check", "Equity / stock option vesting schedule", "Benefits summary", "FLSA compliance note"],
    legalNotes: ["At-will employment is the default in most US states. Fixed-term contracts require termination-for-cause provisions.", "California prohibits non-compete agreements for employees. Montana requires good cause for termination."],
    fields: [
      { key: "position",      label: "Job Title / Position",   type: "text",     required: true },
      { key: "department",    label: "Department",             type: "text" },
      { key: "employmentType",label: "Employment Type",        type: "select",   options: ["At-will", "Fixed-term"], required: true },
      { key: "startDate",     label: "Start Date",             type: "date",     required: true },
      { key: "endDate",       label: "End Date (fixed-term only)", type: "date" },
      { key: "salary",        label: "Annual Salary ($)",      type: "number",   required: true },
      { key: "payFrequency",  label: "Pay Frequency",          type: "select",   options: ["Weekly","Bi-weekly","Semi-monthly","Monthly"] },
      { key: "benefits",      label: "Benefits",               type: "textarea", placeholder: "e.g. Health insurance, 401(k) with 4% match, 15 days PTO…" },
      { key: "equity",        label: "Equity / Stock Options", type: "textarea", placeholder: "e.g. 10,000 options at $0.50 strike, 4-year vest with 1-year cliff" },
      { key: "nonCompete",    label: "Non-Compete Clause",     type: "toggle" },
      { key: "nonCompeteMo",  label: "Non-Compete Duration (months)", type: "number", placeholder: "12" },
    ],
  },
  {
    id: "offer-letter",
    name: "Employment Offer Letter",
    category: "Employment",
    description: "Concise, professional offer letter with compensation, contingencies, and start date. Not a full contract — creates good faith expectation only.",
    icon: "📨",
    features: ["Compensation & benefits summary", "Contingencies (background check, reference, I-9)", "At-will disclaimer", "Offer expiry date"],
    legalNotes: ["An offer letter is not a binding employment contract in most states. At-will disclaimer recommended to avoid implied contract claims."],
    fields: [
      { key: "position",      label: "Position Title",         type: "text",     required: true },
      { key: "startDate",     label: "Proposed Start Date",    type: "date",     required: true },
      { key: "salary",        label: "Annual Salary ($)",      type: "number",   required: true },
      { key: "benefits",      label: "Benefits Summary",       type: "textarea", placeholder: "e.g. Health, dental, vision, 401(k), PTO…" },
      { key: "contingencies", label: "Contingencies",          type: "textarea", placeholder: "e.g. Background check, reference check, proof of work authorisation" },
      { key: "expiryDate",    label: "Offer Expiry Date",      type: "date",     hint: "Typically 5–10 business days" },
      { key: "reportingTo",   label: "Reports To",             type: "text" },
    ],
  },
  {
    id: "sla",
    name: "Service-Level Agreement (SLA)",
    category: "Services",
    description: "SLA with configurable uptime guarantees, response time SLOs, penalty calculations, and escalation matrices. Outputs a ready-to-attach exhibit for an MSA.",
    icon: "📊",
    features: ["Uptime % target (99.9% / 99.99%)", "Response & resolution time SLOs", "Penalty / credit auto-calculation", "Escalation matrix", "MSA-ready exhibit format"],
    legalNotes: ["Penalties/service credits should not exceed the monthly fee paid — courts often void penalty clauses that are disproportionate."],
    fields: [
      { key: "serviceDesc",   label: "Service Description",    type: "textarea", required: true, placeholder: "Describe the service covered by this SLA…" },
      { key: "uptime",        label: "Uptime Guarantee (%)",   type: "select",   options: ["99.0% (~87.6h downtime/yr)","99.5% (~43.8h)","99.9% (~8.7h)","99.95% (~4.4h)","99.99% (~52min)","99.999% (~5min)"], required: true },
      { key: "measurePeriod", label: "Measurement Period",     type: "select",   options: ["Monthly","Quarterly","Annually"] },
      { key: "responseTime",  label: "Initial Response Time",  type: "select",   options: ["15 minutes","30 minutes","1 hour","4 hours","8 hours","Next business day"] },
      { key: "resolutionP1",  label: "P1 Resolution Time",     type: "select",   options: ["1 hour","4 hours","8 hours","24 hours"] },
      { key: "penaltyType",   label: "Penalty / Credit Type",  type: "select",   options: ["Service credit (% of monthly fee)","Fixed dollar credit","Pro-rated refund","No penalty"] },
      { key: "penaltyPct",    label: "Penalty % (of monthly fee)", type: "number", placeholder: "10" },
      { key: "escalation",    label: "Escalation Matrix",      type: "textarea", placeholder: "e.g. L1: Support Engineer → L2: Senior Engineer (2h) → L3: Director of Engineering (4h)" },
      { key: "exclusions",    label: "Exclusions from SLA",    type: "textarea", placeholder: "e.g. Scheduled maintenance, force majeure, client-caused outages" },
    ],
  },
  {
    id: "retainer",
    name: "Retainer Agreement",
    category: "Services",
    description: "Monthly retainer for ongoing services with scope definitions, overage billing, termination notice, and optional unused-hours rollover.",
    icon: "🔄",
    features: ["Monthly retainer amount", "Scope of services included", "Overage rate", "Unused hours rollover option", "Termination notice period"],
    legalNotes: ["Retainer agreements should clearly define what is included to avoid scope disputes. Specify whether unused hours roll over or are forfeited."],
    fields: [
      { key: "services",      label: "Services Included",      type: "textarea", required: true, placeholder: "e.g. Up to 20 hours/month of design and development work…" },
      { key: "monthlyFee",    label: "Monthly Retainer ($)",   type: "number",   required: true },
      { key: "hoursIncluded", label: "Hours Included/Month",   type: "number",   placeholder: "20" },
      { key: "overageRate",   label: "Overage Hourly Rate ($)",type: "number",   placeholder: "150" },
      { key: "rollover",      label: "Unused Hours Roll Over", type: "toggle" },
      { key: "terminationDays",label: "Termination Notice (days)",type: "number", placeholder: "30", required: true },
      { key: "invoiceDay",    label: "Invoice Day",            type: "select",   options: ["1st of month","15th of month","Last day of month","Net 30 from invoice"] },
    ],
  },
  {
    id: "sales-agreement",
    name: "Sales Agreement",
    category: "Commerce",
    description: "Sales agreement with UCC Article 2 auto-applied for goods. Platform detects goods vs services and applies the correct legal framework automatically.",
    icon: "🛒",
    features: ["UCC Article 2 auto-detection (goods)", "Price & payment terms", "Delivery terms (FOB/CIF/DAP)", "Warranty provisions", "Risk of loss clause"],
    legalNotes: ["UCC Article 2 governs contracts for the sale of goods. Service contracts are governed by common law. This AI detects which applies based on your description.", "FOB Destination means seller bears risk until delivery; FOB Shipping Point transfers risk at shipment."],
    fields: [
      { key: "goods",         label: "Goods / Products",       type: "textarea", required: true, placeholder: "Describe the goods being sold (quantity, specification, part numbers…)" },
      { key: "totalPrice",    label: "Total Price ($)",        type: "number",   required: true },
      { key: "paymentTerms",  label: "Payment Terms",          type: "select",   options: ["Payment in full upfront","50% deposit, balance on delivery","Net 30","Net 60","COD"] },
      { key: "deliveryTerms", label: "Delivery Terms",         type: "select",   options: ["FOB Destination","FOB Shipping Point","CIF (Cost Insurance Freight)","DDP (Delivered Duty Paid)","Ex Works"] },
      { key: "deliveryDate",  label: "Delivery Date",          type: "date" },
      { key: "warranty",      label: "Warranty",               type: "textarea", placeholder: "e.g. 12-month warranty against defects in materials and workmanship" },
      { key: "returnPolicy",  label: "Return Policy",          type: "textarea", placeholder: "e.g. Returns accepted within 30 days in original condition" },
    ],
  },
  {
    id: "purchase-order",
    name: "Purchase Order Form",
    category: "Commerce",
    description: "Formal purchase order with line-item pricing, shipping details, payment terms, and vendor acceptance clause.",
    icon: "📋",
    features: ["Line-item pricing table", "Shipping address & method", "Payment terms", "Vendor acceptance clause", "PO number tracking"],
    legalNotes: ["A signed purchase order becomes a binding contract. Vendor acknowledgment clause prevents 'battle of the forms' disputes under UCC 2-207."],
    fields: [
      { key: "poNumber",      label: "PO Number",              type: "text",     required: true, placeholder: "e.g. PO-2025-001" },
      { key: "items",         label: "Line Items",             type: "textarea", required: true, placeholder: "Item | Qty | Unit Price | Total\ne.g.\nLaptop Dell XPS 15 | 5 | $1,800 | $9,000\nDocking Station | 5 | $200 | $1,000" },
      { key: "shippingAddr",  label: "Shipping Address",       type: "textarea", required: true },
      { key: "shippingMethod",label: "Shipping Method",        type: "select",   options: ["Standard ground","2-day express","Next day air","Freight","Pickup"] },
      { key: "paymentTerms",  label: "Payment Terms",          type: "select",   options: ["Net 30","Net 60","Net 90","Payment on delivery","Prepaid"] },
      { key: "requiredBy",    label: "Required By Date",       type: "date" },
      { key: "notes",         label: "Special Instructions",   type: "textarea" },
    ],
  },
  {
    id: "distribution",
    name: "Distribution Agreement",
    category: "Commerce",
    description: "Distribution agreement covering territory, exclusivity, minimum purchase requirements, and term.",
    icon: "🌐",
    features: ["Territory definition", "Exclusive or non-exclusive", "Minimum purchase requirements", "Pricing & discount structure", "Termination for cause"],
    legalNotes: ["Exclusive distribution agreements may trigger antitrust scrutiny if the distributor has significant market power. Non-compete restrictions in distribution agreements are subject to Rule of Reason analysis."],
    fields: [
      { key: "products",      label: "Products / Product Lines",  type: "textarea", required: true },
      { key: "territory",     label: "Territory",                 type: "textarea", required: true, placeholder: "e.g. United States, Canada, and Mexico" },
      { key: "exclusivity",   label: "Exclusivity",               type: "select",   options: ["Exclusive","Non-exclusive","Sole (no other distributor, but supplier can self-sell)"] },
      { key: "minPurchase",   label: "Minimum Annual Purchase ($)",type: "number",  placeholder: "50000" },
      { key: "discount",      label: "Distributor Discount (%)",  type: "number",   placeholder: "30", hint: "Discount off MSRP" },
      { key: "termYears",     label: "Initial Term (years)",      type: "number",   placeholder: "2" },
      { key: "autoRenew",     label: "Auto-Renew",                type: "toggle" },
    ],
  },
  {
    id: "partnership",
    name: "Partnership Agreement",
    category: "Business",
    description: "General or limited partnership agreement covering profit-split, capital contributions, management, buy-sell provisions, and dissolution terms.",
    icon: "🏢",
    features: ["Profit & loss split", "Capital contributions", "Management & voting rights", "Buy-sell / right of first refusal", "Dissolution & wind-down terms"],
    legalNotes: ["FTC Franchise Rule does NOT apply to standard partnerships. However, if partners receive a franchise-like fee + business assistance, FTC rule may be triggered.", "Buy-sell provisions (shotgun clauses) should specify valuation methodology to avoid disputes."],
    fields: [
      { key: "partnershipType",label: "Partnership Type",         type: "select",   options: ["General Partnership (GP)","Limited Partnership (LP)","Limited Liability Partnership (LLP)"], required: true },
      { key: "businessPurpose",label: "Business Purpose",        type: "textarea", required: true },
      { key: "contributions",  label: "Capital Contributions",   type: "textarea", required: true, placeholder: "Partner A: $50,000 cash\nPartner B: $50,000 worth of IP and equipment" },
      { key: "profitSplit",    label: "Profit / Loss Split",     type: "textarea", required: true, placeholder: "e.g. 60% Partner A, 40% Partner B" },
      { key: "management",     label: "Management Structure",    type: "textarea", placeholder: "e.g. Each general partner has equal voting rights; major decisions require unanimous consent" },
      { key: "buySell",        label: "Buy-Sell Provision",      type: "toggle",   hint: "Includes shotgun / right of first refusal clause" },
      { key: "dissolution",    label: "Dissolution Terms",       type: "textarea", placeholder: "e.g. Dissolution requires majority vote; wind-down within 180 days" },
    ],
  },
  {
    id: "franchise",
    name: "Franchise Agreement",
    category: "Business",
    description: "Franchise agreement with FTC Franchise Rule compliance (14-day FDD disclosure requirement auto-flagged), territory, royalties, and training obligations.",
    icon: "🏪",
    features: ["FTC 14-day FDD disclosure requirement flagged", "Territory rights", "Initial franchise fee", "Ongoing royalty %", "Training & support obligations"],
    legalNotes: ["FTC Franchise Rule requires the franchisor to provide a Franchise Disclosure Document (FDD) at least 14 calendar days before any agreement is signed or money exchanged. This AI will flag this requirement prominently.", "Some states (CA, MD, MN, NY, etc.) have additional franchise registration requirements beyond the FTC rule."],
    fields: [
      { key: "franchiseName",  label: "Franchise / Brand Name",  type: "text",     required: true },
      { key: "territory",      label: "Franchise Territory",     type: "textarea", required: true, placeholder: "e.g. Exclusive rights to operate within 10-mile radius of 123 Main St, Austin, TX" },
      { key: "initialFee",     label: "Initial Franchise Fee ($)",type: "number",  required: true },
      { key: "royaltyPct",     label: "Ongoing Royalty (% of gross)", type: "number", required: true, placeholder: "6" },
      { key: "marketingFund",  label: "Marketing Fund Contribution (%)", type: "number", placeholder: "2" },
      { key: "termYears",      label: "Initial Term (years)",    type: "number",   placeholder: "10" },
      { key: "training",       label: "Training & Support",      type: "textarea", placeholder: "e.g. 2-week initial training at headquarters, ongoing quarterly field visits" },
      { key: "fddConfirm",     label: "FDD Delivered 14+ days before signing", type: "toggle", hint: "Required by FTC Franchise Rule" },
    ],
  },
  {
    id: "confidentiality",
    name: "Confidentiality Agreement",
    category: "Confidentiality",
    description: "Standalone confidentiality agreement (broader than NDA) with trade secret protections, non-disclosure, non-use obligations, and DTSA compliance.",
    icon: "🛡️",
    features: ["Broader than standard NDA", "Non-disclosure + non-use obligations", "DTSA whistleblower notice", "Trade secret definition", "Injunctive relief provision"],
    legalNotes: ["This is broader than a standard NDA — it includes non-use obligations and injunctive relief clauses, making it more suitable for employees and contractors with access to core IP.", "DTSA notice is auto-included as required by federal law."],
    fields: [
      { key: "scope",          label: "Scope of Confidential Information", type: "textarea", required: true, placeholder: "All non-public information related to the company's business, including but not limited to…" },
      { key: "obligations",    label: "Specific Obligations",   type: "textarea", placeholder: "e.g. Do not copy, distribute, disclose, or use for any purpose other than…" },
      { key: "duration",       label: "Duration (years)",       type: "number",   required: true, placeholder: "5" },
      { key: "permittedUse",   label: "Permitted Use",          type: "textarea", required: true, placeholder: "Solely for the purpose of evaluating / performing…" },
    ],
  },
  {
    id: "lease",
    name: "Lease Agreement",
    category: "Property",
    description: "Residential or commercial lease with state-specific landlord-tenant law variations, security deposit limits, and habitability provisions.",
    icon: "🏠",
    features: ["Residential or commercial", "State landlord-tenant law variations", "Security deposit rules by state", "Habitability provisions", "Late fee and grace period"],
    legalNotes: ["Security deposit limits vary by state (e.g. California: 2 months rent unfurnished; New York: 1 month). The AI will apply the correct limit based on selected state.", "Notice requirements for entry and termination vary significantly by state."],
    fields: [
      { key: "leaseType",      label: "Lease Type",             type: "select",   options: ["Residential","Commercial"], required: true },
      { key: "propertyAddr",   label: "Property Address",       type: "textarea", required: true },
      { key: "monthlyRent",    label: "Monthly Rent ($)",       type: "number",   required: true },
      { key: "securityDeposit",label: "Security Deposit ($)",   type: "number",   required: true, hint: "AI will warn if this exceeds state limit" },
      { key: "leaseStart",     label: "Lease Start Date",       type: "date",     required: true },
      { key: "leaseEnd",       label: "Lease End Date",         type: "date",     required: true },
      { key: "lateFee",        label: "Late Fee ($)",           type: "number",   placeholder: "50" },
      { key: "graceperiod",    label: "Grace Period (days)",    type: "number",   placeholder: "5" },
      { key: "petPolicy",      label: "Pet Policy",             type: "select",   options: ["No pets","Pets allowed with deposit","Pets allowed no deposit","Case by case"] },
      { key: "utilities",      label: "Utilities Included",     type: "textarea", placeholder: "e.g. Landlord pays water and trash. Tenant pays electric, gas, internet." },
    ],
  },
  {
    id: "loan",
    name: "Loan Agreement",
    category: "Finance",
    description: "Loan agreement with state usury law check on interest rate, repayment schedule, default provisions, and collateral clause.",
    icon: "💵",
    features: ["State usury law check on interest rate", "Fixed or variable rate", "Repayment schedule (amortising/interest-only/balloon)", "Default & cure period", "Collateral / security interest"],
    legalNotes: ["Usury laws set maximum interest rates. For personal loans, many states cap at 6–16% APR. Commercial loans often have higher or no caps. The AI will flag if your rate may exceed the state limit.", "For loans over $10,000 between individuals, the IRS requires a minimum 'Applicable Federal Rate' (AFR) to avoid gift tax implications."],
    fields: [
      { key: "loanAmount",     label: "Principal Amount ($)",   type: "number",   required: true },
      { key: "interestRate",   label: "Annual Interest Rate (%)",type: "number",  required: true, hint: "AI will flag if potentially above state usury limit" },
      { key: "rateType",       label: "Rate Type",              type: "select",   options: ["Fixed","Variable (Prime + spread)"], required: true },
      { key: "loanPurpose",    label: "Purpose of Loan",        type: "textarea", required: true, placeholder: "e.g. Working capital for business operations" },
      { key: "repaymentType",  label: "Repayment Structure",    type: "select",   options: ["Equal monthly instalments (amortising)","Interest-only with balloon payment","Lump sum on maturity date","Custom schedule"], required: true },
      { key: "termMonths",     label: "Term (months)",          type: "number",   required: true, placeholder: "36" },
      { key: "collateral",     label: "Collateral / Security",  type: "textarea", placeholder: "e.g. All business assets, or leave blank for unsecured" },
      { key: "defaultCure",    label: "Default Cure Period (days)",type: "number", placeholder: "15" },
    ],
  },
  {
    id: "release-liability",
    name: "Release of Liability",
    category: "Legal Waiver",
    description: "Liability waiver / release with enforceability warnings for Virginia and Louisiana where releases are heavily restricted, and assumption-of-risk language.",
    icon: "📜",
    features: ["Assumption of risk language", "Virginia & Louisiana enforceability warnings", "Gross negligence carve-out", "Minor participant handling", "Activity-specific language"],
    legalNotes: ["Virginia Code § 35.1-20 and Louisiana Civil Code Art. 2004 severely restrict liability waivers. The AI will flag these states prominently.", "A release cannot typically waive liability for gross negligence or intentional misconduct in any state.", "Releases signed by or for minors are generally unenforceable — courts require special procedures."],
    fields: [
      { key: "activity",       label: "Activity / Event",       type: "textarea", required: true, placeholder: "e.g. Bungee jumping at XYZ Adventure Park on [date]" },
      { key: "risks",          label: "Known Risks",            type: "textarea", required: true, placeholder: "e.g. Physical injury, death, property damage arising from the activity" },
      { key: "minors",         label: "May Involve Minors",     type: "toggle",   hint: "Adds parental consent language (though still limited enforceability)" },
      { key: "indemnification",label: "Include Indemnification",type: "toggle",   hint: "Releasor also agrees to indemnify the company against third-party claims" },
      { key: "jurisdiction",   label: "Governing Law State",    type: "select",   options: ["— Select state —", ...US_STATES], required: true },
    ],
  },
];

export const CONTRACT_CATEGORIES: { id: ContractCategory; label: string; icon: string; description: string }[] = [
  { id: "Employment",      label: "Employment",       icon: "💼", description: "Contracts, offer letters, and contractor agreements" },
  { id: "Confidentiality", label: "Confidentiality",  icon: "🔒", description: "NDAs and confidentiality agreements" },
  { id: "Services",        label: "Services",         icon: "⚙️", description: "SLAs, retainers, and service agreements" },
  { id: "Commerce",        label: "Commerce",         icon: "🛒", description: "Sales, purchase orders, and distribution" },
  { id: "Business",        label: "Business",         icon: "🏢", description: "Partnership and franchise agreements" },
  { id: "Property",        label: "Property",         icon: "🏠", description: "Lease agreements" },
  { id: "Finance",         label: "Finance",          icon: "💵", description: "Loan agreements" },
  { id: "Legal Waiver",    label: "Legal Waiver",     icon: "📜", description: "Releases and liability waivers" },
];

export function getContractType(id: string): ContractType | undefined {
  return CONTRACT_TYPES.find(c => c.id === id);
}
