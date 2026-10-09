import { getErrorMessage } from "@/lib/api-client";
import type { ActionResult } from "@/lib/types";

/** Runs a Server Action's work and turns any failure into a message the user can read. */
export async function toActionResult<T>(work: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}
