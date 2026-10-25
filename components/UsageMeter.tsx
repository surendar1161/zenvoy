"use client";

import Link from "next/link";
import { Tooltip } from "antd";
import { FileTextOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import type { UsageSummary } from "@/lib/usage";
import { isAtLimit, usageLabel, usagePercent } from "@/lib/usage";

interface UsageMeterProps {
  usage: UsageSummary | null;
  collapsed?: boolean;
}

function barClass(percent: number, atLimit: boolean): string {
  if (atLimit) return "bg-red-500";
  if (percent >= 80) return "bg-amber-500";
  return "bg-gradient-to-r from-brand-400 to-brand-600";
}

export default function UsageMeter({ usage, collapsed = false }: UsageMeterProps) {
  if (!usage) return null;

  const items = [
    { key: "proposals", label: "Proposals", icon: <FileTextOutlined />, data: usage.proposals },
    { key: "contracts", label: "Contracts", icon: <SafetyCertificateOutlined />, data: usage.contracts },
  ];

  const showUpgrade = !usage.hasUnlimitedUsage && items.some(i => isAtLimit(i.data));

  if (collapsed) {
    const worst = items.reduce((best, item) => {
      if (item.data.limit === "unlimited") return best;
      const pct = usagePercent(item.data.used, item.data.limit);
      return pct > best.pct ? { pct, label: item.label, data: item.data } : best;
    }, { pct: 0, label: "", data: items[0].data });

    if (usage.hasUnlimitedUsage) return null;

    const atLimit = isAtLimit(worst.data);

    return (
      <Tooltip title={`${worst.label}: ${usageLabel(worst.data)} this month`} placement="right">
        <Link href="/subscription" className="block px-3 py-2" aria-label="Usage this month">
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div className={`h-full rounded-full ${barClass(worst.pct, atLimit)}`} style={{ width: `${worst.pct}%` }} />
          </div>
        </Link>
      </Tooltip>
    );
  }

  return (
    <div className="mx-3 my-2 rounded-2xl border border-line bg-canvas p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Usage · {usage.periodLabel.split(" ")[0]}</span>
        {usage.hasUnlimitedUsage && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">Pro</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {items.map(item => {
          const atLimit = isAtLimit(item.data);
          const pct = usagePercent(item.data.used, item.data.limit);
          const unlimited = item.data.limit === "unlimited";

          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-ink-500"><span className="text-[11px] text-ink-300">{item.icon}</span>{item.label}</span>
                <span className={`font-semibold tabular-nums ${atLimit ? "text-red-500" : "text-ink-700"}`}>
                  {unlimited ? `${item.data.used} · Unlimited` : usageLabel(item.data)}
                </span>
              </div>
              {!unlimited && (
                <div className="h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label} usage`}>
                  <div className={`h-full rounded-full transition-all duration-700 ${barClass(pct, atLimit)}`} style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showUpgrade && (
        <Link href="/subscription" className="mt-3 block text-[12px] font-semibold text-brand-600 hover:text-brand-700">
          Upgrade for unlimited →
        </Link>
      )}
    </div>
  );
}
