import React, { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { voiceAudioConnect } from '@/app/request/playground';
import { IGenerateTTSProp } from '@/app/type';
import { addLogEvent } from '@/app/utils/mitter';

interface Props {
  onFinish: () => void;
  videoId: string;
}

const ConnectAudio: React.FC<Props> = ({ onFinish, videoId }) => {
  const [form] = Form.useForm<IGenerateTTSProp>();
  const state = useReactive({
    connectAudioOk: false,
  });

  const { run: voiceAudioConnectRun, loading: voiceAudioConnectLoading } =
    useRequest(() => voiceAudioConnect(videoId), {
      manual: true,
      onBefore: () => {
        addLogEvent('语音连接开始');
      },
      onSuccess: () => {
        state.connectAudioOk = true;
        message.success('语音连接成功');
        addLogEvent('语音连接成功');
      },
      onError: () => {
        message.error('语音连接失败，请检查参数');
        addLogEvent('语音连接失败，请检查参数');
      },
    });

  useEffect(() => {
    form.setFieldValue('videoId', videoId);
  }, [videoId]);

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{
        videoId,
        tts_vendor: 'edge',
        tts_key: '',
        tts_character: 'zh-CN-XiaoyiNeural',
      }}
      onSubmitCapture={onFinish}
    >
      <Form.Item label="视频ID" name={'videoId'}>
        <Input disabled value={videoId} />
      </Form.Item>

      <Form.Item label={'语音连接'}>
        <Button
          type="primary"
          onClick={voiceAudioConnectRun}
          loading={voiceAudioConnectLoading}
        >
          语音连接
        </Button>
        {state.connectAudioOk && (
          <>
            <Button
              type="link"
              target={'_blank'}
              href={`/api/voice_connect/${videoId}`}
            >
              下载音频
            </Button>
            <Button
              type="link"
              target={'_blank'}
              href={`/api/voice_connect_log/${videoId}`}
            >
              下载日志
            </Button>
          </>
        )}
      </Form.Item>
      <Form.Item label={'进入下一步'}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!state.connectAudioOk}
        >
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConnectAudio;
