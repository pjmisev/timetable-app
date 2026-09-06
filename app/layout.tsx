import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Jura } from 'next/font/google';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const jura = Jura({ subsets: ['latin'], variable: '--font-jura' });

export const metadata: Metadata = {
  title: 'Timetable App | PJmisev',
  description: 'Timetable App by PJmisev (Pijus Misevicius)',
  applicationName: 'Timetable App',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  appleWebApp: {
    capable: true,
    title: 'Timetable App',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#007BB4',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jura.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ThemeToggle /> {/* ← floating toggle lives here */}
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
