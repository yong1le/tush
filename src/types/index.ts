export enum ImageFormat {
  PNG = "png",
  JPEG = "jpeg",
  WEBP = "webp",
}

export enum UpscaleFactor {
  TWO = "2",
  THREE = "3",
}

export enum JobStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  PROCESSING = "processing",
  DOWNLOADING = "downloading",
  COMPLETE = "complete",
  ERROR = "error",
}

export enum JobType {
  CONVERT = "convert",
  UPSCALE = "upscale",
}

export type FileLocation = {
  bucket: string;
  key: string;
};

export type JobOptions = { format: ImageFormat } | { scale: UpscaleFactor };

export interface LambdaPayload {
  input: {
    images: FileLocation[];
    type: JobType;
    options: JobOptions;
  };
  output: FileLocation;
}
