import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getReturns } from "@/features/returns/api";
import { ReturnsTable } from "@/features/returns/components/ReturnsTable";

export const metadata: Metadata = {
  title: "Returns",
};

type ReturnsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReturnsPage({ searchParams }: ReturnsPageProps) {
  const params = await searchParams;
  const page = Number(params.page);
  const returns = await getReturns({
    order: params.order === "asc" ? "asc" : "desc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  });

  return (
    <>
      <PageHeader
        title="Returns"
        description="Parts you've sent back and where each return is. Start a return from a delivered order."
      />
      <ReturnsTable returns={returns} />
    </>
  );
}
