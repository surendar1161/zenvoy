"use client";

import type { BrandKit } from "@/lib/brand";

interface Props {
  clientName: string;
  clientCompany: string;
  projectType: string;
  freelancerName: string;
  freelancerTitle: string;
  brand: BrandKit;
  date?: string;
}

export default function ProposalCover({
  clientName,
  clientCompany,
  projectType,
  freelancerName,
  freelancerTitle,
  brand,
  date,
}: Props) {
  const displayDate = date ?? new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const recipient = clientCompany || clientName;

  return (
    <div
      className="relative min-h-[90vh] flex flex-col overflow-hidden print:min-h-screen"
      style={{ backgroundColor: brand.primaryColor, fontFamily: `'${brand.fontFamily}', sans-serif` }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${brand.secondaryColor} 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, white 0%, transparent 50%)`,
        }}
      />

      {/* Header bar */}
      <div className="relative flex items-center justify-between px-12 py-8">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
        ) : (
          <div className="text-white/80 font-bold text-lg tracking-wide">
            {brand.companyName || freelancerName}
          </div>
        )}
        <div className="text-white/60 text-sm">{displayDate}</div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col justify-center px-12 py-16">
        <div className="max-w-2xl">
          <p className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-6">
            Proposal for
          </p>
          <h1
            className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: `'${brand.fontFamily}', sans-serif` }}
          >
            {recipient}
          </h1>
          <div className="w-20 h-1 mb-8" style={{ backgroundColor: brand.secondaryColor }} />
          <p className="text-white/80 text-xl sm:text-2xl font-light leading-relaxed">
            {projectType}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex items-end justify-between px-12 py-10">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1">Prepared by</p>
          <p className="text-white font-semibold text-lg">{freelancerName}</p>
          <p className="text-white/60 text-sm">{freelancerTitle}</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1">Confidential</p>
          <p className="text-white/60 text-xs">This proposal is prepared exclusively for {recipient}</p>
        </div>
      </div>
    </div>
  );
}
