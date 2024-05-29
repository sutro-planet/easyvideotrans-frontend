import React, { useEffect } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { extractSourceSrt, translateSrt } from '@/app/request/playground';
import { ITranslateSrtIProp } from '@/app/type';
import { addLogEvent } from '@/app/utils/mitter';

interface Props {
  onFinish: () => void;
  videoId: string;
}

interface FormValue {
  source_lang: string;
  translate_vendor: string;
  translate_key: string;
}

const ExtractSrt: React.FC<Props> = ({ onFinish, videoId }) => {
  const [form] = Form.useForm<FormValue>();
  const translate_vendor = Form.useWatch('translate_vendor', form);
  console.log(translate_vendor);
  const isShowTranslateKey = 'deepl' === translate_vendor;
  const state = useReactive({
    extractSourceSrtOk: false,
    translateSrtOk: false,
  });
  const { run: extractSourceSrtRun, loading: extractSourceSrtLoading } =
    useRequest(() => extractSourceSrt(videoId), {
      manual: true,
      onBefore: () => {
        addLogEvent('开始提取原始源字幕');
      },
      onSuccess: () => {
        state.extractSourceSrtOk = true;
        message.success('提取原始源字幕成功');
        addLogEvent('提取原始源字幕成功');
      },
      onError: () => {
        message.error('提取原始源字幕失败');
        addLogEvent('提取原始源字幕失败');
      },
    });
  const { runAsync: translateSrtRun, loading: translateSrtLoading } =
    useRequest((data: ITranslateSrtIProp) => translateSrt(data), {
      manual: true,
      onBefore: () => {
        addLogEvent('开始翻译字幕');
      },
      onSuccess: () => {
        state.translateSrtOk = true;
        message.success('翻译字幕成功');
        addLogEvent('翻译字幕成功');
      },
      onError: () => {
        message.error('翻译字幕失败，请检查参数');
        addLogEvent('翻译字幕失败，请检查参数');
      },
    });

  const handleTranslate = async () => {
    const { source_lang, translate_vendor, translate_key } =
      form.getFieldsValue();
    const data: ITranslateSrtIProp = {
      video_id: videoId,
      source_lang,
      translate_vendor,
      translate_key: isShowTranslateKey ? translate_key : '',
    };
    translateSrtRun(data);
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
        translate_vendor: 'google',
        source_lang: 'en',
        lang_to: 'zh',
      }}
      onSubmitCapture={onFinish}
    >
      <Form.Item label="视频ID" name={'videoId'}>
        <Input disabled value={videoId} />
      </Form.Item>
      <Form.Item label={'提取原始源字幕'}>
        <Button
          type="primary"
          loading={extractSourceSrtLoading}
          onClick={extractSourceSrtRun}
        >
          提取原始源字幕
        </Button>
        {state.extractSourceSrtOk && (
          <Button
            target={'_blank'}
            href={`/srt_en_merged/${videoId}`}
            type="link"
            onClick={() => {
              addLogEvent('下载原始源字幕');
            }}
          >
            下载原始源字幕
          </Button>
        )}
      </Form.Item>
      <Form.Item label={'语言选项'}>
        <Form.Item
          name="source_lang"
          style={{ display: 'inline-block', width: '100px' }}
        >
          <Select
            placeholder="选择源语言"
            options={[
              { value: 'en', label: 'en' },
              { value: 'zh', label: 'zh' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="source_lang"
          style={{ display: 'inline-block', width: '40px' }}
        >
          <div className={'text-center'}>到</div>
        </Form.Item>
        <Form.Item
          name="lang_to"
          style={{
            display: 'inline-block',
            width: '100px',
            marginLeft: '8px',
          }}
        >
          <Select
            placeholder="选择目标语言"
            options={[
              { value: 'en', label: 'en' },
              { value: 'zh', label: 'zh' },
            ]}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item label={'翻译引擎'}>
        <Form.Item
          name="translate_vendor"
          style={{ display: 'inline-block', width: '200px' }}
        >
          <Select
            placeholder="选择源语言"
            options={[
              { value: 'google', label: 'google' },
              { value: 'deepl', label: 'deepl' },
            ]}
          />
        </Form.Item>
      </Form.Item>
      {isShowTranslateKey && (
        <Form.Item
          label="key"
          name={'translate_key'}
          rules={[
            {
              required: isShowTranslateKey,
              message: '请输入翻译key',
            },
          ]}
        >
          <Input width={200} />
        </Form.Item>
      )}

      <Form.Item label={'开始翻译'}>
        <Button
          type="primary"
          onClick={handleTranslate}
          loading={translateSrtLoading}
          disabled={!state.extractSourceSrtOk}
        >
          翻译
        </Button>
        {state.translateSrtOk && (
          <Button
            type="link"
            target={'_blank'}
            href={`/srt_zh_merged/${videoId}`}
          >
            下载翻译后的字幕
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

export default ExtractSrt;
