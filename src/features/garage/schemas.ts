import { z } from "zod";

import { requiredText } from "@/lib/validation";

const rupees = z
  .string()
  .trim()
  .regex(/^\d{1,6}(\.\d{1,2})?$/, "Enter a price in rupees, e.g. 899");

const wholeNumber = (message: string, max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .refine((value) => Number(value) >= 1 && Number(value) <= max, message);

export const MAX_GARAGE_PHOTOS = 8;

export const garageProfileSchema = z.object({
  about: z.string().trim().max(600, "Keep it to 600 characters or fewer"),
  photos: z
    .array(z.string())
    .min(1, "Add at least one photo of your garage")
    .max(MAX_GARAGE_PHOTOS, `Add up to ${MAX_GARAGE_PHOTOS} photos`),
  services: z
    .array(
      z.object({
        id: z.string(),
        name: requiredText("Name the service"),
        price: rupees,
        duration: wholeNumber("Enter minutes, from 5 to 600", 600).refine(
          (value) => Number(value) >= 5,
          "Enter minutes, from 5 to 600",
        ),
      }),
    )
    .min(1, "Add at least one service customers can book"),
  vehicleTypes: z
    .array(z.enum(["two_wheeler", "three_wheeler", "car", "commercial"]))
    .min(1, "Choose at least one vehicle type"),
  openingHours: z.array(
    z
      .object({
        day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
        isOpen: z.boolean(),
        opensAt: z.string(),
        closesAt: z.string(),
      })
      .refine((hours) => !hours.isOpen || hours.opensAt < hours.closesAt, {
        path: ["closesAt"],
        message: "Closing time must be after opening time",
      }),
  ),
  dailyBookingLimit: wholeNumber("Enter a number from 1 to 200", 200),
  holidays: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
      name: requiredText("Name the holiday"),
    }),
  ),
});

export type GarageProfileValues = z.infer<typeof garageProfileSchema>;
