import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BUSINESS_TYPE_LABELS } from "@/features/company/business-types";
import { BusinessContactDialog } from "@/features/company/components/BusinessContactDialog";
import type { Business } from "@/features/company/types";
import type { CreditSummary } from "@/features/credit/types";
import { formatDate, formatPhone, formatPrice } from "@/lib/format";

type BusinessProfileProps = {
  business: Business;
  /** Null when credit isn't enabled. */
  credit: CreditSummary | null;
};

export function BusinessProfile({ business, credit }: BusinessProfileProps) {
  const { registeredAddress: address } = business;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard title="Business">
        <DetailList>
          <DetailItem label="Name">{business.name}</DetailItem>
          <DetailItem label="Type">{BUSINESS_TYPE_LABELS[business.type]}</DetailItem>
          <DetailItem label="GSTIN">{business.gstin ?? "Not given"}</DetailItem>
          <DetailItem label="PAN">{business.pan ?? "Not given"}</DetailItem>
          <DetailItem label="Registered address">
            {[address.line1, address.line2, address.city, address.state].filter(Boolean).join(", ")}{" "}
            {address.pin}
          </DetailItem>
        </DetailList>
        <p className="mt-4 text-xs text-gray-500">
          These are fixed once Kannali verifies your business. Call your account manager to change
          them.
        </p>
      </SectionCard>

      <SectionCard
        title="Contact"
        action={
          <BusinessContactDialog
            business={business}
            trigger={
              <Button variant="ghost" size="sm">
                <Pencil aria-hidden />
                Edit
              </Button>
            }
          />
        }
      >
        <DetailList>
          <DetailItem label="Business email">{business.email}</DetailItem>
          <DetailItem label="Phone">{formatPhone(business.phone)}</DetailItem>
        </DetailList>
      </SectionCard>

      <SectionCard title="Your terms with Kannali">
        <DetailList>
          <DetailItem label="Verified on">{formatDate(business.approvedAt)}</DetailItem>
          <DetailItem label="Business discount">
            {business.discountPercent}% off B2C prices
          </DetailItem>
          <DetailItem label="Credit">
            {credit ? (
              <span className="flex flex-wrap items-center gap-2">
                <StatusBadge status="active">Enabled</StatusBadge>
                {formatPrice(credit.limitInPaise)} limit · Net {credit.termsDays}
              </span>
            ) : (
              <StatusBadge status="disabled">Not enabled</StatusBadge>
            )}
          </DetailItem>
        </DetailList>
      </SectionCard>

      <SectionCard title="Registration photos">
        <div className="flex flex-col gap-4 text-sm">
          <PhotoGallery photos={business.photos} label="Shop photo" />
          {business.documents.length > 0 ? (
            <PhotoGallery photos={business.documents} label="Document" />
          ) : (
            <p className="text-gray-500">No licence or certificate photos were added.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
