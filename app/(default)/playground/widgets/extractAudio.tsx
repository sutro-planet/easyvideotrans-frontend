import React, { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { handleExtractAudio, removeAudioBg } from '@/app/request/playground';
import Link from 'next/link';
import { addLogEvent } from '@/app/utils/mitter';

interface Props {
  onFinish: () => void;
  videoId: string;
}

interface FormValue {
  videoId: string;
}

const ExtractSrt: React.FC<Props> = ({ onFinish, videoId }) => {
  const [form] = Form.useForm<FormValue>();

  const state = useReactive({ extractAudioOk: false, removeAudioBg: false });
  const { run: extractAudioRun, loading: extractAudioLoading } = useRequest(
    () => handleExtractAudio(videoId),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始提取音频');
      },
      onSuccess: () => {
        addLogEvent('提取音频成功');
        message.success('提取音频成功');
        state.extractAudioOk = true;
      },
      onError: () => {
        addLogEvent('提取音频失败');
        message.error('提取音频失败');
      },
    },
  );
  const { run: removeAudioBgRun, loading: removeAudioBgLoading } = useRequest(
    () => removeAudioBg(videoId),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始背景音频分离');
      },
      onSuccess: () => {
        addLogEvent('背景音频分离成功');
        message.info('背景音频分离成功');
        state.removeAudioBg = true;
      },
      onError: () => {
        addLogEvent('背景音频分离失败');
        message.error('背景音频分离失败');
      },
    },
  );
  useEffect(() => {
    form.setFieldValue('videoId', videoId);
  }, [videoId]);

  return (
    <Form
      form={form}
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
          <Button
            target={'_blank'}
            href={`/audio/${videoId}`}
            type="link"
            onClick={() => {
              addLogEvent('下载音频');
            }}
          >
            下载音频
          </Button>
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
          <Button
            target={'_blank'}
            href={`/audio_no_bg/${videoId}`}
            type="link"
            onClick={() => {
              addLogEvent('下载声音');
            }}
          >
            下载声音
          </Button>
        )}
        {state.removeAudioBg && (
          <Link
            target={'_blank'}
            href={`/audio_bg/${videoId}`}
            type="primary"
            onClick={() => {
              addLogEvent('下载背景音');
            }}
          >
            下载背景音
          </Link>
        )}
      </Form.Item>

      <Form.Item label={'进入下一步'}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!state.extractAudioOk || !state.removeAudioBg}
        >
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExtractSrt;
