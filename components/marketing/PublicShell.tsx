"use client";

import { ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import { antdTheme } from "@/lib/theme";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

/**
 * Shared shell for every public marketing page ("Calm Flight").
 * - Home (`/`) lays out its own hero beneath a transparent floating nav.
 * - All other public pages get a solid glass nav and top offset automatically,
 *   so legacy page content keeps working until each page is restyled.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="dp min-h-screen">
        <Nav solid={!isHome} />
        <div className={isHome ? "" : "pt-[76px]"}>{children}</div>
        <Footer />
      </div>
    </ConfigProvider>
  );
}
