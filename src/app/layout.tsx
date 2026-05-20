import type { Metadata } from "next";
import { Cairo, Abhaya_Libre } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const abhayaLibre = Abhaya_Libre({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MijnDesignAirco",
  description: "Vind de perfecte design airco en een gecertificeerde installateur bij jou in de buurt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${cairo.variable} ${abhayaLibre.variable} h-full antialiased overflow-y-scroll`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
