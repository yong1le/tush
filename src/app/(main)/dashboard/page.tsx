import React from "react";
import { trpc } from "~/trpc/server";

const Dashboard = () => {
  const username = trpc.user.getName();
  return (
    <div>
      <div>Welcome {username}</div>
    </div>
  );
};
export default Dashboard;
