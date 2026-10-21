import { OrderPaymentStatus } from "@/features/orders/components/OrderPaymentStatus";
import type { Order } from "@/features/orders/types";
import { PAYMENT_METHOD_LABELS } from "@/features/orders/utils";
import { BankTransferDetails } from "@/features/payments/components/BankTransferDetails";
import { formatPrice } from "@/lib/format";

/** How the order is paid, where the payment stands, and what to do if a transfer is due. */
export function OrderPaymentDetails({ order }: { order: Order }) {
  const { payment } = order;
  const isAwaitingTransfer = payment.method === "bank_transfer" && payment.status === "pending";

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="text-gray-500">Payment · {PAYMENT_METHOD_LABELS[payment.method]}</span>
      <OrderPaymentStatus payment={payment} />
      {payment.reference && (
        <span className="text-xs break-all text-gray-500">
          {payment.method === "razorpay" ? "Payment ID" : "UTR"} {payment.reference}
        </span>
      )}
      {payment.status === "refunded" && (
        <span className="text-xs text-gray-500">
          Refunded to the way you paid, in 5–7 working days.
        </span>
      )}
      {isAwaitingTransfer && (
        <div className="mt-1 flex flex-col gap-2">
          <p className="text-gray-700">
            Transfer {formatPrice(order.totalInPaise)} quoting {order.number}:
          </p>
          <BankTransferDetails />
        </div>
      )}
    </div>
  );
}
