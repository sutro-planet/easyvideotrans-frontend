import { MetadataRoute } from 'next';
import * as process from 'node:process';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseDomain = process.env.NEXT_PUBLIC_DOMAIN || '';
  return [
    {
      url: baseDomain,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseDomain}/playground`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
