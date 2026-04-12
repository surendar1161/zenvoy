export interface BrandKit {
  logoUrl: string | null;       // base64 data URL
  primaryColor: string;         // hex e.g. "#0ea5e9"
  secondaryColor: string;       // hex e.g. "#0369a1"
  fontFamily: string;           // Google Font name
  companyName: string;          // for white-label — shown instead of "Zenvoy"
}

export const DEFAULT_BRAND: BrandKit = {
  logoUrl: null,
  primaryColor: "#0ea5e9",
  secondaryColor: "#0369a1",
  fontFamily: "Inter",
  companyName: "",
};

export const FONT_OPTIONS = [
  { value: "Inter",            label: "Inter",             preview: "Modern & clean",     url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" },
  { value: "Playfair Display", label: "Playfair Display",  preview: "Elegant & luxury",   url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap" },
  { value: "Space Grotesk",   label: "Space Grotesk",     preview: "Tech & startup",     url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap" },
  { value: "Merriweather",    label: "Merriweather",      preview: "Editorial & trusted", url: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" },
  { value: "Raleway",         label: "Raleway",           preview: "Creative & bold",    url: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap" },
];

export const STORAGE_KEY = "zenvoy_brand";

export function loadBrand(): BrandKit {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_BRAND, ...JSON.parse(raw) } : DEFAULT_BRAND;
  } catch { return DEFAULT_BRAND; }
}

export function saveBrand(brand: BrandKit) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(brand));
}

// CSS custom properties from brand kit
export function brandToCss(brand: BrandKit): string {
  return `
    --brand-primary: ${brand.primaryColor};
    --brand-secondary: ${brand.secondaryColor};
    --brand-font: '${brand.fontFamily}', sans-serif;
  `;
}
