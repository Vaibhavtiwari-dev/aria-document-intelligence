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
  title: "Aria | AI Document Intelligence Platform",
  description: "Upload PDFs and reports. Get instant, cited answers powered by Gemini 2.0 Flash.",
  openGraph: {
    title: "Aria | AI Document Intelligence Platform",
    description: "Conversational knowledge base for your document collections.",
    url: "https://aria-platform.vercel.app",
    siteName: "Aria",
    images: [
      {
        url: "/assets/banner.png",
        width: 1200,
        height: 630,
        alt: "Aria Platform Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aria | AI Document Intelligence Platform",
    description: "Ask questions across any document. Get cited answers instantly.",
    images: ["/assets/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
