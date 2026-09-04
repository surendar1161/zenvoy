"use client";

import Link from "next/link";
import { Progress, Tooltip, Typography } from "antd";
import type { UsageSummary } from "@/lib/usage";
import { isAtLimit, usageLabel, usagePercent } from "@/lib/usage";

const { Text } = Typography;

interface UsageMeterProps {
  usage: UsageSummary | null;
  collapsed?: boolean;
}

function limitColor(percent: number, atLimit: boolean): string {
  if (atLimit) return "#ef4444";
  if (percent >= 80) return "#f59e0b";
  return "#0ea5e9";
}

export default function UsageMeter({ usage, collapsed = false }: UsageMeterProps) {
  if (!usage) return null;

  const items = [
    { key: "proposals", label: "Proposals", icon: "📄", data: usage.proposals },
    { key: "contracts", label: "Contracts", icon: "📋", data: usage.contracts },
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
    const color = limitColor(worst.pct, atLimit);

    return (
      <Tooltip
        title={`${worst.label}: ${usageLabel(worst.data)} this month`}
        placement="right"
      >
        <Link href="/subscription" style={{ display: "block", padding: "8px 12px" }}>
          <div style={{
            height: 4, borderRadius: 4, background: "#e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${worst.pct}%`,
              height: "100%",
              background: color,
              borderRadius: 4,
            }} />
          </div>
        </Link>
      </Tooltip>
    );
  }

  return (
    <div style={{ margin: "8px 12px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Usage · {usage.periodLabel.split(" ")[0]}
        </Text>
        {usage.hasUnlimitedUsage && (
          <Text style={{ fontSize: 10, fontWeight: 700, color: "#0ea5e9", background: "#eff6ff", padding: "2px 8px", borderRadius: 20 }}>
            Pro
          </Text>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(item => {
          const atLimit = isAtLimit(item.data);
          const pct = usagePercent(item.data.used, item.data.limit);
          const color = item.data.limit === "unlimited" ? "#0ea5e9" : limitColor(pct, atLimit);

          return (
            <div key={item.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 12, color: "#475569" }}>
                  {item.icon} {item.label}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: atLimit ? "#ef4444" : "#334155" }}>
                  {item.data.limit === "unlimited" ? `${item.data.used} · Unlimited` : usageLabel(item.data)}
                </Text>
              </div>
              {item.data.limit !== "unlimited" && (
                <Progress
                  percent={pct}
                  showInfo={false}
                  size="small"
                  strokeColor={color}
                  trailColor="#e2e8f0"
                />
              )}
            </div>
          );
        })}
      </div>

      {showUpgrade && (
        <Link href="/subscription" style={{ display: "block", marginTop: 10 }}>
          <Text style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 600 }}>
            Upgrade for unlimited →
          </Text>
        </Link>
      )}
    </div>
  );
}
