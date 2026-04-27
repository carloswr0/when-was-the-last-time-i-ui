export const LOCAL_STORAGE_TOKEN = 'token';

export type GroupType = {
  id: string;
  title: string;
  description?: string | null;
  type: GroupTypeType;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UserType = {
  avatarUrl: string;
  createdAt: string;
  email: string;
  id: string;
  isVerified: boolean
  lastLoginAt: string;
  name: string;
  updatedAt: string;
}

export type UserReminderGroupType = {
  createdAt: string;
  id: string;
  remindersGroup: string;
  role: string;
  updatedAt: string;
  user: UserType
}

export const ReminderType = {
  one_time: "one_time",
  recurring: "recurring",
};

export type ReminderType = (typeof ReminderType)[keyof typeof ReminderType];

export type Reminders = {
  title: string;
  description: string;
  icon: string;
  bannerImage: string;
  type: ReminderType;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  frequency: number;
  pushNotificationsEnabled: boolean;
  id: string;
  remindersGroup: string;
}

export type GroupTypeType = "personal" | "shared";

export type CreateGroupBody = {
  title: string;
  description?: string;
  type: GroupTypeType;
};

export type CreateGroupReminderBody = {
  title: string;
  description?: string;
  icon?: string;
  bannerImage?: string;
  type: ReminderType;
  /** Hours between repeats for recurring; use 0 for one-time. */
  frequency: number;
  pushNotificationsEnabled: boolean;
};
