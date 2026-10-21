type DataSource = "mock" | "api";

/**
 * Where each feature reads its data from. Flip one feature to "api" once its backend
 * endpoints are live; screens don't change. When every entry is "api", delete src/mocks/.
 */
export const dataSource = {
  auth: "mock",
  company: "mock",
  catalog: "mock",
  orders: "mock",
  returns: "mock",
  quotations: "mock",
  credit: "mock",
  payments: "mock",
  documents: "mock",
  garage: "mock",
  promotions: "mock",
  notifications: "mock",
} as const satisfies Record<string, DataSource>;
