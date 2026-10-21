import type { BranchReport, ReportFilters } from "@/features/reports/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getBranchReportMock } from "@/mocks/reports";

export async function getBranchReport(filters: ReportFilters): Promise<BranchReport> {
  if (dataSource.reports === "mock") return getBranchReportMock(filters);
  return apiClient<BranchReport>("/garage/reports", { query: filters });
}
