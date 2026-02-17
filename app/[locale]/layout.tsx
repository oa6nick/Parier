import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: "--font-inter",
  display: 'swap',
  adjustFontFallback: true,
  preload: false,
});

export const metadata: Metadata = {
  title: "Pariall - Prediction Platform",
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
          <SessionProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen pt-20 flex flex-col bg-gray-50">
              <div className="flex-grow flex flex-col" suppressHydrationWarning>
                {children}
              </div>
              <Footer />
            </main>
            <BottomNavigation />
          </AuthProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
