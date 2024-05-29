import React, { ChangeEvent, useEffect } from 'react';
import { Button, Form, Input, message, Switch, Upload, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { REQUEST_ENUM } from '@/app/const/request';
import { handleDownloadVideo } from '@/app/request/playground';
import { addLogEvent } from '@/app/utils/mitter';
import { UploadChangeParam } from 'antd/es/upload';
import { useReactive, useRequest } from 'ahooks';

interface FormValue {
  useInput: boolean;
  videoId: string;
  file: UploadFile<{ video_id: string; message: string }>[] | null;
}

interface Props {
  onFinish: (videoId: string) => void;
  videoId: string;
}

const InputVideo: React.FC<Props> = ({ onFinish, videoId }) => {
  const [form] = Form.useForm<FormValue>();
  const state = useReactive({
    videoDownloadOk: false,
  });
  const { run: handleDownloadVideoClickRun, loading } = useRequest(
    (id: string) => handleDownloadVideo(id),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始远程下载视频');
      },
      onSuccess: () => {
        addLogEvent('远程下载视频完成');
        message.success('远程下载视频完成');
        state.videoDownloadOk = true;
      },
      onError: () => {
        addLogEvent('远程下载视频失败');
        message.error('下载失败，请重试');
      },
    },
  );
  const useInputId = Form.useWatch('useInput', form);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onSubmitCapture = async () => {
    if (videoId) {
      return onFinish(videoId);
    }
    const fieldErrorArr = form.getFieldsError();
    const isErrorExist = fieldErrorArr.some((item) => item.errors.length > 0);
    if (isErrorExist) {
      addLogEvent('参数校验失败');
      return;
    }
    const value = form.getFieldsValue();
    const result = useInputId
      ? value.videoId
      : value.file?.[0]?.response?.video_id!;
    if (!result) {
      addLogEvent('参数校验失败');
      return message.error('请检查输入数据');
    }

    addLogEvent('视频设置成功');
    onFinish(result);
    message.success('视频设置成功');
  };
  useEffect(() => {
    form.setFieldValue('videoId', videoId);
  }, [videoId]);

  function onUploadFileChange(data: UploadChangeParam<UploadFile<any>>) {
    console.log(data);
    const status = data.file.status;
    switch (status) {
      case 'done':
        return addLogEvent('视频上传完成');
      case 'uploading':
        return addLogEvent('视频上传中');
      case 'error':
        return addLogEvent('视频上传错误');
      case 'removed':
        return addLogEvent('视频已经移除');
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
    const match = url.match(regex);
    return match?.[1] || '';
  };

  function handleDownloadVideoClick() {
    const value = form.getFieldsValue();
    const result = value.videoId;
    handleDownloadVideoClickRun(result);
  }

  function getVideoIdFromEvent(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    return extractVideoId(event.target.value) || value;
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onSubmitCapture={onSubmitCapture}
    >
      {videoId ? (
        <Form.Item label="当前视频Id">
          <div>{videoId}</div>
        </Form.Item>
      ) : (
        <>
          <Form.Item
            label="手动输入视频ID"
            valuePropName="checked"
            name={'useInput'}
          >
            <Switch
              disabled={!!videoId}
              onChange={(checked) => {
                addLogEvent(
                  checked ? '选择为手动输入视频模式' : '选择为上传视频模式',
                );
              }}
            />
          </Form.Item>

          {useInputId ? (
            <>
              <Form.Item
                label="视频ID"
                name={'videoId'}
                getValueFromEvent={getVideoIdFromEvent}
                rules={[
                  {
                    required: !videoId && useInputId,
                    message: '请输入正确的视频ID或者视频网址',
                  },
                ]}
              >
                <Input disabled={!!videoId} />
              </Form.Item>
              <Form.Item label={'开始下载视频'}>
                <Button
                  type="primary"
                  onClick={handleDownloadVideoClick}
                  loading={loading}
                >
                  下载
                </Button>
              </Form.Item>
            </>
          ) : (
            <Form.Item label="文件上传">
              <Form.Item
                name="file"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
                rules={[
                  { required: !videoId && !useInputId, message: '请选择文件' },
                ]}
              >
                <Upload.Dragger
                  accept={'video/*'}
                  action={REQUEST_ENUM.uploadVideo}
                  multiple={false}
                  onChange={onUploadFileChange}
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
        </>
      )}

      <Form.Item label={'进入下一步'}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={useInputId && !state.videoDownloadOk}
        >
          GO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InputVideo;
