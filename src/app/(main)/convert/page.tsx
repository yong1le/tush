import ImageDropzone from "~/app/_components/image-dropzone";
import { JobType } from "~/types";

const ConvertPage = () => {
  return (
    <div className="h-full flex flex-col gap-2 text-center">
      <h1 className="text-3xl font-bold">Convert Image</h1>
      <p>Convert images to different formats</p>
      <ImageDropzone jobType={JobType.CONVERT} />
    </div>
  );
};

export default ConvertPage;
