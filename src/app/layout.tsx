import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YIMI GROUP | 蟻米集團",
  description: "立足香港金融樞紐，驅動 AI 科技、區塊鏈消費、跨境資本與智慧地產的全球化佈局。",
  openGraph: {
    title: "YIMI GROUP | 蟻米集團",
    description: "立足香港金融樞紐，驅動 AI 科技、區塊鏈消費、跨境資本與智慧地產的全球化佈局。",
    url: "https://www.yimihk.com",
    siteName: "YIMI GROUP",
    locale: "zh_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
