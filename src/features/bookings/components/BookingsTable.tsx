"use client";

import { CalendarCheck } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { bookingColumns } from "@/features/bookings/components/columns";
import type { Booking } from "@/features/bookings/types";
import type { Paginated } from "@/lib/types";

export function BookingsTable({ bookings }: { bookings: Paginated<Booking> }) {
  const { items, ...pagination } = bookings;

  return (
    <DataTable
      label="Bookings"
      columns={bookingColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={CalendarCheck}
          title="No bookings here"
          description="Customers book through the SpareX app; new bookings appear here for you to accept."
        />
      }
    />
  );
}
