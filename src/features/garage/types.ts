import type { VehicleType } from "@/features/catalog/types";
import type { Branch } from "@/features/company/types";

/** A service the garage offers its own customers, at the garage's own price. */
export type GarageService = {
  id: string;
  name: string;
  /** The garage's price, excluding GST. */
  priceInPaise: number;
  /** About how long it takes, for booking slots. */
  durationMinutes: number;
};

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHours = {
  day: Weekday;
  isOpen: boolean;
  /** "HH:mm", 24-hour. */
  opensAt: string;
  closesAt: string;
};

export type Holiday = {
  /** "YYYY-MM-DD". */
  date: string;
  name: string;
};

/** How the garage appears to customers booking a service. The same for every branch. */
export type GarageProfile = {
  about: string;
  photos: string[];
  services: GarageService[];
  vehicleTypes: VehicleType[];
  openingHours: DayHours[];
  /** Bookings accepted per branch per day. */
  dailyBookingLimit: number;
  holidays: Holiday[];
};

/** A branch as the garage sees it, with how many staff work there. */
export type GarageBranch = Branch & { staffCount: number };
