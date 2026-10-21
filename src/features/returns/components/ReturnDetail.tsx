import Link from "next/link";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Timeline } from "@/components/ui/Timeline";
import { RefundSummary } from "@/features/returns/components/RefundSummary";
import { ReturnItemsTable } from "@/features/returns/components/ReturnItemsTable";
import type { ReturnRequest } from "@/features/returns/types";
import { getReturnSteps, RETURN_REASON_LABELS } from "@/features/returns/utils";

export function ReturnDetail({ request }: { request: ReturnRequest }) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section>
          <SectionHeader title="Parts" />
          <ReturnItemsTable items={request.items} />
        </section>
        <SectionCard title="Why it's coming back">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-gray-500">Reason</dt>
              <dd className="text-gray-900">{RETURN_REASON_LABELS[request.reason]}</dd>
            </div>
            {request.notes && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-gray-500">Your notes</dt>
                <dd className="text-gray-900">{request.notes}</dd>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <dt className="text-gray-500">Photos</dt>
              <dd>
                {request.photos.length ? (
                  <PhotoGallery photos={request.photos} label="Return photo" />
                ) : (
                  <span className="text-gray-700">None added</span>
                )}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      {/* Below xl the aside dissolves so status leads the page and the history closes it. */}
      <aside className="contents xl:sticky xl:top-20 xl:flex xl:w-80 xl:shrink-0 xl:flex-col xl:gap-6">
        <Card className="order-first xl:order-none">
          <CardContent className="flex flex-col gap-3 text-sm">
            <StatusBadge status={request.status} className="self-start" />
            <p className="text-gray-700">
              From order{" "}
              <Link
                href={`/orders/${request.order.id}`}
                className="font-medium text-navy-700 hover:underline"
              >
                {request.order.number}
              </Link>{" "}
              · pickup from {request.branch.name}
            </p>
          </CardContent>
        </Card>
        <RefundSummary
          refundInPaise={request.refundInPaise}
          refundMethod={request.refundMethod}
          isRefunded={request.status === "refunded"}
        />
        <SectionCard title="Progress" className="order-last xl:order-none">
          <Timeline label="Return progress" steps={getReturnSteps(request)} />
        </SectionCard>
      </aside>
    </div>
  );
}
