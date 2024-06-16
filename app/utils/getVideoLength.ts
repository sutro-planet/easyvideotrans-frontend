export const getVideoLengthByUploadFile: (
  file: File,
) => Promise<number> = async (file: File) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      reject();
    };

    video.src = URL.createObjectURL(file);
  });
};
