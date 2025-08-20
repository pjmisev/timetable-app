'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // figure out current effective theme after mount
  const current = mounted ? (theme === 'system' ? systemTheme : theme) : undefined;
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <div
      className="fixed z-50"
      style={{
        // safe-area aware positioning for iOS
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <Button
        type="button"
        aria-label="Toggle color theme"
        onClick={() => setTheme((current ?? 'light') === 'dark' ? 'light' : 'dark')}
        // round, glassy, readable in both themes
        className="relative h-12 w-12 rounded-full shadow-lg border
                   bg-background/70 dark:bg-background/60
                   backdrop-blur supports-[backdrop-filter]:bg-background/60
                   ring-1 ring-border/50 hover:ring-ring/50 transition"
        variant="outline"
        size="icon"
      >
        {/* both icons render; dark: classes control which one is visible */}
        <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
