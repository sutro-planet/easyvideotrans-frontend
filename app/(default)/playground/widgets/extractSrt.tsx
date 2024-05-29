import React from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { extractSourceSrt, translateSrt } from '@/app/request/playground';
import Link from 'next/link';
import { ITranslateSrtIProp } from '@/app/type';

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
      onSuccess: () => {
        state.extractSourceSrtOk = true;
      },
    });
  const { runAsync: translateSrtRun, loading: translateSrtLoading } =
    useRequest((data: ITranslateSrtIProp) => translateSrt(data), {
      manual: true,
      onSuccess: () => {
        state.translateSrtOk = true;
        message.success('翻译成功');
      },
      onError: () => {
        message.error('翻译失败，请检查参数');
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
    translateSrtRun(data).then(() => {
      onFinish();
    });
  };

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
          <Link
            target={'_blank'}
            href={`/srt_en_merged/${videoId}`}
            type="primary"
          >
            下载原始源字幕
          </Link>
        )}
      </Form.Item>
      <Form.Item label={'语言选项'}>
        <Form.Item
          name="source_lang"
          style={{ display: 'inline-block', width: '200px' }}
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
          name="lang_to"
          style={{
            display: 'inline-block',
            width: '200px',
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
          htmlType="submit"
          onClick={handleTranslate}
          loading={translateSrtLoading}
        >
          翻译
        </Button>
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
