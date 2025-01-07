import { useState } from "react";
import {
  type FileLocation,
  type JobOptions,
  JobStatus,
  type JobType,
} from "~/types";
import { trpc } from "~/trpc/client";

export const useImageProcessing = () => {
  // States
  const [state, setState] = useState<JobStatus>(JobStatus.IDLE);
  const [progress, setProgress] = useState<number>(0);

  // Trpc querys
  const { data: user } = trpc.user.getUser.useQuery();

  // TRPC mutations
  const generatePresignedPutUrls =
    trpc.s3.generatePresignedPutUrls.useMutation();
  const invokeLambda = trpc.lambda.invoke.useMutation();
  const checkObjectExists = trpc.s3.checkObjectExists.useMutation();
  const generatePresignedGetUrl = trpc.s3.generatePresignedGetUrl.useMutation();
  const createJob = trpc.job.createJob.useMutation();

  const waitForObject = (bucket: string, key: string) => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(() => {
        checkObjectExists
          .mutateAsync({ bucket, key })
          .then((result) => {
            if (result?.exists) {
              clearInterval(pollInterval);
              resolve(true);
            }
          })
          .catch((error) => {
            clearInterval(pollInterval);
            if (error instanceof Error) {
              reject(error);
            }
            reject(new Error("Failed to wait for object to exist"));
          });
      }, 4000);

      setTimeout(
        () => {
          clearInterval(pollInterval);
          reject(new Error("Timeout waiting for object to exist"));
        },
        2 * 60 * 1000, // 2 minutes
      );
    });
  };

  const upload = async (images: File[]) => {
    setState(JobStatus.UPLOADING);

    const locations = await generatePresignedPutUrls.mutateAsync({
      count: images.length,
    });

    return await Promise.all(
      images.map(async (image, i) => {
        const location = locations[i]!;
        const res = await fetch(location.url, {
          method: "PUT",
          body: image,
        });

        if (!res.ok) {
          console.error(`Failed to upload ${image.name}`);
          return undefined;
        }

        console.debug(`Uploaded ${image.name}`);

        setProgress((prev) => prev + 99 / images.length);

        return {
          bucket: location.bucket,
          key: location.key,
        };
      }),
    );
  };

  const process = async (
    imageLocations: FileLocation[],
    type: JobType,
    options: JobOptions,
  ) => {
    setState(JobStatus.PROCESSING);

    const { bucket, key } = await invokeLambda.mutateAsync({
      locations: imageLocations,
      type: type,
      options: options,
    });
    await waitForObject(bucket, key);

    return { bucket, key };
  };

  const startProcessing = async (
    files: File[],
    jobType: JobType,
    options: JobOptions,
  ) => {
    try {
      const imageLocations = await upload(files);

      const { bucket, key } = await process(
        imageLocations.filter((i) => i !== undefined),
        jobType,
        options,
      );

      const { url } = await generatePresignedGetUrl.mutateAsync({
        bucket,
        key,
      });

      setProgress(100);
      if (user?.id) {
        await createJob.mutateAsync({
          type: jobType,
          options: options,
          bucket: bucket,
          key: key,
        });
      }

      return url;
    } catch (e) {
      throw e;
    } finally {
      setState(JobStatus.IDLE);
      setProgress(0);
    }
  };

  return {
    state,
    progress,
    startProcessing,
    isLoading:
      state !== JobStatus.IDLE &&
      state !== JobStatus.COMPLETE &&
      state !== JobStatus.ERROR,
  };
};
