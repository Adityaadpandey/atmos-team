#Atmos-Team

## Overview

## Generator and Datasource

- **Generator**: Specifies the Prisma Client generator, which allows for interaction with the database.
- **Datasource**: Defines the PostgreSQL database as the data source, with the connection URL managed through an environment variable `DATABASE_URL`.

## Models

### User Model

- Represents users of the system with attributes like `id`, `name`, `email`, `role`, and various relationships to tasks, teams, comments, notifications, and workspaces.

### Workspace Model

- Represents workspaces where teams collaborate. Contains attributes such as `id`, `name`, and relationships with members and teams.

### WorkspaceMember Model

- A join table for many-to-many relationships between `User` and `Workspace`, specifying the user's role in the workspace.

### Team Model

- Represents teams with attributes like `id`, `name`, `description`, and relationships to members, tasks, and settings.

### TeamMember Model

- A join table for many-to-many relationships between `User` and `Team`, with additional attributes like `role` and `joinedAt`.

### WorkspaceTeam Model

- A join table for many-to-many relationships between `Workspace` and `Team`.

### TeamSettings Model

- Contains settings for a team, such as `defaultAssignee`, `visibility`, and `autoAssignment`.

### Task Model

- Represents tasks assigned to users and teams, with attributes such as `title`, `description`, `priority`, `status`, and relationships to subtasks, comments, and attachments.

### SubTask Model

- Represents subtasks that are part of a larger `Task`, with attributes like `title`, `description`, `status`, and `priority`.

### Comment Model

- Represents comments on tasks or subtasks, including attributes like `text`, `author`, and `replies`.

### Notification Model

- Represents notifications sent to users, with attributes like `type`, `title`, `message`, and `isRead` status.

### Attachment Model

- Represents file attachments to tasks or comments, with attributes like `name`, `url`, `type`, and `size`.

## Enums

Enumerations are used to define fixed sets of values for various fields, such as:

- `TaskStatus`: The status of a task (e.g., TODO, IN_PROGRESS).
- `Priority`: The priority of a task (e.g., LOW, MEDIUM).
- `Role`: Roles that users can have (e.g., ADMIN, USER).
- `Visibility`: Visibility settings for teams or tasks (e.g., PUBLIC, PRIVATE).

## Usage

- Run `prisma generate` to generate the Prisma Client.
- Use `prisma migrate` commands to apply schema changes to the PostgreSQL database.
- Use the Prisma Client in your application to perform CRUD operations on the defined models.
