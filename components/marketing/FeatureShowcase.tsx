"use client";

import { CheckCircleFilled } from "@ant-design/icons";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  points: string[];
  bg: string;
  border: string;
}

interface FeatureShowcaseProps {
  features: Feature[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export default function FeatureShowcase({ features, sectionTitle, sectionSubtitle }: FeatureShowcaseProps) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {sectionTitle && (
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-[32px] font-extrabold leading-tight text-ink sm:text-[40px]">{sectionTitle}</h2>
            {sectionSubtitle && <p className="mt-3 text-[16px] text-ink-500">{sectionSubtitle}</p>}
          </div>
        )}
        <div className="space-y-16">
          {features.map((f, i) => (
            <div key={f.title} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 !== 0 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="flex min-h-[240px] items-center justify-center rounded-[28px] border p-10 text-center" style={{ background: f.bg, borderColor: f.border }}>
                <div>
                  <div className="mb-3 flex justify-center">{f.icon}</div>
                  <div className="font-display text-[32px] font-extrabold text-ink">{f.title}</div>
                </div>
              </div>
              <div>
                <h3 className="text-[26px] font-extrabold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-500">{f.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {f.points.map(pt => (
                    <li key={pt} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <CheckCircleFilled className="mt-1 shrink-0 text-[15px] text-emerald-500" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
