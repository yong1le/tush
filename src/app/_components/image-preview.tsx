import { useEffect, useState } from "react";
import Image from "next/image";

const ImagePreview = ({ image }: { image: File }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(image);

    return () => {
      reader.abort();
    };
  }, [image]);

  return (
    <div
      className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] relative inline-block mx-2
        shrink-0"
    >
      {preview && (
        <Image
          src={preview}
          alt="Image"
          className="object-cover rounded-lg"
          fill={true}
        />
      )}
    </div>
  );
};

export default ImagePreview;
