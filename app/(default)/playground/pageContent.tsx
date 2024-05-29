'use client';
import { Tabs, TabsProps } from 'antd';
import InputVideo from '@/app/(default)/playground/widgets/inputVideo';
import { useReactive } from 'ahooks';
import ExtractAudio from '@/app/(default)/playground/widgets/extractAudio';
import ExtractSrt from '@/app/(default)/playground/widgets/extractSrt';

const PageContent = () => {
  const state = useReactive({
    step: 2,
    videoId: 'P2CPd9ynFLg',
  });
  const onTabChange = (key: string) => {
    state.step = +key;
  };
  const onFirstStepFinish = (videoId: string) => {
    state.videoId = videoId;
    state.step = 1;
  };
  const onSecondStepFinish = () => {
    state.step = 2;
  };
  const items: TabsProps['items'] = [
    {
      key: '0',
      label: '视频资源',
      children: <InputVideo onFinish={onFirstStepFinish} />,
    },
    {
      key: '1',
      label: '音频提取',
      children: (
        <ExtractAudio onFinish={onSecondStepFinish} videoId={state.videoId} />
      ),
    },
    {
      key: '2',
      label: '字幕提取',
      children: (
        <ExtractSrt onFinish={onSecondStepFinish} videoId={state.videoId} />
      ),
    },
  ];
  return (
    <div className={'w-full'}>
      <Tabs activeKey={`${state.step}`} items={items} onChange={onTabChange} />
    </div>
  );
};
export default PageContent;
