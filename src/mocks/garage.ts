import type { GarageBranch, GarageProfile } from "@/features/garage/types";
import { branches, companyUsers } from "@/mocks/company";
import { simulateLatency } from "@/mocks/utils";

const weekday = (day: GarageProfile["openingHours"][number]["day"], isOpen = true) => ({
  day,
  isOpen,
  opensAt: "09:00",
  closesAt: "19:30",
});

let garageProfile: GarageProfile = {
  about:
    "Two-wheeler specialists since 2009. Factory-trained mechanics for Honda, Bajaj, TVS, KTM and Royal Enfield, genuine parts, and a free wash with every general service.",
  photos: [
    "/images/garage/workshop-1.jpg",
    "/images/garage/workshop-3.jpg",
    "/images/garage/tools.jpg",
  ],
  services: [
    {
      id: "svc-general",
      name: "General service (up to 150 cc)",
      priceInPaise: 899_00,
      durationMinutes: 120,
    },
    {
      id: "svc-general-plus",
      name: "General service (150–400 cc)",
      priceInPaise: 1_499_00,
      durationMinutes: 180,
    },
    { id: "svc-oil", name: "Engine oil change", priceInPaise: 249_00, durationMinutes: 30 },
    {
      id: "svc-brakes",
      name: "Brake pad or shoe replacement (labour)",
      priceInPaise: 299_00,
      durationMinutes: 45,
    },
    {
      id: "svc-chain",
      name: "Chain clean, lube and adjust",
      priceInPaise: 199_00,
      durationMinutes: 30,
    },
    {
      id: "svc-chain-kit",
      name: "Chain sprocket kit fitting (labour)",
      priceInPaise: 599_00,
      durationMinutes: 60,
    },
    {
      id: "svc-electrical",
      name: "Electrical check and repair",
      priceInPaise: 349_00,
      durationMinutes: 60,
    },
    { id: "svc-wash", name: "Foam wash and polish", priceInPaise: 249_00, durationMinutes: 40 },
  ],
  vehicleTypes: ["two_wheeler"],
  openingHours: [
    weekday("mon"),
    weekday("tue"),
    weekday("wed"),
    weekday("thu"),
    weekday("fri"),
    weekday("sat"),
    { day: "sun", isOpen: true, opensAt: "09:00", closesAt: "13:30" },
  ],
  dailyBookingLimit: 18,
  holidays: [
    { date: "2026-11-01", name: "Karnataka Rajyotsava" },
    { date: "2026-11-08", name: "Deepavali" },
    { date: "2026-12-25", name: "Christmas" },
  ],
};

export async function getGarageProfileMock(): Promise<GarageProfile> {
  await simulateLatency();
  return garageProfile;
}

export async function updateGarageProfileMock(profile: GarageProfile): Promise<GarageProfile> {
  await simulateLatency(700);
  garageProfile = profile;
  return garageProfile;
}

export async function getGarageBranchesMock(): Promise<GarageBranch[]> {
  await simulateLatency();
  return branches.map((branch) => ({
    ...branch,
    staffCount: companyUsers.filter(
      (user) => user.branchId === branch.id && user.status !== "disabled",
    ).length,
  }));
}
