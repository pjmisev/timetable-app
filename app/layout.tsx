import './globals.css';
import type { Metadata } from 'next';
import { Jura } from 'next/font/google';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const jura = Jura({ subsets: ['latin'], variable: '--font-jura' });

export const metadata: Metadata = {
  title: 'Timetable App | PJmisev',
  description: 'Timetable App by PJmisev (Pijus Misevicius)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jura.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ThemeToggle /> {/* ← floating toggle lives here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
