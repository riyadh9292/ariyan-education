import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-montserrat"
});
const hindSiliguri = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400","500","600","700"]
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "আরিয়ান স্কিলড একাডেমি",
  description: "তরুণ প্রজন্মের আধুনিক কর্মমুখী শিক্ষা নিশ্চিতকরণে নিবেদিত একটি প্রতিষ্ঠান।",
  icons: {
    icon: "https://ariyanskilledacademy.com/vercel.svg",        // default favicon
    shortcut: "https://ariyanskilledacademy.com/vercel.svg",    // shortcut icon (Windows)
    apple: "https://ariyanskilledacademy.com/vercel.svg",       // iOS Safari
  },
  openGraph: {
    title: "আরিয়ান স্কিলড একাডেমি",
    description: "আপনার উন্নতি আমাদের অগ্রাধিকার",
    url: "https://ariyanskilledacademy.com",
    siteName: "আরিয়ান স্কিলড একাডেমি",
    images: [
      {
        url: "https://ariyanskilledacademy.com/site-logo.png",
        width: 1200,
        height: 630,
      },
    ],
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
      className={`${montserrat.variable} ${hindSiliguri.variable} h-full antialiased text-[#000000]`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col mt-[36px] xl:mt-[55px]">
        <Navbar />
        {children}
        <MenuSection />
      </body>
    </html>
  );
}
