const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pytvzhen-beta.sutroplanet.com/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
      // 上传视频
      {
        source: '/api/video_upload',
        destination: 'https://pytvzhen-beta.sutroplanet.com/video_upload',
      },
      // 下载视频
      {
        source: '/api/yt_download',
        destination: 'https://pytvzhen-beta.sutroplanet.com/yt_download',
      },
      // 提取音频
      {
        source: '/api/extra_audio',
        destination: 'https://pytvzhen-beta.sutroplanet.com/extra_audio',
      },
      // 取出音频背景音乐
      {
        source: '/api/remove_audio_bg',
        destination: 'https://pytvzhen-beta.sutroplanet.com/remove_audio_bg',
      },
      // 提取原始源字幕
      {
        source: '/api/transcribe',
        destination: 'https://pytvzhen-beta.sutroplanet.com/transcribe',
      },
      // 翻译
      {
        source: '/api/translate_to_zh',
        destination: 'https://pytvzhen-beta.sutroplanet.com/translate_to_zh',
      },
      // tts 语音
      {
        source: '/api/tts',
        destination: 'https://pytvzhen-beta.sutroplanet.com/tts',
      },
      // tts 语音 链接
      {
        source: '/api/voice_connect',
        destination: 'https://pytvzhen-beta.sutroplanet.com/voice_connect',
      },
      // tts 渲染视频
      {
        source: '/api/video_preview',
        destination: 'https://pytvzhen-beta.sutroplanet.com/video_preview',
      }, // tts 渲染视频
      {
        source: '/api/translate_to_zh',
        destination: 'https://pytvzhen-beta.sutroplanet.com/translate_to_zh',
      },
      // {
      //   source: '/api/:path',
      //   destination: 'https://pytvzhen-beta.sutroplanet.com/:path',
      // },
    ];
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  experimental: {
    scrollRestoration: false,
  },
};

module.exports = withContentlayer(nextConfig);
