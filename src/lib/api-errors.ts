import { HttpError } from "./request";

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
