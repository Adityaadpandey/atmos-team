# **Atmos-Team**

## **Overview**

**Atmos-Team** is a comprehensive, end-to-end solution crafted to enhance project planning, execution, and monitoring. It offers a wide array of robust features, including:

- **Task Management**
- **Team Collaboration**
- **Progress Tracking**

Designed to ensure an efficient workflow for teams of any size, **Atmos-Team** leverages cutting-edge technologies to deliver a responsive, scalable, and user-friendly experience. The core technologies include:

- **Next.js**
- **Tailwind CSS**
- **PostgreSQL**
- **Prisma**

These tools work together to create a platform that meets the dynamic needs of modern teams, streamlining their operations and boosting productivity.

---

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

---

## Environment Variables Setup

To run the project locally, you need to configure the following environment variables. Create a `.env` file in the root of your project and add these variables:

```env
# Database connection URL for PostgreSQL
DATABASE_URL=

# Clerk keys for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk authentication URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Steps to Configure:

1. **Database URL**: 
   - Obtain your PostgreSQL database connection URL and set it to `DATABASE_URL`.
   
2. **Clerk Keys**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/) to retrieve your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
   - These keys are essential for integrating Clerk's authentication services.

3. **Sign-in and Sign-up URLs**:
   - The `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` should point to the respective routes in your application for user sign-in and sign-up.

Ensure that these environment variables are correctly set up before starting the development server to avoid runtime errors.


---

## Scripts

Run these commands in the project directory:

- **Development**:  
  `bun run dev` – Starts the development server with Turbopack.

- **Build**:  
  `bun run build` – Generates Prisma client and builds the app for production.

- **Start**:  
  `bun run start` – Starts the app in production mode (run `build` first).

- **Linting**:  
  `bun run lint` – Lints the code with ESLint.

- **Formatting**:  
  `bun run format:check` – Checks code formatting with Prettier.  
  `bun run format:write` – Formats code with Prettier.

- **Database**:  
  `bun run db:generate` – Applies dev migrations and generates Prisma client.  
  `bun run db:migrate` – Deploys production migrations.  
  `bun run db:push` – Pushes schema changes without migration history.  
  `bun run db:studio` – Opens Prisma Studio GUI.


---

## How to Contribute

We welcome contributions to **Atmos-Team**! Whether you want to add a feature, fix a bug, or improve documentation, we appreciate your efforts.

### 1. **Fork the Repository**
   Start by forking the repository to your own GitHub account. Click the **Fork** button in the top right corner of the repository page.

### 2. **Clone the Repository**
   After forking, clone the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/learners-arc/atmos-team.git
   ```

### 3. **Create a New Branch**
   Create a new branch for your changes. Make sure the branch name is descriptive of the changes you're making:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### 4. **Make Changes**
   Make your desired changes in the code. If you're fixing a bug, add tests for the bug. If you're adding a new feature, write code that is easy to understand, modular, and well-documented.

### 5. **Commit Your Changes**
   Commit your changes with a clear, concise commit message that explains the "what" and "why" of your changes.
   ```bash
   git commit -m "Add a new feature or fix bug"
   ```

### 6. **Push Your Changes**
   Push your changes to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```

### 7. **Create a Pull Request**
   - Go to the original repository where you want to contribute.
   - Click on the **Pull Requests** tab.
   - Click the **New Pull Request** button.
   - Select your branch with the changes and create a pull request.
   
   Ensure the following:
   - The title of the pull request is clear and descriptive.
   - The description explains what the pull request does and why it's necessary.
   - If there are any issues related to the pull request, link them in the description using `#issue-number`.

### 8. **Stay Updated**
   The project is continually evolving, so make sure to stay updated with the latest changes by pulling the latest changes from the `main` branch:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

### 9. **Respect the Code of Conduct**
   Please make sure to follow the project's [Code of Conduct](./CHANGELOG.md) and ensure your contributions are respectful and considerate to all members of the community.

### 10. **Review and Discuss**
   Once your pull request is open, the project maintainers will review your changes. They may suggest improvements or ask for further clarifications. Please be responsive to feedback.

---

By following these steps, you'll be able to contribute effectively to the **Atmos-Team** project! Thank you for your interest in making the project better.
