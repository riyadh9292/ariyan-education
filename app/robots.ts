// app/robots.ts
import type { MetadataRoute } from "next"

const BASE_URL = "https://ariyanskilledacademy.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers — allow everything public
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/",
        ],
      },
      {
        // Give Google extra priority hints
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host   : BASE_URL,
  }
}