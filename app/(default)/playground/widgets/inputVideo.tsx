import React from 'react';
import { Button, Form, Input, message, Switch, Upload, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { REQUEST_ENUM } from '@/app/const/request';
import { handleDownloadVideo } from '@/app/request/playground';

interface FormValue {
  useInput: boolean;
  videoId: string;
  file: UploadFile<{ video_id: string; message: string }>[] | null;
}

interface Props {
  onFinish: (videoId: string) => void;
}

const InputVideo: React.FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<FormValue>();
  const useInputId = Form.useWatch('useInput', form);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onSubmitCapture = async () => {
    const fieldErrorArr = form.getFieldsError();
    const isErrorExist = fieldErrorArr.some((item) => item.errors.length > 0);
    console.log(fieldErrorArr);
    if (isErrorExist) return;

    const value = form.getFieldsValue();
    const result = useInputId
      ? value.videoId
      : value.file?.[0]?.response?.video_id!;
    if (!result) {
      return message.error('请检查输入数据');
    }
    //需要请求
    if (useInputId) {
      const response = await handleDownloadVideo(result);
      if (response.data.video_id) {
        onFinish(response.data.video_id);
        message.success('下载成功');
        // 下载地址 /yt/video_id
      } else {
        message.error('下载失败，请重试');
      }
    } else {
      onFinish(result);
      message.success('上传成功');
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onSubmitCapture={onSubmitCapture}
    >
      <Form.Item
        label="手动输入视频ID"
        valuePropName="checked"
        name={'useInput'}
      >
        <Switch />
      </Form.Item>

      {useInputId ? (
        <Form.Item
          label="视频ID"
          name={'videoId'}
          rules={[
            { required: useInputId, message: '请输入视频ID或者视频网址' },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        <Form.Item label="文件上传">
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
            rules={[{ required: !useInputId, message: '请选择文件' }]}
          >
            <Upload.Dragger
              accept={'video/*'}
              action={REQUEST_ENUM.uploadVideo}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击选择文件或者拖拽文件</p>
              <p className="ant-upload-hint">目前仅支持单个文件</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      )}

      <Form.Item label={'进入下一步'}>
        <Button type="primary" htmlType="submit">
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InputVideo;
