import { ENVIRONTMENT } from "../../config/environment.config";
import { get, put, post } from "../lib/request";
import type { StandardApiResponse } from "../models";
import type { CreateGroupBody, GroupType, UpdateGroupBody, UserReminderGroupType } from "../types";

const groupsApiRoute = `${ENVIRONTMENT.URL_BACKEND}/api/groups`;

/** POST /api/groups/create */
export function createGroup(body: CreateGroupBody) {
  return post(groupsApiRoute, "/", body, undefined, true);
}

export const userGroupsQueryKey = ["user-groups"];

export const groupDetailQueryKey = (groupId: string) => ["group", groupId];

/** GET /groups/get-user-groups */
export async function getUserGroups(): Promise<
  StandardApiResponse<{
    createdAt: string,
    id: string,
    role: string,
    updatedAt: string,
    user: string,
    remindersGroup: GroupType
  }[]>
> {
  const data = await get(groupsApiRoute, "/get-user-groups", undefined, true);
  return data;
}

/** GET /api/groups/:group_id */
export async function getGroup(
  groupId: string,
): Promise<StandardApiResponse<{ groupDetails: GroupType, groupMembers: UserReminderGroupType[] }>> {
  const data = await get(
    groupsApiRoute,
    `/${encodeURIComponent(groupId)}`,
    undefined,
    true,
  );
  return data;
}

/** PATCH /api/groups/:group_id */
export function updateGroup(groupId: string, body: UpdateGroupBody) {
  return put(
    groupsApiRoute,
    `/${encodeURIComponent(groupId)}`,
    body,
    undefined,
    true,
  );
}

/** POST /api/groups/:group_id/invite */
export function inviteToGroup(groupId: string, email: string) {
  return post(
    groupsApiRoute,
    `/${encodeURIComponent(groupId)}/invite`,
    { email },
    undefined,
    true,
  );
}

/** GET /api/groups/invited */
export async function getInvitedGroups(): Promise<StandardApiResponse<unknown>> {
  const data = await get(
    groupsApiRoute,
    `/invited`,
    undefined,
    true,
  );
  return data;
}
