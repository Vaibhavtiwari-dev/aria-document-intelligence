import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
