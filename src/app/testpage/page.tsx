"use client";

import { useState } from "react";
import { createSubTask } from "@/actions/subtask/createSubTask"; // Correct path if needed

export default function AddDeviceForm() {
  const [state, setState] = useState({
    taskId: "cm59m7yt30000iujtnlr77mne",
    title: "",
  });
  const [loading, setLoading] = useState(false); // To show a loading spinner
  const [error, setError] = useState<string | null>(null); // To handle errors
  const [success, setSuccess] = useState<string | null>(null); // For success message

  // Handle changes in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState((prevState) => ({ ...prevState, [id]: value }));
  };

  // Handle form submission
  const formAction = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Basic client-side validation
    if (!state.taskId || !state.title) {
      setError("Task ID and Device Name are required.");
      return;
    }

    setError(null); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      // Pass the state values to createSubTask
      const subTask = await createSubTask({
        taskId: state.taskId,
        title: state.title,
      });
      console.log("Subtask created:", subTask);

      // Show success message and reset form
      setSuccess("Device added successfully!");
      setState({ taskId: "", title: "" });
    } catch (error) {
      console.error("Error creating subtask:", error);
      setError("An error occurred while creating the device.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="mx-auto mt-[120px] max-w-lg rounded-md bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-semibold">Add a Device</h2>
      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-500">{success}</div>}

      <form onSubmit={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="task-id"
            className="block text-sm font-medium text-gray-700"
          >
            Task ID:
          </label>
          <input
            id="task-id"
            type="text"
            value={state.taskId}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Device Name:
          </label>
          <input
            id="title"
            type="text"
            value={state.title}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className={`mt-4 w-full rounded-md py-2 font-semibold text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } focus:ring-2 focus:ring-blue-500`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Device"}
          </button>
        </div>
      </form>
    </div>
  );
}
