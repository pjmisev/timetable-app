'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"           // adds/removes `dark` on <html>
      defaultTheme="system"
      enableSystem
      storageKey="theme"          // keeps it stable across reloads
      disableTransitionOnChange   // avoid flicker on toggle
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
