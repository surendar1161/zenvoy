export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger_type: string;
  conditions: { field: string; operator: string; value?: unknown }[];
  actions: { type: string; config: Record<string, unknown> }[];
}

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: "proposal-to-contract",
    name: "Proposal Accepted → Create Contract Reminder",
    description: "When a proposal is accepted, create a task to send the contract.",
    icon: "FileProtectOutlined",
    trigger_type: "proposal_accepted",
    conditions: [],
    actions: [
      {
        type: "create_task",
        config: { title: "Send contract to {{clientName}} for '{{documentType}}' project" },
      },
      {
        type: "create_notification",
        config: { title: "Proposal accepted!", body: "{{clientName}} accepted your proposal. Time to send a contract." },
      },
    ],
  },
  {
    id: "overdue-reminder",
    name: "Invoice Overdue → Send Reminder",
    description: "When an invoice becomes overdue, send an email notification.",
    icon: "ClockCircleOutlined",
    trigger_type: "invoice_overdue",
    conditions: [],
    actions: [
      {
        type: "send_email",
        config: { notification_type: "invoice_overdue" },
      },
    ],
  },
  {
    id: "contract-to-invoice",
    name: "Contract Signed → Create Invoice",
    description: "Automatically create a draft invoice when a contract is signed.",
    icon: "DollarOutlined",
    trigger_type: "contract_signed",
    conditions: [],
    actions: [
      {
        type: "create_invoice",
        config: { title: "Invoice for contract — {{signerName}}", amount: 0, currency: "USD" },
      },
    ],
  },
  {
    id: "viewed-notify",
    name: "Proposal Viewed → Notify",
    description: "Get notified the moment a client opens your proposal.",
    icon: "EyeOutlined",
    trigger_type: "proposal_viewed",
    conditions: [],
    actions: [
      {
        type: "create_notification",
        config: { title: "{{clientName}} is viewing your proposal", body: "They just opened it. Follow up while they're engaged!" },
      },
    ],
  },
  {
    id: "paid-task",
    name: "Payment Received → Create Follow-up Task",
    description: "When payment is received, create a thank-you follow-up task.",
    icon: "CheckCircleOutlined",
    trigger_type: "payment_received",
    conditions: [],
    actions: [
      {
        type: "create_task",
        config: { title: "Send thank-you note for payment received" },
      },
    ],
  },
  {
    id: "failed-alert",
    name: "Payment Failed → Alert",
    description: "Immediately get notified when a payment fails.",
    icon: "WarningOutlined",
    trigger_type: "payment_failed",
    conditions: [],
    actions: [
      {
        type: "create_notification",
        config: { title: "Payment failed!", body: "A payment just failed. Check your Stripe dashboard." },
      },
      {
        type: "send_email",
        config: { notification_type: "payment_failed" },
      },
    ],
  },
];
