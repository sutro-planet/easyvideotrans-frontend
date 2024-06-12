import React, { useEffect } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { generateTTS } from '@/app/request/playground';
import { IGenerateTTSProp } from '@/app/type';
import { addLogEvent } from '@/app/utils/mitter';
import { TRANSLATE_OPTIONS } from '@/app/const/translate_option';

interface Props {
  onFinish: () => void;
  videoId: string;
}

const ChineseAudio: React.FC<Props> = ({ onFinish, videoId }) => {
  const [form] = Form.useForm<IGenerateTTSProp>();

  const state = useReactive({
    translateSrtOk: false,
  });

  const { run: generateTTSRun, loading: generateTTSLoading } = useRequest(
    (data: IGenerateTTSProp) => generateTTS(data),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始配音');
      },
      onSuccess: () => {
        state.translateSrtOk = true;
        message.success('配音成功');
        addLogEvent('配音成功');
      },
      onError: () => {
        message.error('配音失败，请检查参数');
        addLogEvent('配音失败，请检查参数');
      },
    },
  );

  const handleGenerateTTS = async () => {
    const { tts_vendor, tts_key, tts_character } = form.getFieldsValue();
    const data: IGenerateTTSProp = {
      video_id: videoId,
      tts_vendor,
      tts_key,
      tts_character,
    };
    generateTTSRun(data);
  };

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
      <Form.Item label={'TTS vendor'}>
        <Form.Item
          name="tts_vendor"
          style={{ display: 'inline-block', width: '200px' }}
        >
          <Select
            placeholder="选择TTS vendor"
            options={[{ value: 'edge', label: 'edge' }]}
          />
        </Form.Item>
      </Form.Item>
      <Form.Item label={'TTS Character'}>
        <Form.Item name="tts_character">
          <Select placeholder="选择TTS Character" options={TRANSLATE_OPTIONS} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="key" name={'tts_key'}>
        <Input />
      </Form.Item>
      <Form.Item label={'生成TTS'}>
        <Button
          type="primary"
          onClick={handleGenerateTTS}
          loading={generateTTSLoading}
        >
          生成
        </Button>
        {state.translateSrtOk && (
          <Button type="link" target={'_blank'} href={`/api/tts/${videoId}`}>
            下载TTS
          </Button>
        )}
      </Form.Item>
      <Form.Item label={'进入下一步'}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!state.translateSrtOk}
        >
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChineseAudio;
