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
  { path: "/about",                    priority: 0.8,  changeFrequency: "monthly" },
  { path: "/objectives",               priority: 0.7,  changeFrequency: "monthly" },
  { path: "/history",                  priority: 0.7,  changeFrequency: "monthly" },
  { path: "/annual-plan",              priority: 0.6,  changeFrequency: "monthly" },
  { path: "/contact",                  priority: 0.8,  changeFrequency: "monthly" },

  // Administration
  { path: "/founder-info",             priority: 0.7,  changeFrequency: "monthly" },
  { path: "/principal-info",           priority: 0.7,  changeFrequency: "monthly" },

  // Staff
  { path: "/staff",                    priority: 0.7,  changeFrequency: "monthly" },

  // Academic
  { path: "/class-routine",            priority: 0.8,  changeFrequency: "monthly" },
  { path: "/holidays",                 priority: 0.7,  changeFrequency: "monthly" },
  { path: "/fees",                     priority: 0.8,  changeFrequency: "monthly" },

  // Admission
  { path: "/prospectus",               priority: 0.9,  changeFrequency: "monthly" },
  { path: "/admission-rules",          priority: 0.8,  changeFrequency: "monthly" },
  { path: "/admission-process",        priority: 0.8,  changeFrequency: "monthly" },
  { path: "/admission-exam-result",    priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/admission-exam-question",  priority: 0.7,  changeFrequency: "monthly" },

  // Exam
  { path: "/exam-rules",               priority: 0.7,  changeFrequency: "monthly" },
  { path: "/exam-schedule",            priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/syllabus",                 priority: 0.8,  changeFrequency: "monthly" },

  // Gallery
  { path: "/academic-photos",          priority: 0.6,  changeFrequency: "weekly"  },
  { path: "/academic-videos",          priority: 0.6,  changeFrequency: "weekly"  },

  // Courses
  { path: "/courses",                  priority: 0.9,  changeFrequency: "monthly" },
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