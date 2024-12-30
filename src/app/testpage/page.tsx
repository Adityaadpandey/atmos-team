"use server"; // Mark this as a server component

import { getAllTaskAndSubTask } from "../../actions/task"; // Import the server action
import { notFound } from "next/navigation"; // For handling 404 in Next.js

export default async function TaskPage() {
  const userId = "user_2qtK9Aq9H6imANRJouKPBx2sAIt"; // Hardcoded user ID for testing

  // Fetch tasks and subtasks using the server action
  let userTasks;
  try {
    userTasks = await getAllTaskAndSubTask(userId); // Use your server action to fetch tasks
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    notFound(); // Trigger 404 if something goes wrong
  }

  if (!userTasks || !userTasks.tasks.length) {
    notFound(); // If no tasks found for the user, trigger a 404
  }

  return (
    <div>
      <h1>Tasks for User {userId}</h1>
      {userTasks.tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>

          <div>
            <h3>Assignees:</h3>
            {task.assignees.map((assignee) => (
              <div key={assignee.id}>
                <p>
                  {assignee.name} ({assignee.email})
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3>Subtasks:</h3>
            {task.subTasks && task.subTasks.length > 0 ? (
              task.subTasks.map((subTask) => (
                <div key={subTask.id}>
                  <p>{subTask.title}</p>
                </div>
              ))
            ) : (
              <p>No subtasks for this task.</p>
            )}
          </div>

          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
}
