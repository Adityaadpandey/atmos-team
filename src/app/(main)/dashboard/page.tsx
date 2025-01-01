'use client';

import { getAllTaskAndSubTask } from '@/actions/task';
import { Task } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const Page = () => {
  const { isLoaded, userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      if (!userId) {
        setError('User ID is not available.');
        setLoading(false);
        return;
      }

      try {
        const data = await getAllTaskAndSubTask(userId);
        console.log(data);
        setTasks(data.tasks as Task[]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching tasks and subtasks.');
        setLoading(false);
      }
    };

    if (isLoaded && userId) {
      fetchAuth();
    }
  }, [isLoaded, userId]);

  if (loading) {
    return <div className="text-center text-lg text-red-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-y-auto">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Dashboard</h1>
      {tasks.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:scale-105 transition-transform duration-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900">{task.title}</h2>
              <p className="text-gray-600 mt-2">{task.description}</p>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">Subtasks</h3>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  {task.subTasks.map((subTask) => (
                    <li key={subTask.id} className="hover:text-teal-500 cursor-pointer">
                      {subTask.title}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">Assignees</h3>
                <ul className="pl-5 mt-2 text-gray-700">
                  {task.assignees.map((assignee) => (
                    <li key={assignee.id} className="hover:text-blue-500 cursor-pointer">
                      {assignee.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
