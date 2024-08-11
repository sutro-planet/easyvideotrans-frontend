import axios from 'axios';
import { REQUEST_ENUM } from '@/app/const/request';
import { IGenerateTTSProp, ITranslateSrtIProp } from '@/app/type';

export const handleDownloadVideo = (video_id: string) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.downloadVideo,
    { video_id },
  );
};

export const handleDownloadVideoThumbnail = async (
  video_id: string,
): Promise<string> => {
  try {
    const response = await axios.post(
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
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.extractAudio,
    { video_id },
  );
};
export const voiceAudioConnect = (video_id: string) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.voiceConnect,
    { video_id },
  );
};
export const videoPreview = (video_id: string) => {
  return axios.post<{
    queue_length: any;
    video_preview_task_id: string;
    message: string;
  }>(REQUEST_ENUM.videoPreview, { video_id });
};

export const videoPreviewStatus = (task_id: string) => {
  return axios.get<{ state: string; status: string }>(
    REQUEST_ENUM.videoPreviewStatus + '/' + task_id,
  );
};

export const removeAudioBg = (video_id: string) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.removeAudioBg,
    { video_id },
  );
};
export const extractSourceSrt = (video_id: string) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.extractSourceSrt,
    { video_id },
  );
};

export const translateSrt = (data: ITranslateSrtIProp) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.translateSrt,
    data,
  );
};
export const generateTTS = (data: IGenerateTTSProp) => {
  return axios.post<{ video_id: string; message: string }>(
    REQUEST_ENUM.generateTTS,
    data,
  );
};
