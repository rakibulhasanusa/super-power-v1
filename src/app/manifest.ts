import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'JobPreAI',
        short_name: 'JobPreAI',
        description: 'Transform your learning with JobPrepAI\'s AI-powered quiz platform. 40 quick questions, instant results, and personalized study recommendations. Join 50,000+ students worldwide.',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}