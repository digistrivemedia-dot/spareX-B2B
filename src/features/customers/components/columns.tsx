"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { NumberPlate } from "@/components/ui/NumberPlate";
import type { CustomerSummary } from "@/features/customers/types";
import { formatDate, formatPhone } from "@/lib/format";

const column = createAppColumnHelper<CustomerSummary>();

export const customerColumns = column.columns([
  column.accessor("name", {
    header: "Customer",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex flex-col">
        <Link
          href={`/garage/customers/${row.original.id}`}
          className="font-medium text-navy-700 hover:underline"
        >
          {row.original.name}
        </Link>
        {row.original.hasAppAccount && (
          <span className="text-xs text-gray-500">On the SpareX app</span>
        )}
      </span>
    ),
  }),
  column.accessor("phone", {
    header: "Mobile",
    cell: ({ getValue }) => formatPhone(getValue()),
  }),
  column.accessor("vehicles", {
    header: "Vehicles",
    cell: ({ getValue }) => (
      <span className="flex flex-col items-end gap-1 @3xl:items-start">
        {getValue().map((vehicle) => (
          <span key={vehicle.id} className="flex items-center gap-2">
            <NumberPlate plate={vehicle.plate} />
            <span className="text-xs text-gray-500">{vehicle.model}</span>
          </span>
        ))}
      </span>
    ),
  }),
  column.accessor("lastVisitAt", {
    header: "Last visit",
    cell: ({ getValue }) => {
      const date = getValue();
      return date ? formatDate(date) : "—";
    },
  }),
  column.accessor("jobCount", { header: "Jobs", meta: { align: "right" } }),
]);
