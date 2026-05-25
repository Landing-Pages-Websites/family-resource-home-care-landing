import type { Metadata } from "next";
import { TerritoryPage } from "@/components/TerritoryPage";
import { TERRITORIES } from "@/components/Brand";

const t = TERRITORIES["oregon-city"];

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    type: "website",
    url: `https://call.familyresourcehomecare.com/${t.id}`,
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <TerritoryPage territoryId="oregon-city" />;
}
