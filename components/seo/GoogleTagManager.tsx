import Script from "next/script";
import { resolveGtmId } from "@/lib/gtm";

/** Loads the Google Tag Manager container (head script). Renders nothing in development. */
export function GoogleTagManagerScript() {
  const id = resolveGtmId(process.env.NEXT_PUBLIC_GTM_ID, process.env.NODE_ENV);
  if (!id) return null;
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

/** Fallback for visitors with JavaScript disabled; render right after the opening body tag. */
export function GoogleTagManagerNoscript() {
  const id = resolveGtmId(process.env.NEXT_PUBLIC_GTM_ID, process.env.NODE_ENV);
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
