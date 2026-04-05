import type { Metadata } from "next"
import { Montserrat, Noto_Sans_Bengali, Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import MenuSection from "@/components/MenuSection"

const montserrat = Montserrat({
  subsets  : ["latin"],
  weight   : ["300", "400", "500", "600", "700"],
  variable : "--font-montserrat",
})

const hindSiliguri = Noto_Sans_Bengali({
  subsets  : ["bengali"],
  variable : "--font-bengali",
  weight   : ["400", "500", "600", "700"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets : ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets : ["latin"],
})

const BASE_URL = "https://ariyanskilledacademy.com"

export const metadata: Metadata = {
  // ✅ 1. metadataBase — সব image URL absolute হবে এটা ছাড়া কাজ করে না
  metadataBase: new URL(BASE_URL),

  // ✅ 2. Title — template দিলে সব page এ "| আরিয়ান স্কিলড একাডেমি" যুক্ত হবে
  title: {
    default : "আরিয়ান স্কিলড একাডেমি | Ariyan Skilled Academy",
    template: "%s | আরিয়ান স্কিলড একাডেমি",
  },

  // ✅ 3. Description — keyword rich, দুই ভাষায়
  description:
    "আরিয়ান স্কিলড একাডেমি — তরুণ প্রজন্মের আধুনিক কর্মমুখী শিক্ষা নিশ্চিতকরণে নিবেদিত। " +
    "Ariyan Skilled Academy | Ariyan Skills Academy | Ariyan Education Center — " +
    "vocational training and skill development in Bangladesh.",

  // ✅ 4. Keywords — সব variation কভার করা হয়েছে
  keywords: [
    // বাংলা
    "আরিয়ান",
    "আরিয়ান স্কিলড একাডেমি",
    "আরিয়ান স্কিলস একাডেমি",
    "আরিয়ান এডুকেশন",
    "আরিয়ান এডুকেশন সেন্টার",
    "কর্মমুখী শিক্ষা",
    "দক্ষতা উন্নয়ন",
    "ভোকেশনাল ট্রেনিং বাংলাদেশ",
    "প্রাইমারি হেলথ কেয়ার কোর্স",
    "কেয়ারগিভিং কোর্স",
    "হাউসকিপিং কোর্স",
    // English
    "Ariyan",
    "Ariyan Skilled Academy",
    "Ariyan Skills Academy",
    "Ariyan Education",
    "Ariyan Education Center",
    "Ariyan Education Centre",
    "Ariyan Academy Bangladesh",
    "ariyan skilled",
    "ariyanskilledacademy",
    "ariyanskilledacademy.com",
    "vocational training Bangladesh",
    "skill development Bangladesh",
    "primary health care course Bangladesh",
    "caregiving course Bangladesh",
    "housekeeping training Bangladesh",
  ],

  // ✅ 5. Authors
  authors  : [{ name: "Ariyan Skilled Academy", url: BASE_URL }],
  creator  : "Ariyan Skilled Academy",
  publisher: "Ariyan Skilled Academy",

  // ✅ 6. Canonical — duplicate content থেকে বাঁচাবে
  alternates: {
    canonical: BASE_URL,
    languages: {
      "bn-BD": BASE_URL,
      "en-US": BASE_URL,
    },
  },

  // ✅ 7. Open Graph — ঠিক করা হয়েছে
  openGraph: {
    type           : "website",
    locale         : "bn_BD",
    alternateLocale: ["en_US"],
    url            : BASE_URL,
    siteName       : "আরিয়ান স্কিলড একাডেমি",
    title          : "আরিয়ান স্কিলড একাডেমি | Ariyan Skilled Academy",
    description    :
      "তরুণ প্রজন্মের আধুনিক কর্মমুখী শিক্ষা নিশ্চিতকরণে নিবেদিত। " +
      "Ariyan Skilled Academy | Ariyan Skills Academy | Ariyan Education Center",
    images: [
      {
        url   : "/site-logo.png",   // public/og-image.png এ 1200×630px image রাখুন
        width : 1200,
        height: 630,
        alt   : "আরিয়ান স্কিলড একাডেমি — Ariyan Skilled Academy Bangladesh",
      },
    ],
  },

  // ✅ 8. Twitter Card
  twitter: {
    card       : "summary_large_image",
    title      : "আরিয়ান স্কিলড একাডেমি | Ariyan Skilled Academy",
    description:
      "Ariyan Skilled Academy | Ariyan Skills Academy | Ariyan Education Center — " +
      "vocational training and skill development in Bangladesh.",
    images: ["/site-logo.png"],
  },

  // ✅ 9. Robots — explicitly Google কে index করতে বলা
  robots: {
    index    : true,
    follow   : true,
    googleBot: {
      index              : true,
      follow             : true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet"      : -1,
    },
  },

  // ✅ 10. Icons — vercel.svg সরিয়ে নিজের logo দিন
  icons: {
    icon   : "/favicon.ico",
    shortcut: "/favicon.ico",
    apple  : "/site-logo.png",
  },

  // ✅ 11. Category
  category: "education",
}

// ✅ 12. JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type"   : "EducationalOrganization",
  "name"    : "আরিয়ান স্কিলড একাডেমি",
  "alternateName": [
    "Ariyan Skilled Academy",
    "Ariyan Skills Academy",
    "Ariyan Education Center",
    "Ariyan Education Centre",
    "Ariyan Academy",
    "Ariyan Education",
    "ariyan",
    "আরিয়ান",
    "আরিয়ান স্কিলস একাডেমি",
    "আরিয়ান এডুকেশন সেন্টার",
  ],
  "url"        : BASE_URL,
  "logo"       : `${BASE_URL}/site-logo.png`,
  "image"      : `${BASE_URL}/site-logo.png`,
  "description": "তরুণ প্রজন্মের আধুনিক কর্মমুখী শিক্ষা নিশ্চিতকরণে নিবেদিত একটি প্রতিষ্ঠান।",
  "address": {
    "@type"          : "PostalAddress",
    "addressCountry" : "BD",
    "addressLocality": "Tangail",
    "addressRegion"  : "Dhaka Division",
  },
  "contactPoint": {
    "@type"            : "ContactPoint",
    "contactType"      : "admissions",
    "areaServed"       : "BD",
    "availableLanguage": ["Bengali", "English"],
  },
  "sameAs": [
    "https://www.facebook.com/ariyanskilledtangail",
    "https://www.linkedin.com/in/ariyan-skilled-academy-tangail/"
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"  // ✅ "en" থেকে "bn" — site Bengali তাই
      className={`${montserrat.variable} ${hindSiliguri.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased text-[#000000]`}
    >
      <head>
        {/* ✅ JSON-LD — Google rich results এর জন্য */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col mt-[36px] xl:mt-[55px]"
      >
        <Navbar />
        {children}
        <MenuSection />
      </body>
    </html>
  )
}