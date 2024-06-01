import React, { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { videoPreview } from '@/app/request/playground';
import { IGenerateTTSProp } from '@/app/type';
import { addLogEvent } from '@/app/utils/mitter';

interface Props {
  videoId: string;
}

const RenderVideo: React.FC<Props> = ({ videoId }) => {
  const [form] = Form.useForm<IGenerateTTSProp>();

  const state = useReactive({
    connectAudioOk: false,
  });

  const { run: videoPreviewRun, loading: videoPreviewLoading } = useRequest(
    () => videoPreview(videoId),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始渲染');
      },
      onSuccess: () => {
        state.connectAudioOk = true;
        message.success('渲染成功');
        addLogEvent('渲染成功');
      },
      onError: () => {
        message.error('渲染失败，请检查参数');
        addLogEvent('渲染失败，请检查参数');
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
      initialValues={{
        videoId,
        tts_vendor: 'edge',
        tts_key: '',
        tts_character: 'zh-CN-XiaoyiNeural',
      }}
    >
      <Form.Item label="视频ID" name={'videoId'}>
        <Input disabled value={videoId} />
      </Form.Item>

      <Form.Item label={'生成视频'}>
        <Button
          type="primary"
          onClick={videoPreviewRun}
          loading={videoPreviewLoading}
        >
          生成
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
    </Form>
  );
};

export default RenderVideo;
