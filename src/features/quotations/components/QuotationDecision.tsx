"use client";

import { CircleCheck, MessageSquareText, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { rejectQuotationAction, requestRevisionAction } from "@/features/quotations/actions";
import { CommentDialog } from "@/features/quotations/components/CommentDialog";
import { rejectionSchema, revisionSchema } from "@/features/quotations/schemas";

/** The three choices on a quotation that is waiting for the buyer. */
export function QuotationDecision({ quotationId }: { quotationId: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" asChild>
        <Link href={`/checkout?quotation=${quotationId}`}>
          <CircleCheck aria-hidden />
          Accept & checkout
        </Link>
      </Button>
      <CommentDialog
        trigger={
          <Button variant="outline">
            <MessageSquareText aria-hidden />
            Ask for revision
          </Button>
        }
        title="Ask for a revision"
        description="Kannali will send a new quote, usually within a working day."
        label="What should change?"
        placeholder="e.g. Can you do ₹370 per bottle on the Motul for 48 bottles?"
        submitLabel="Send request"
        successMessage="Revision requested. We'll let you know when the new quote is ready."
        schema={revisionSchema}
        onSubmit={(comment) => requestRevisionAction(quotationId, comment)}
      />
      <CommentDialog
        trigger={
          <Button variant="ghost" className="text-danger-700 hover:text-danger-700">
            <X aria-hidden />
            Reject
          </Button>
        }
        title="Reject this quotation?"
        description="The quoted prices will no longer be available. This can't be undone."
        label="Reason"
        placeholder="e.g. Found the parts locally."
        submitLabel="Reject quotation"
        successMessage="Quotation rejected."
        schema={rejectionSchema}
        onSubmit={(comment) => rejectQuotationAction(quotationId, comment)}
        isDestructive
      />
    </div>
  );
}
