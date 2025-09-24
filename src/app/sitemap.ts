import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://jobpreai.vercel.app',
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1,
            images: ['/twitter-image.jpg'],
        },
        {
            url: 'https://jobpreai.vercel.app/about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
            images: ['/twitter-image.jpg'],
        },
        {
            url: 'https://jobpreai.vercel.app/blog',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
            images: ['/twitter-image.jpg'],
        },
    ]
}