import { getAssignedTask } from "./actions/task/getAssignedTask";

const take = async () => {
  const d = await getAssignedTask({
    userId: "user_2rBY1f9KnjxH4n5k8CRMbaAqDnC",
  });
  console.log(d);
};
take();
