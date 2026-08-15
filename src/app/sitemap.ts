import type { MetadataRoute } from 'next'

/** Single-route app — every section is a tab, not a URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://arnavjoshi.tech',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
