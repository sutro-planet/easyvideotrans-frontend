import React from 'react';
import { Button, Form, Input } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { handleExtractAudio, removeAudioBg } from '@/app/request/playground';
import Link from 'next/link';

interface Props {
  onFinish: () => void;
  videoId: string;
}

const ExtractSrt: React.FC<Props> = ({ onFinish, videoId }) => {
  const state = useReactive({ extractAudioOk: false, removeAudioBg: false });
  const { run: extractAudioRun, loading: extractAudioLoading } = useRequest(
    () => handleExtractAudio(videoId),
    {
      manual: true,
      onSuccess: () => {
        state.extractAudioOk = true;
      },
    },
  );
  const { run: removeAudioBgRun, loading: removeAudioBgLoading } = useRequest(
    () => removeAudioBg(videoId),
    {
      manual: true,
      onSuccess: () => {
        state.removeAudioBg = true;
      },
    },
  );

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ videoId }}
      onSubmitCapture={onFinish}
    >
      <Form.Item label="视频ID" name={'videoId'}>
        <Input disabled value={videoId} />
      </Form.Item>
      <Form.Item label={'提取音频'}>
        <Button
          type="primary"
          loading={extractAudioLoading}
          onClick={extractAudioRun}
        >
          提取音频
        </Button>
        {state.extractAudioOk && (
          <Link target={'_blank'} href={`/audio/${videoId}`} type="primary">
            下载音频
          </Link>
        )}
      </Form.Item>
      <Form.Item label={'取出音频背景音乐'}>
        <Button
          type="primary"
          onClick={removeAudioBgRun}
          loading={removeAudioBgLoading}
        >
          取出音频背景音乐
        </Button>
        {state.removeAudioBg && (
          <Link
            target={'_blank'}
            href={`/audio_no_bg/${videoId}`}
            type="primary"
          >
            下载声音
          </Link>
        )}
        {state.removeAudioBg && (
          <Link target={'_blank'} href={`/audio_bg/${videoId}`} type="primary">
            下载背景音
          </Link>
        )}
      </Form.Item>

      <Form.Item label={'进入下一步'}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={state.extractAudioOk && state.removeAudioBg}
        >
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExtractSrt;
