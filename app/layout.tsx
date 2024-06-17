import './css/style.css';

import { Inter } from 'next/font/google';

import Header from '@/components/ui/header';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'EasyVideoTrans',
  description: 'EasyVideoTrans 最快的英文视频转中文方案',
  keywords: [
    'EasyVideoTrans 最快的英文视频转中文方案',
    'EasyVideoTrans',
    '视频转换',
    '视频翻译',
    '视频转中文',
    '视频转英文',
    '视频转日语',
    '视频转外语',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-white font-inter tracking-tight text-gray-900 antialiased`}
      >
        <AntdRegistry>
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
          </div>
        </AntdRegistry>
      </body>
      <GoogleAnalytics gaId="G-PYDZT2E8EW" />
    </html>
  );
}
