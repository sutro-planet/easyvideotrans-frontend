export const metadata = {
  title: 'Pytvzhen',
  description: 'Pytvzhen 最快的英文视频转中文方案',
  keywords: [
    'Pytvzhen 最快的英文视频转中文方案',
    'Pytvzhen',
    '视频转换',
    '视频翻译',
    '视频转中文',
    '视频转英文',
    '视频转日语',
    '视频转外语',
  ],
};

import Hero from '@/components/hero-home';
import Features from '@/components/features-home';
import Cta from '@/components/cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/*<FeaturesBlocks />*/}
      {/*<FeaturesWorld />*/}
      {/*<News />*/}
      <Cta />
    </>
  );
}
