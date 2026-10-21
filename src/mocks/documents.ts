import type { BusinessDocument, DocumentFilters } from "@/features/documents/types";
import { toIndiaDate } from "@/lib/dates";
import type { Paginated } from "@/lib/types";
import { creditNotes, listInvoices } from "@/mocks/credit";
import { quotations } from "@/mocks/quotations";
import { paginate, simulateLatency, sortItems } from "@/mocks/utils";

const fileName = (number: string) => number.replaceAll("/", "-");

function listDocuments(): BusinessDocument[] {
  const invoices = listInvoices();
  return [
    ...invoices.map((invoice) => ({
      id: `doc-${invoice.id}`,
      kind: "invoice" as const,
      number: invoice.number,
      date: invoice.issuedAt,
      amountInPaise: invoice.amountInPaise,
      relatedTo: invoice.order && {
        label: invoice.order.number,
        href: `/orders/${invoice.order.id}`,
      },
      url: invoice.pdfUrl,
    })),
    ...creditNotes.map((note) => {
      const invoice = invoices.find((candidate) => candidate.id === note.invoiceId);
      return {
        id: `doc-${note.id}`,
        kind: "credit_note" as const,
        number: note.number,
        date: note.date,
        amountInPaise: note.amountInPaise,
        relatedTo: invoice && { label: invoice.number, href: invoice.pdfUrl },
        url: `/documents/credit-notes/${fileName(note.number)}.pdf`,
      };
    }),
    ...quotations.flatMap((quotation) =>
      quotation.attachments.map((attachment) => ({
        id: `doc-${attachment.id}`,
        kind: "quotation" as const,
        number: quotation.number,
        date: quotation.quotedAt ?? quotation.requestedAt,
        amountInPaise: quotation.totalInPaise ?? 0,
        relatedTo: { label: quotation.number, href: `/quotations/${quotation.id}` },
        url: attachment.url,
      })),
    ),
  ];
}

const normalise = (text: string) => text.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function getDocumentsMock({
  kind,
  q,
  from,
  to,
  sort = "date",
  order = "desc",
  page,
  pageSize,
}: DocumentFilters): Promise<Paginated<BusinessDocument>> {
  await simulateLatency();
  const matching = listDocuments().filter((document) => {
    const day = toIndiaDate(document.date);
    return (
      (!kind || document.kind === kind) &&
      (!q || normalise(document.number).includes(normalise(q))) &&
      (!from || day >= from) &&
      (!to || day <= to)
    );
  });
  return paginate(sortItems(matching, sort, order), page, pageSize);
}
