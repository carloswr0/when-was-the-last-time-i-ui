import { ENVIRONTMENT } from "../../config/environment.config";
import { get, postFormData } from "../lib/request";
import type { StandardApiResponse } from "../models";
import type { UserType } from "../types";

export const userApiRoute = `${ENVIRONTMENT.URL_BACKEND}/api/user`;

export const userInvitedQueryKey = (userId: string) => ["user", userId, "invited"] as const;

/** POST /api/user/:user_id/avatar — multipart field `avatar` */
export async function uploadUserAvatar(
  userId: string,
  file: File,
): Promise<StandardApiResponse<UserType>> {
  const body = new FormData();
  body.append("avatar", file);
  const data = await postFormData(
    userApiRoute,
    `/${encodeURIComponent(userId)}/avatar`,
    body,
    true,
  );
  return data as StandardApiResponse<UserType>;
}
