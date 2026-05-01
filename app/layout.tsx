import type { Metadata } from "next";
import { Abril_Fatface, Bebas_Neue, Lora, DM_Sans } from "next/font/google";
import "./globals.css";

const abrilFatface = Abril_Fatface({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Yakanga — Le média culturel africain',
    template: '%s | Yakanga',
  },
  description: 'Actualités culturelles, sport, politique et société africaine. Yakanga, le média qui raconte l\'Afrique.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    siteName: 'Yakanga',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${abrilFatface.variable} ${bebasNeue.variable} ${lora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-ui text-text">{children}</body>
    </html>
  );
}
