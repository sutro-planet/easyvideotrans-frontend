import { axiosClient } from '@/app/request/axiosClient';
import { REQUEST_ENUM } from '@/app/const/request';
import { IGenerateTTSProp, ITranslateSrtIProp } from '@/app/type';

export const handleDownloadVideo = (video_id: string) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.downloadVideo,
    { video_id },
  );
};

export const handleDownloadVideoThumbnail = async (
  video_id: string,
): Promise<string> => {
  try {
    const response = await axiosClient.post(
      REQUEST_ENUM.downloadVideoThumbnail,
      { video_id },
      { responseType: 'blob' },
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Failed to download video thumbnail:', error);
    throw error;
  }
};

export const handleExtractAudio = (video_id: string) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.extractAudio,
    { video_id },
  );
};
export const voiceAudioConnect = (video_id: string) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.voiceConnect,
    { video_id },
  );
};
export const videoPreview = (video_id: string) => {
  return axiosClient.post<{
    queue_length: any;
    video_preview_task_id: string;
    message: string;
  }>(REQUEST_ENUM.videoPreview, { video_id });
};

export const videoPreviewStatus = (task_id: string) => {
  return axiosClient.get<{ state: string; status: string }>(
    REQUEST_ENUM.videoPreviewStatus + '/' + task_id,
  );
};

export const removeAudioBg = (video_id: string) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.removeAudioBg,
    { video_id },
  );
};
export const extractSourceSrt = (video_id: string) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.extractSourceSrt,
    { video_id },
  );
};

export const translateSrt = (data: ITranslateSrtIProp) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.translateSrt,
    data,
  );
};
export const generateTTS = (data: IGenerateTTSProp) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.generateTTS,
    data,
  );
};

export const generateFishTTS = (data: IGenerateTTSProp) => {
  return axiosClient.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.generateFishTTS,
    data,
    {
      timeout: 3600 * 1000,
    },
  );
};

/**
 * Download Original English SRT
 */
export const handleDownloadOriginalSrt = async (
  video_id: string,
): Promise<string> => {
  try {
    const response = await axiosClient.get(
      `${REQUEST_ENUM.downloadOriginalSrt}/${video_id}`,
      {
        responseType: 'blob',
      },
    );
    return await response.data.text();
  } catch (error) {
    console.error('Failed to download original SRT:', error);
    throw error;
  }
};

/**
 * Upload Original English SRT
 */
export const handleUploadOriginalSrt = async (
  video_id: string,
  content: string,
) => {
  try {
    const formData = new FormData();
    formData.append('video_id', video_id);

    // Create a File object with a proper filename
    const file = new File([content], `${video_id}_en_merged.srt`, {
      type: 'text/plain',
    });
    formData.append('file', file);

    const response = await axiosClient.post(
      REQUEST_ENUM.uploadOriginalSrt,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to upload original SRT:', error);
    throw error;
  }
};

/**
 * Download Translated Chinese SRT
 */
export const handleDownloadTranslatedSrt = async (
  video_id: string,
): Promise<string> => {
  try {
    const response = await axiosClient.get(
      `${REQUEST_ENUM.downloadTranslatedSrt}/${video_id}`,
      {
        responseType: 'blob',
      },
    );
    return await response.data.text();
  } catch (error) {
    console.error('Failed to download translated SRT:', error);
    throw error;
  }
};

/**
 * Upload Translated Chinese SRT
 */
export const handleUploadTranslatedSrt = async (
  video_id: string,
  content: string,
) => {
  try {
    const formData = new FormData();
    formData.append('video_id', video_id);

    // Create a File object with a proper filename
    const file = new File([content], `${video_id}_zh_translated.srt`, {
      type: 'text/plain',
    });
    formData.append('file', file);

    const response = await axiosClient.post(
      REQUEST_ENUM.uploadTranslatedSrt,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Failed to upload translated SRT:', error);
    throw error;
  }
};
