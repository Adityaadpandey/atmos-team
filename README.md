# Atmos-Team

## Overview

## Generator and Datasource

- **Generator**: Specifies the Prisma Client generator, which allows for interaction with the database.
- **Datasource**: Defines the PostgreSQL database as the data source, with the connection URL managed through an environment variable `DATABASE_URL`.

---

## Models

<details>
  <summary><strong>User Model</strong></summary>
  
  Represents the users of the system. Attributes include:
  
  - **id**
  - **name**
  - **email**
  - **role**
  
  **Relationships**:
  - `tasks`
  - `teams`
  - `comments`
  - `notifications`
  - `workspaces`

</details>

<details>
  <summary><strong>Workspace Model</strong></summary>
  
  Represents collaborative workspaces. Attributes include:
  
  - **id**
  - **name**
  
  **Relationships**:
  - `members`
  - `teams`

</details>

<details>
  <summary><strong>WorkspaceMember Model</strong></summary>
  
  Join table for the many-to-many relationship between `User` and `Workspace`. Attributes include:
  
  - **userId**
  - **workspaceId**
  - **role**

</details>

<details>
  <summary><strong>Team Model</strong></summary>
  
  Represents teams within a workspace. Attributes include:
  
  - **id**
  - **name**
  - **description**
  
  **Relationships**:
  - `members`
  - `tasks`
  - `settings`

</details>

<details>
  <summary><strong>TeamMember Model</strong></summary>
  
  Join table for the many-to-many relationship between `User` and `Team`. Additional attributes include:
  
  - **role**
  - **joinedAt**

</details>

<details>
  <summary><strong>WorkspaceTeam Model</strong></summary>
  
  Join table for the many-to-many relationship between `Workspace` and `Team`.

</details>

<details>
  <summary><strong>TeamSettings Model</strong></summary>
  
  Contains settings for teams. Attributes include:
  
  - **defaultAssignee**
  - **visibility**
  - **autoAssignment**

</details>

<details>
  <summary><strong>Task Model</strong></summary>
  
  Represents individual tasks assigned to users or teams. Attributes include:
  
  - **title**
  - **description**
  - **priority**
  - **status**
  
  **Relationships**:
  - `subtasks`
  - `comments`
  - `attachments`

</details>

<details>
  <summary><strong>SubTask Model</strong></summary>
  
  Represents subtasks under a main task. Attributes include:
  
  - **title**
  - **description**
  - **status**
  - **priority**

</details>

<details>
  <summary><strong>Comment Model</strong></summary>
  
  Represents comments on tasks or subtasks. Attributes include:
  
  - **text**
  - **author**
  - **replies**

</details>

<details>
  <summary><strong>Notification Model</strong></summary>
  
  Represents notifications sent to users. Attributes include:
  
  - **type**
  - **title**
  - **message**
  - **isRead**

</details>

<details>
  <summary><strong>Attachment Model</strong></summary>
  
  Represents file attachments to tasks or comments. Attributes include:
  
  - **name**
  - **url**
  - **type**
  - **size**

</details>

