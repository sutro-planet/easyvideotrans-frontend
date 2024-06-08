import React, { useEffect, useRef } from 'react';
import { Alert, Button, Form, Input, message, Space } from 'antd';
import { useReactive, useRequest } from 'ahooks';
import { videoPreview } from '@/app/request/playground';
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
      onSuccess: () => {
        state.renderVideoOk = true;
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
                // onPause={() => {
                //   videoRef.current!.pause();
                // }}
                // onPlay={() => {
                //   videoRef.current!.play();
                // }}
              />
            </div>
          </Space>
        )}
      </Form.Item>

      <Form.Item label={'生成视频'}>
        <Button
          type="primary"
          onClick={videoPreviewRun}
          loading={videoPreviewLoading}
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
