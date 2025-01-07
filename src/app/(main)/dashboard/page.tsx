import React from "react";
import DownloadOutputButton from "~/app/_components/download-output";
import { trpc } from "~/trpc/server";

const DashboardPage = async () => {
  const { jobs } = await trpc.job.getUserJobs();
  const user = await trpc.user.getUser();

  const jobTypeLookup = {
    onvert: "Convert",
    pscale: "Upscale",
  };

  return (
    <div className="m-2 md:m-10">
      <h1 className="text-3xl font-bold m-2">Welcome, {user?.name}</h1>
      <div className="flex flex-col">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-row justify-between border-secondary-light border-b py-2 items-center"
          >
            <p className="bg-info-light dark:bg-info-dark px-4 py-2 rounded-lg">
              {jobTypeLookup[job.jobType as unknown as "onvert" | "pscale"]}
            </p>
            <div>
              {Object.entries(job.options).map(([key, value]) => (
                <div key={key} className="flex flex-row">
                  <span>
                    {key}: {value}
                  </span>
                </div>
              ))}
            </div>
            <DownloadOutputButton
              bucket={job.output.bucket}
              prefixKey={job.output.key}
            >
              Download
            </DownloadOutputButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
