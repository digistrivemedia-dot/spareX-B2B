import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getReturn } from "@/features/returns/api";
import { ReturnDetail } from "@/features/returns/components/ReturnDetail";
import { formatDateTime } from "@/lib/format";

type ReturnPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ReturnPageProps): Promise<Metadata> {
  const request = await getReturn((await params).id);
  return { title: request ? `Return ${request.number}` : "Return not found" };
}

export default async function ReturnPage({ params }: ReturnPageProps) {
  const request = await getReturn((await params).id);
  if (!request) notFound();

  return (
    <>
      <PageHeader
        title={request.number}
        description={`Requested ${formatDateTime(request.requestedAt)}`}
      />
      <ReturnDetail request={request} />
    </>
  );
}
