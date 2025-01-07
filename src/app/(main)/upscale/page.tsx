import ImageDropzone from "~/app/_components/image-dropzone";
import { JobType } from "~/types";

const UpscalePage = () => {
  return (
    <div className="h-full flex flex-col gap-2 text-center">
      <h1 className="text-3xl font-bold">Upscale Image</h1>
      <p>Increase image resolution</p>
      <ImageDropzone jobType={JobType.UPSCALE} />
    </div>
  );
};

export default UpscalePage;
