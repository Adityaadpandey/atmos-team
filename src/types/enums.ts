// ===== ENUMS =====
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
  BACKLOG = "BACKLOG",
  CANCELLED = "CANCELLED",
}

export enum ViewType {
  LIST = "LIST",
  BOARD = "BOARD",
  CALENDAR = "CALENDAR",
  TIMELINE = "TIMELINE",
  GANTT = "GANTT",
}

export enum WorkspaceRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  TEAM_LEADER = "TEAM_LEADER",
  MANAGER = "MANAGER",
  VIEWER = "VIEWER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  AWAY = "AWAY",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
}

export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_COMPLETED = "TASK_COMPLETED",
  COMMENT_ADDED = "COMMENT_ADDED",
  DEADLINE_APPROACHING = "DEADLINE_APPROACHING",
  TEAM_INVITATION = "TEAM_INVITATION",
  MENTION = "MENTION",
}

export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK",
  SYSTEM = "SYSTEM",
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  TEAM_ONLY = "TEAM_ONLY",
}
