"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Booking } from "@/features/bookings/types";
import { formatDateTime, formatPhone } from "@/lib/format";

const column = createAppColumnHelper<Booking>();

export const bookingColumns = column.columns([
  column.accessor("slotAt", {
    header: "Slot",
    enableSorting: true,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <Link
        href={`/garage/bookings/${row.original.id}`}
        className="font-medium text-navy-700 hover:underline"
      >
        {formatDateTime(row.original.slotAt)}
      </Link>
    ),
  }),
  column.accessor("customer", {
    header: "Customer",
    cell: ({ getValue }) => (
      <span className="flex flex-col">
        {getValue().name}
        <span className="text-xs text-gray-500">{formatPhone(getValue().phone)}</span>
      </span>
    ),
  }),
  column.accessor("vehicle", {
    header: "Vehicle",
    cell: ({ getValue }) => (
      <span className="flex flex-col items-end gap-1 @3xl:items-start">
        <NumberPlate plate={getValue().plate} />
        <span className="text-xs text-gray-500">
          {getValue().make} {getValue().model}
        </span>
      </span>
    ),
  }),
  column.accessor("services", {
    header: "Services",
    cell: ({ getValue }) => (
      <span className="block max-w-56 whitespace-normal">
        {getValue()
          .map((service) => service.name)
          .join(", ")}
      </span>
    ),
  }),
  column.accessor((booking) => booking.branch.name, { id: "branch", header: "Branch" }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
]);
