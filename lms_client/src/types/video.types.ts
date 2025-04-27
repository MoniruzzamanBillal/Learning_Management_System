// * for adding new video
export type TAddVideo = {
  video: FileList;
  title: string;
};

// * for adding updating video
export type TUpdateVideo = {
  video?: FileList;
  title?: string;
};
