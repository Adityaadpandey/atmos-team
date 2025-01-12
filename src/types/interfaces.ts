// ===== USER INTERFACE =====
export interface User {
  id: string;
  name: string;
  imageUrl?: string;
  email: string;
  role: Role;
  teams: Team[];
  ownedTeams: Team[];
  tasks: Task[];
  createdTasks: Task[];
  comments: Comment[];
  notifications: Notification[];
  settings?: UserSettings;
  status: UserStatus;
  department?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  managedTeamSettings: TeamSettings[];
  taskViews: TaskView[];
  workspaces: WorkspaceMember[];
  activityLogs: ActivityLog[];
  subTasks: SubTask[];
  teamSettings: TeamSettings[];
}

// ===== USER SETTINGS INTERFACE =====
export interface UserSettings {
  id: string;
  user: User;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: Theme;
  language: string;
  timeZone: string;
  workingHours?: WorkingHours;
  defaultView: ViewType;
}

// ===== WORKING HOURS INTERFACE =====
export interface WorkingHours {
  id: string;
  userSettings: UserSettings;
  settingsId: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

// ===== WORKSPACE INTERFACE =====
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: WorkspaceMember[];
  teams: Team[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== WORKSPACE MEMBER INTERFACE =====
export interface WorkspaceMember {
  id: string;
  workspace: Workspace;
  workspaceId: string;
  user: User;
  userId: string;
  role: WorkspaceRole;
  createdAt: Date;
  updatedAt: Date;
}

// ===== TASK VIEW INTERFACE =====
export interface TaskView {
  id: string;
  name: string;
  type: ViewType;
  filters?: Record<string, any>;
  sorting?: Record<string, any>;
  user: User;
  userId: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== ACTIVITY LOG INTERFACE =====
export interface ActivityLog {
  id: string;
  user: User;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ===== TEAM INTERFACE =====
export interface Team {
  id: string;
  name: string;
  description?: string;
  owner: User;
  ownerId: string;
  members: User[];
  tasks: Task[];
  isArchived: boolean;
  settings?: TeamSettings;
  department?: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  workspace: Workspace[];
}

// ===== TEAM SETTINGS INTERFACE =====
export interface TeamSettings {
  id: string;
  team: Team;
  teamId: string;
  defaultAssignee?: User;
  defaultAssigneeId?: string;
  visibility: Visibility;
  autoAssignment: boolean;
  users: User[]; // Managers
}

// ===== TASK INTERFACE =====
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  deadline?: Date;
  status: TaskStatus;
  assignees: User[];
  creator: User;
  creatorId: string;
  teamId?: string;
  team?: Team;
  subTasks: SubTask[];
  comments: Comment[];
  timeline: Timeline[];
  relatedTasks: Task[];
  prerequisiteOf: Task[];
  tags: Tag[];
  attachments: Attachment[];
  estimatedHours?: number;
  actualHours?: number;
  isArchived: boolean;
  startDate?: Date;
  completedAt?: Date;
  previousTasks: Timeline[];
  nextTasks: Timeline[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== SUBTASK INTERFACE =====
export interface SubTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  parentTask: Task;
  taskId: string;
  assignee?: User;
  assigneeId?: string;
  comments: Comment[];
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== COMMENT INTERFACE =====
export interface Comment {
  id: string;
  text: string;
  author: User;
  authorId: string;
  task?: Task;
  taskId?: string;
  subTask?: SubTask;
  subTaskId?: string;
  attachments: Attachment[];
  parentComment?: Comment;
  parentId?: string;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== NOTIFICATION INTERFACE =====
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  user: User;
  userId: string;
  isRead: boolean;
  createdAt: Date;
}

// ===== ATTACHMENT INTERFACE =====
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  task?: Task;
  taskId?: string;
  comment?: Comment;
  commentId?: string;
  createdAt: Date;
}

// ===== TAG INTERFACE =====
export interface Tag {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  teams: Team[];
  createdAt: Date;
}

// ===== SKILL INTERFACE =====
export interface Skill {
  id: string;
  name: string;
  users: User[];
  createdAt: Date;
}

// ===== TIMELINE INTERFACE =====
export interface Timeline {
  id: string;
  task: Task;
  taskId: string;
  previousTask?: Task;
  previousTaskId?: string;
  nextTask?: Task;
  nextTaskId?: string;
}
