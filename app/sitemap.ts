// app/sitemap.ts
import type { MetadataRoute } from "next"

const BASE_URL = "https://ariyanskilledacademy.com"

// All static routes from your menu
const staticRoutes = [
  // Home
  { path: "/",                        priority: 1.0,  changeFrequency: "daily"   },

  // Notice & Results (high traffic pages)
  { path: "/notices",                  priority: 0.9,  changeFrequency: "daily"   },
  { path: "/results",                  priority: 0.9,  changeFrequency: "weekly"  },

  // Institution
  { path: "/about-us",                 priority: 0.8,  changeFrequency: "monthly" },
  { path: "/mission",                  priority: 0.7,  changeFrequency: "monthly" },
  { path: "/history",                  priority: 0.7,  changeFrequency: "monthly" },
  { path: "/annual-plan",              priority: 0.6,  changeFrequency: "monthly" },
  { path: "/contact",                  priority: 0.8,  changeFrequency: "monthly" },

  // Administration
  { path: "/profile/founder",             priority: 0.7,  changeFrequency: "monthly" },
  { path: "/profile/principal",           priority: 0.7,  changeFrequency: "monthly" },

  // Staff
  { path: "/staff",                    priority: 0.7,  changeFrequency: "monthly" },

  // Academic
  { path: "/class-routine",            priority: 0.8,  changeFrequency: "monthly" },
  { path: "/holiday-list",                 priority: 0.7,  changeFrequency: "monthly" },
  { path: "/courses",                     priority: 0.8,  changeFrequency: "monthly" },

  // Admission
  { path: "/prospectus",               priority: 0.9,  changeFrequency: "monthly" },
  { path: "/rules",          priority: 0.8,  changeFrequency: "monthly" },
  { path: "/result",        priority: 0.8,  changeFrequency: "monthly" },
  { path: "/questions",    priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/results",        priority: 0.8,  changeFrequency: "monthly" },
//   { path: "/admission-exam-question",  priority: 0.7,  changeFrequency: "monthly" },

  // Exam
  { path: "/exam-rules",               priority: 0.7,  changeFrequency: "monthly" },
  { path: "/schedule",            priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/syllabus",                 priority: 0.8,  changeFrequency: "monthly" },

  // Gallery
  { path: "/academic-photos",          priority: 0.6,  changeFrequency: "weekly"  },
  { path: "/academic-videos",          priority: 0.6,  changeFrequency: "weekly"  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return staticRoutes.map(route => ({
    url            : `${BASE_URL}${route.path}`,
    lastModified   : now,
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority       : route.priority,
  }))
}