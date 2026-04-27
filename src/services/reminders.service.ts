import { ENVIRONTMENT } from "../../config/environment.config";
import { get, post } from "../lib/request";
import type { StandardApiResponse } from "../models";
import type { CreateGroupReminderBody, Reminders } from "../types";

const groupsApiRoute = `${ENVIRONTMENT.URL_BACKEND}/api/groups`;
const userApiRoute = `${ENVIRONTMENT.URL_BACKEND}/api/user`;

export const groupRemindersQueryKey = (groupId: string) => ["group", groupId, "reminders"];

export const userRemindersQueryKey = (userId: string) => ["user", userId, "all-reminders"];

/** GET /api/groups/:group_id/reminder */
export async function getAllGroupReminders(
  groupId: string,
): Promise<StandardApiResponse<{ reminders: Reminders[] }>> {
  const data = await get(groupsApiRoute, `/${encodeURIComponent(groupId)}/reminder`,
    undefined,
    true,
  );
  return data;
}

/** POST /api/groups/:group_id/reminder */
export function createGroupReminder(groupId: string, body: CreateGroupReminderBody) {
  return post(
    groupsApiRoute,
    `/${encodeURIComponent(groupId)}/reminder`,
    body,
    undefined,
    true,
  );
}

/** GET /api/user/:user_id/get-all-reminders */
export async function getAllUserReminders(
  userId: string,
): Promise<StandardApiResponse<{ reminders: Reminders[] }>> {
  const data = await get(
    userApiRoute,
    `/${encodeURIComponent(userId)}/get-all-reminders`,
    undefined,
    true,
  );
  return data;
}
