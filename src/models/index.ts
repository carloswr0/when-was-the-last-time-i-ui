import type { ErrorCode } from "../constants/error-codes";

// ALL OF THESE MUST MATCH API TYPES, IF YOU CHANGE ANYTHING FROM HERE, CHANGE IT IN THE API AS WELL.

export type StandardApiResponse<T = unknown> = {
  success: boolean;
  message: string | null;
  data: T | null;
  error: ApiErrorBody | null;
  meta: Record<string, unknown>;
};

export type ApiErrorBody = {
  code: ErrorCode;
  details: FieldErrorDetail[];
};

export type FieldErrorDetail = {
  field: string;
  message: string;
};

// ALL OF THESE MUST MATCH API TYPES, IF YOU CHANGE ANYTHING FROM HERE, CHANGE IT IN THE API AS WELL.