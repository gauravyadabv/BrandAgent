import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandAgent — Autonomous AI Social Media Management",
  description:
    "Multi-agent AI platform for FMCG brands. Autonomous content creation, posting, verification & on-chain USDC payments via Circle Nanopayments on Arc L1.",
  keywords: [
    "AI social media management",
    "autonomous agents",
    "FMCG marketing",
    "Circle Nanopayments",
    "Arc L1",
    "USDC",
    "Gemini AI",
  ],
  openGraph: {
    title: "BrandAgent — Autonomous AI Social Media Management",
    description: "Multi-agent AI platform settling every task on Arc L1 via Circle Nanopayments",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
