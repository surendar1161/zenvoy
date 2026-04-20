import { redirect } from "next/navigation";

export default function BrandPage() {
  redirect("/settings?tab=brand");
}
