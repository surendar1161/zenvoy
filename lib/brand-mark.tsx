/** The DealPilot logo mark (paper plane on the brand gradient), for ImageResponse images. */
export function BrandMark({ size }: { size: number }) {
  const glyph = Math.round(size * 0.56);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Math.round(size * 0.26),
        background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #7c3aed 100%)",
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 3 2.5 10.6l7 2.9 2.9 7 9.1-17.5Z" />
        <path d="m9.5 13.5 5-5" />
      </svg>
    </div>
  );
}
