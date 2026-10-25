"use client";

import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

interface Competitor {
  name: string;
  highlight?: boolean;
}

interface Feature {
  name: string;
  values: Record<string, boolean | string>;
}

interface ComparisonTableProps {
  competitors: Competitor[];
  features: Feature[];
}

export default function ComparisonTable({ competitors, features }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-4 text-left text-[13px] font-bold text-ink-500">Feature</th>
              {competitors.map(c => (
                <th key={c.name} className={`px-4 py-4 text-center text-[14px] font-extrabold ${c.highlight ? "bg-brand-50 text-brand-700" : "text-ink"}`}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={f.name} className={i < features.length - 1 ? "border-b border-line/80" : ""}>
                <td className="px-5 py-3.5 text-[14px] text-ink-600">{f.name}</td>
                {competitors.map(c => {
                  const val = f.values[c.name];
                  return (
                    <td key={c.name} className={`px-4 py-3.5 text-center ${c.highlight ? "bg-brand-50/60" : ""}`}>
                      {val === true ? (
                        <CheckCircleFilled className="text-[18px] text-emerald-500" />
                      ) : val === false ? (
                        <CloseCircleOutlined className="text-[18px] text-ink-200" />
                      ) : (
                        <span className="text-[13px] text-ink-600">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
