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
