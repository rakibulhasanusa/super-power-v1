import type { Metadata, Viewport } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "@/context/user-context";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://jobpreai.vercel.app'),
  title: {
    default: 'JobPrepAI - AI-Powered Learning Platform | Master Any Subject',
    template: '%s | JobPrepAI - AI Learning Platform',
  },
  description: 'Transform your learning with JobPrepAI\'s AI-powered quiz platform. 40 quick questions, instant results, and personalized study recommendations. Join 50,000+ students worldwide.',
  keywords: [
    'online quiz platform',
    'AI learning',
    'educational quizzes',
    'study platform',
    'personalized learning',
    'quiz maker',
    'exam preparation',
    'online education',
    'interactive learning',
    'student assessment'
  ],
  authors: [{ name: 'JobPrepAI Team', url: 'https://jobpreai.vercel.app' }],
  creator: 'JobPrepAI Inc.',
  publisher: 'JobPrepAI Inc.',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobpreai.vercel.app',
    siteName: 'JobPrepAI',
    title: 'JobPrepAI - AI-Powered Learning Platform',
    description: 'Transform your learning with AI-powered quizzes. 40 questions, instant results, personalized recommendations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuizMaster AI Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@JobPrepAI',
    creator: '@JobPrepAI',
    title: 'JobPrepAI - AI-Powered Learning Platform',
    description: 'Transform your learning with AI-powered quizzes. Join 50,000+ students worldwide.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code',
  // },
  // alternates: {
  //   canonical: 'https://quizmaster.com',
  //   languages: {
  //     'en-US': 'https://quizmaster.com',
  //     'es-ES': 'https://quizmaster.com/es',
  //     'fr-FR': 'https://quizmaster.com/fr',
  //   },
  // },
  // category: 'education',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hydrated">
      <body
        className={`${ubuntu.variable} antialiased`}

      >
        <Header />
        <div className=" mt-20 container mx-auto">
          <UserProvider>{children}</UserProvider>
          <Analytics />
          <SpeedInsights />
        </div>
        <Footer />
      </body>
    </html>
  );
}
