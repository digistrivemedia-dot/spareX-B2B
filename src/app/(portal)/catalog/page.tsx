import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Catalogue",
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader title="Catalogue" />
      <ComingSoon feature="the catalogue" />
    </>
  );
}
