import React, { useEffect, useRef } from 'react';
import { Alert, Button, Form, Input, message, Space } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { videoPreview, videoPreviewStatus } from '@/app/request/playground';
import { IGenerateTTSProp } from '@/app/type';
import { addLogEvent } from '@/app/utils/mitter';
import { DPlayer, Player as RcDPlayer } from 'rc-dplayer';
import './render_video.css';

interface Props {
  videoId: string;
}

const RenderVideo: React.FC<Props> = ({ videoId }) => {
  const [form] = Form.useForm<IGenerateTTSProp>();
  const videoRef = useRef<DPlayer | null>(null);
  const videoClick = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const state = useReactive({
    renderVideoTask: '',
    renderVideoOk: false,
    audioOk: false,
    videoOk: false,
  });

  const { run: videoPreviewRun, loading: videoPreviewLoading } = useRequest(
    () => videoPreview(videoId),
    {
      manual: true,
      onBefore: () => {
        addLogEvent('开始渲染');
      },
      onSuccess: (result) => {
        const info = `渲染请求已提交，当前队列长度为 ${result.data.queue_length}，请求哈希为 ${result.data.video_preview_task_id}`;
        message.success(info);
        addLogEvent(info);

        state.renderVideoTask = result.data.video_preview_task_id;
      },
      onError: () => {
        const info = '提交渲染请求失败，请检查参数';
        message.error(info);
        addLogEvent(info);
      },
    },
  );

  const { run: checkStatusRun } = useRequest(
    () => videoPreviewStatus(state.renderVideoTask),
    {
      manual: true,
      onSuccess: (response) => {
        switch (response.data.state) {
          case 'SUCCESS':
            message.success(
              `渲染请求成功！请求哈希为 ${state.renderVideoTask}`,
            );
            addLogEvent(`渲染请求成功！请求哈希为 ${state.renderVideoTask}`);

            state.renderVideoOk = true;
            state.renderVideoTask = '';
            break;
          case 'FAILURE':
            message.success(
              `渲染请求失败！请求哈希为 ${state.renderVideoTask}`,
            );
            addLogEvent(`渲染请求失败！请求哈希为 ${state.renderVideoTask}`);

            state.renderVideoOk = false;
            state.renderVideoTask = '';
            break;
          case 'PENDING':
            message.info(
              `渲染请求仍在队列！请求哈希为 ${state.renderVideoTask}，5秒后重试`,
            );
            addLogEvent(
              `渲染请求仍在队列！请求哈希为 ${state.renderVideoTask}，5秒后重试`,
            );
        }
      },
      onError: () => {
        message.error('状态检查失败，请重试');
        addLogEvent('状态检查失败，请重试');
      },
    },
  );

  useEffect(() => {
    form.setFieldValue('videoId', videoId);

    // poll the video rendering status every 5 seconds
    let interval: NodeJS.Timeout;
    if (state.renderVideoTask !== '') {
      interval = setInterval(() => {
        checkStatusRun();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [videoId, state.renderVideoTask, checkStatusRun]);

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{
        videoId,
      }}
    >
      <Form.Item label="视频ID" name={'videoId'}>
        <Input disabled value={videoId} />
      </Form.Item>
      <Form.Item label="视频预览" name={'video_player'}>
        {videoId && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="预览音画可能不同步，最终渲染结果无影响"
              type="warning"
            />
            <div
              onClickCapture={() => {
                videoClick.current = true;
                audioRef.current!.pause();
              }}
            >
              <RcDPlayer
                src={`/api/yt/${videoId}`}
                options={{
                  volume: 0,
                }}
                onLoad={(dp) => {
                  videoRef.current = dp;
                }}
                onPlay={() => {
                  audioRef.current!.play();
                }}
                onPause={() => {
                  audioRef.current!.pause();
                }}
                onCanPlay={(event) => {
                  state.videoOk = true;
                  addLogEvent('视频可被播放');
                }}
                onTimeUpdate={(event) => {
                  const time = (event.target as any).currentTime as number;
                  if (videoClick.current) {
                    audioRef.current!.currentTime = time;
                    if (audioRef.current!.paused) {
                      audioRef.current!.play();
                    }
                  }
                  videoClick.current = false;
                }}
              />
            </div>
            <div className={'hidden'}>
              <audio
                controls
                src={`/api/voice_connect/${videoId}`}
                ref={audioRef}
                onCanPlay={() => {
                  state.audioOk = true;
                }}
                onError={(event) => {
                  message.error('音频加载出错');
                  addLogEvent('音频加载出错');
                }}
              />
            </div>
          </Space>
        )}
      </Form.Item>

      <Form.Item label={'生成视频'}>
        <Button
          type="primary"
          onClick={videoPreviewRun}
          loading={videoPreviewLoading || state.renderVideoTask !== ''}
        >
          生成
        </Button>
        {state.renderVideoOk && (
          <>
            <Button
              type="link"
              target={'_blank'}
              href={`/api/video_preview/${videoId}`}
            >
              下载视频
            </Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default RenderVideo;
