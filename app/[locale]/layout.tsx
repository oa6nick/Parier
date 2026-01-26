import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-inter",
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Parier - Prediction Platform",
  description: "P2P prediction platform for real events",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen pb-24 pt-4">
            {children}
          </main>
          <BottomNavigation />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
