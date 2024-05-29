const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
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
    ];
  },
};

module.exports = withContentlayer(nextConfig);
