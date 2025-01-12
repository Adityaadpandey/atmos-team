"use client";

import { useEffect, useState } from "react";
import { getLatestTask } from "@/actions/cron-tasks";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getLatestTask().then((res) => setData(res));
  }, []);
  return (
    <div>
      <h1>Latest Task</h1>
      <ul>
        {data.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
