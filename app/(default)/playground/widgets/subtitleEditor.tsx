'use client';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Input, message } from 'antd';
import {
  handleDownloadOriginalSrt,
  handleUploadOriginalSrt,
  handleDownloadTranslatedSrt,
  handleUploadTranslatedSrt,
} from '@/app/request/playground';

const { TextArea } = Input;

interface SubtitleEditorProps {
  videoId: string;
  onFinish: () => void;
}

const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  videoId,
  onFinish,
}) => {
  const [originalSrt, setOriginalSrt] = useState('');
  const [translatedSrt, setTranslatedSrt] = useState('');

  useEffect(() => {
    async function fetchSrtFiles() {
      try {
        const original = await handleDownloadOriginalSrt(videoId);
        const translated = await handleDownloadTranslatedSrt(videoId);
        setOriginalSrt(original);
        setTranslatedSrt(translated);
      } catch (error) {
        message.error('Failed to load subtitle files');
      }
    }

    fetchSrtFiles();
  }, [videoId]);

  const handleSaveOriginal = async () => {
    try {
      await handleUploadOriginalSrt(videoId, originalSrt);
      message.success('Original subtitles saved!');
    } catch (error) {
      message.error('Failed to save original subtitles');
    }
  };

  const handleSaveTranslated = async () => {
    try {
      await handleUploadTranslatedSrt(videoId, translatedSrt);
      message.success('Translated subtitles saved!');
      onFinish();
    } catch (error) {
      message.error('Failed to save translated subtitles');
    }
  };

  return (
    <div className="p-4">
      <Alert
        message="如果翻译效果不好，您可以使用大预言模型用下面的prompt进行翻译:
        Here is an SRT file from a video file, could you analyze the context and modify it to Chinese,
        please keep original format as the same and only change the English text to Chinese.
        Please only output the SRT result without any other text. <英文 SRT 内容>"
        type="warning"
        showIcon
        className="mb-4"
      />

      <h3 className="mb-2 font-bold">原始字幕 (可编辑)</h3>
      <TextArea
        rows={6}
        value={originalSrt}
        onChange={(e) => setOriginalSrt(e.target.value)}
        className="mb-4"
      />
      <Button type="primary" onClick={handleSaveOriginal} className="mb-4">
        保存原始字幕
      </Button>

      <h3 className="mb-2 font-bold">翻译字幕 (可编辑)</h3>
      <TextArea
        rows={6}
        value={translatedSrt}
        onChange={(e) => setTranslatedSrt(e.target.value)}
        className="mb-4"
      />
      <Button type="primary" onClick={handleSaveTranslated}>
        保存翻译字幕
      </Button>
    </div>
  );
};

export default SubtitleEditor;
