import type { Customer, CustomerVehicle, ServiceVisit } from "@/features/customers/types";
import { daysFromToday, findById, simulateLatency } from "@/mocks/utils";

type CustomerSeed = Omit<Customer, "createdAt"> & { joinedDay: number };

const customer = ({ joinedDay, ...seed }: CustomerSeed): Customer => ({
  ...seed,
  createdAt: daysFromToday(joinedDay, 11),
});

export const customers: Customer[] = [
  customer({
    id: "cus-arjun",
    name: "Arjun Rao",
    phone: "+919845022918",
    hasAppAccount: true,
    joinedDay: -410,
  }),
  customer({
    id: "cus-priya",
    name: "Priya Menon",
    phone: "+919886177240",
    email: "priya.menon@example.com",
    hasAppAccount: true,
    joinedDay: -260,
  }),
  customer({
    id: "cus-suresh",
    name: "Suresh Gowda",
    phone: "+919901445512",
    hasAppAccount: false,
    joinedDay: -720,
  }),
  customer({
    id: "cus-faisal",
    name: "Faisal Ahmed",
    phone: "+919742066381",
    hasAppAccount: true,
    joinedDay: -190,
  }),
  customer({
    id: "cus-lakshmi",
    name: "Lakshmi Narayan",
    phone: "+919880312774",
    hasAppAccount: false,
    joinedDay: -540,
  }),
  customer({
    id: "cus-rahul",
    name: "Rahul Shetty",
    phone: "+919632918044",
    email: "rahul.s@example.com",
    hasAppAccount: true,
    joinedDay: -120,
  }),
  customer({
    id: "cus-ananya",
    name: "Ananya Iyer",
    phone: "+919591244806",
    hasAppAccount: true,
    joinedDay: -75,
  }),
  customer({
    id: "cus-irfan",
    name: "Mohammed Irfan",
    phone: "+919845730162",
    hasAppAccount: false,
    joinedDay: -330,
  }),
  customer({
    id: "cus-deepak",
    name: "Deepak Kulkarni",
    phone: "+919008811527",
    hasAppAccount: true,
    joinedDay: -45,
  }),
  customer({
    id: "cus-kavya",
    name: "Kavya Reddy",
    phone: "+919731552098",
    hasAppAccount: true,
    joinedDay: -30,
  }),
  customer({
    id: "cus-vinod",
    name: "Vinod Kumar",
    phone: "+919448207731",
    hasAppAccount: false,
    joinedDay: -2,
  }),
  customer({
    id: "cus-sneha",
    name: "Sneha Pillai",
    phone: "+919880945563",
    hasAppAccount: true,
    joinedDay: -600,
  }),
];

const vehicle = (
  id: string,
  customerId: string,
  plate: string,
  make: string,
  model: string,
  year: number,
): CustomerVehicle => ({ id, customerId, plate, type: "two_wheeler", make, model, year });

export const vehicles: CustomerVehicle[] = [
  vehicle("veh-arjun-activa", "cus-arjun", "KA 03 MK 2291", "Honda", "Activa 6G", 2021),
  vehicle("veh-priya-ntorq", "cus-priya", "KA 51 ER 7712", "TVS", "Ntorq 125", 2022),
  vehicle("veh-suresh-pulsar", "cus-suresh", "KA 05 HN 4410", "Bajaj", "Pulsar 150", 2019),
  vehicle("veh-suresh-splendor", "cus-suresh", "KA 05 JC 1187", "Hero", "Splendor Plus", 2017),
  vehicle(
    "veh-faisal-classic",
    "cus-faisal",
    "KA 01 MR 6620",
    "Royal Enfield",
    "Classic 350",
    2023,
  ),
  vehicle("veh-lakshmi-jupiter", "cus-lakshmi", "KA 53 EN 3309", "TVS", "Jupiter", 2020),
  vehicle("veh-rahul-duke", "cus-rahul", "KA 03 NB 8854", "KTM", "Duke 200", 2022),
  vehicle("veh-ananya-dio", "cus-ananya", "KA 51 HX 2045", "Honda", "Dio", 2023),
  vehicle("veh-irfan-apache", "cus-irfan", "KA 04 KD 7781", "TVS", "Apache RTR 160", 2021),
  vehicle(
    "veh-deepak-himalayan",
    "cus-deepak",
    "KA 50 Q 9123",
    "Royal Enfield",
    "Himalayan 411",
    2020,
  ),
  vehicle("veh-kavya-access", "cus-kavya", "KA 01 JT 5532", "Suzuki", "Access 125", 2024),
  vehicle("veh-vinod-fz", "cus-vinod", "KA 02 HP 6690", "Yamaha", "FZ-S", 2018),
  vehicle("veh-sneha-activa", "cus-sneha", "KA 53 HE 1478", "Honda", "Activa 6G", 2020),
];

/**
 * Visits to other garages, which the vehicle's history shows without prices. They come from
 * other SpareX garages the vehicle visited (matched by plate).
 */
export const otherGarageVisits: (ServiceVisit & { vehicleId: string })[] = [
  {
    id: "ext-1",
    vehicleId: "veh-deepak-himalayan",
    date: daysFromToday(-210, 12),
    garageName: "Hill Riders Garage, Mysuru",
    summary: "General service, chain kit replaced",
    odometerKm: 21450,
  },
  {
    id: "ext-2",
    vehicleId: "veh-vinod-fz",
    date: daysFromToday(-95, 15),
    garageName: "Quick Wheels, Yelahanka",
    summary: "Clutch plates and cable",
    odometerKm: 38210,
  },
  {
    id: "ext-3",
    vehicleId: "veh-rahul-duke",
    date: daysFromToday(-160, 10),
    garageName: "KTM Service Centre, Indiranagar",
    summary: "Free service (3rd), software update",
    odometerKm: 9020,
  },
];

const normalisePlate = (plate: string) => plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** The vehicle with this number plate and its owner, ignoring spaces and case. */
export async function findVehicleByPlateMock(plate: string) {
  await simulateLatency(300);
  const vehicle = vehicles.find((v) => normalisePlate(v.plate) === normalisePlate(plate));
  return vehicle ? { vehicle, customer: findById(customers, vehicle.customerId) } : null;
}
