'use client';
import { Empty, Tabs, TabsProps } from 'antd';
import InputVideo from '@/app/(default)/playground/widgets/inputVideo';
import { useReactive } from 'ahooks';
import ExtractAudio from '@/app/(default)/playground/widgets/extractAudio';
import ExtractSrt from '@/app/(default)/playground/widgets/extractSrt';
import {
  addLogEvent,
  emitter,
  LogData,
  MITTER_EVENT_ENUM,
} from '@/app/utils/mitter';
import React, { useEffect } from 'react';
import ChineseAudio from '@/app/(default)/playground/widgets/chineseAudio';
import ConnectAudio from '@/app/(default)/playground/widgets/connectAudio';
import dynamic from 'next/dynamic';

const RenderVideo = dynamic(
  () => import('@/app/(default)/playground/widgets/renderVideo'),
  {
    ssr: false,
  },
);

const PageContent = () => {
  const state = useReactive<{
    step: number;
    videoId: string;
    logList: LogData[];
  }>({
    step: 0,
    videoId: '',
    logList: [],
  });

  const onTabChange = (key: string) => {
    state.step = +key;
  };
  const onFirstStepFinish = (videoId: string) => {
    state.videoId = videoId;
    onNextStep();
  };
  const onNextStep = () => {
    state.step++;
    addLogEvent(`进入第【${state.step + 1}】个阶段`);
  };

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: '视频资源',
      children: (
        <InputVideo onFinish={onFirstStepFinish} videoId={state.videoId} />
      ),
    },
    {
      key: '1',
      label: '音频提取',
      children: <ExtractAudio onFinish={onNextStep} videoId={state.videoId} />,
    },
    {
      key: '2',
      label: '字幕提取',
      children: <ExtractSrt onFinish={onNextStep} videoId={state.videoId} />,
    },
    {
      key: '3',
      label: '中文字幕配音',
      children: <ChineseAudio onFinish={onNextStep} videoId={state.videoId} />,
    },
    {
      key: '4',
      label: '语音连接',
      children: <ConnectAudio onFinish={onNextStep} videoId={state.videoId} />,
    },
    {
      key: '5',
      label: '渲染预览视频',
      children: <RenderVideo videoId={state.videoId} />,
    },
  ];
  useEffect(() => {
    // listen to an event
    emitter.on(MITTER_EVENT_ENUM.addLog, (data) => {
      state.logList.push(data);
    });
    return () => {
      emitter.all.clear();
    };
  }, []);
  return (
    <div className={'w-full pb-6 lg:flex'}>
      <Tabs
        activeKey={`${state.step}`}
        items={items}
        onChange={onTabChange}
        rootClassName={'flex-1'}
      />
      <div
        className={
          ' max-h-[700px]  w-full overflow-auto rounded-md border p-2 lg:ml-3 lg:w-[300px]'
        }
      >
        <div className={'flex h-9 flex-col justify-center border-b font-black'}>
          日志
        </div>
        {state.logList?.length > 0 ? (
          <ul>
            {state.logList.map((item) => (
              <li key={item.key} className={'text-xs'}>
                [{item.time}]{item.text}
              </li>
            ))}
          </ul>
        ) : (
          <div className={'flex h-full items-center justify-center'}>
            <Empty description={'暂无日志'} />
          </div>
        )}
      </div>
    </div>
  );
};
export default PageContent;
