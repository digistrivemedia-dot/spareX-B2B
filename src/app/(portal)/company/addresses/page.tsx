import type { Metadata } from "next";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { getBranches } from "@/features/company/api";
import { AddBranchButton } from "@/features/company/components/AddBranchButton";
import { AddressList } from "@/features/company/components/AddressList";

export const metadata: Metadata = {
  title: "Delivery addresses",
};

export default async function AddressesPage() {
  const branches = await getBranches();

  return (
    <section>
      <SectionHeader title="Delivery addresses" action={<AddBranchButton label="Add address" />} />
      <p className="mb-4 text-sm text-gray-500">
        Choose one of these at checkout or from &quot;Deliver to&quot; in the top bar. The main
        address is the default.
      </p>
      <AddressList branches={branches} />
    </section>
  );
}
