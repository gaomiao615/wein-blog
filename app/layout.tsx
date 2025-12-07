import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wein Blog - Wine & German Learning',
  description: 'A blog for wine lovers and German learners',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}

