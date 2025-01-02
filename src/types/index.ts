export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  assignees: Assignee[];
  team: Team;
  timeline: Timeline[];
  // subTasks: SubTask[];
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "BACKLOG";

export interface TaskMain {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  subTasks: SubTask[];
  comments: Comment[];
  assignees: Assignee[];
  team: Team;
  timeline: Timeline[];
}

export interface SubTask {
  id: string;
  title: string;
  status: string;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  taskId: string;
  subTaskId: string;
  createdAt: Date;
}

export interface Assignee {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Timeline {
  id: string;
  previousTask: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    deadline: Date;
    status: string;
    teamId: string;
  };
  nextTask: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    deadline: Date;
    status: string;
    teamId: string;
  };
}
