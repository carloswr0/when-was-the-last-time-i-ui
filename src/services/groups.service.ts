import { ENVIRONTMENT } from "../../config/environment.config";
import { get, post } from "../lib/request";
import type { StandardApiResponse } from "../models";

const groupsApiRoute = `${ENVIRONTMENT.URL_BACKEND}/api/groups`;

export type GroupType = "personal" | "shared";

export type CreateGroupBody = {
  title: string;
  description?: string;
  type: GroupType;
};

/** POST /api/groups/create */
export function createGroup(body: CreateGroupBody) {
  return post(groupsApiRoute, "/", body, undefined, true);
}

export type UserGroupListItem = {
  id: string;
  title: string;
  description?: string | null;
  type: GroupType;
};

export const userGroupsQueryKey = ["user-groups"];

/** GET /groups/get-user-groups */
export async function getUserGroups(): Promise<
  StandardApiResponse<{
    createdAt: string,
    id: string,
    role: string,
    updatedAt: string,
    user: string,
    remindersGroup: UserGroupListItem
  }[]>
> {
  const data = await get(groupsApiRoute, "/get-user-groups", undefined, true);
  return data;
}

/** GET /api/groups/:group_id */
export function getGroup(groupId: string) {
  return get(groupsApiRoute, `/${encodeURIComponent(groupId)}`, undefined, true);
}
