import React from 'react';
import type { Metadata } from "next";
import { Montserrat, Bitter, Roboto_Condensed, Roboto, Atkinson_Hyperlegible } from 'next/font/google';
import "./globals.css";
import { ApiProvider } from './contexts/ApiContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
});


// More fonts I might use in the future
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700']
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'],
  variable: '--font-atkinson-hyperlegible',
  weight: ['400', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "marcodsn",
  description: "Innovative solutions in research, software & AI, and design & 3D modeling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${bitter.variable} antialiased`}>
        <ApiProvider>
          {children}
        </ApiProvider>
      </body>
    </html>
  );
}