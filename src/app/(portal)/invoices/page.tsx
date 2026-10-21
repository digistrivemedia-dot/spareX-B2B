import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { getDocuments } from "@/features/documents/api";
import { DocumentsTable } from "@/features/documents/components/DocumentsTable";
import type { DocumentKind } from "@/features/documents/types";
import { DOCUMENT_KIND_LABELS } from "@/features/documents/utils";
import {
  getParam,
  parseDateRange,
  parsePage,
  pickParam,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Invoices & documents",
};

const KINDS = Object.keys(DOCUMENT_KIND_LABELS) as DocumentKind[];

type InvoicesPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams;
  const documents = await getDocuments({
    kind: pickParam(params, "type", KINDS),
    q: getParam(params, "q"),
    ...parseDateRange(params),
    order: params.order === "asc" ? "asc" : "desc",
    page: parsePage(params),
  });

  return (
    <>
      <PageHeader
        title="Invoices & documents"
        description="GST invoices, credit notes and quotations, ready to download for your accounts."
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
        <SearchFilter id="documents-search" label="Number" placeholder="e.g. KG/26-27/1112" />
        <FilterSelect
          param="type"
          label="Type"
          allLabel="All types"
          options={KINDS.map((value) => ({ value, label: DOCUMENT_KIND_LABELS[value] }))}
        />
        <DateRangeFilter id="documents" />
      </div>
      <DocumentsTable documents={documents} />
    </>
  );
}
