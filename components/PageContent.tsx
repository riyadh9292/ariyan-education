"use client"
import { useEffect, useState } from "react"
import ResultTable from "@/components/ResultTable"
import StaffCards from "@/components/Staffcards"
import PhotoGallery from "@/components/PhotoGallery"
import VideoGallery from "@/components/VideoGallery"
import ContactPage from "./ContactPage"
import PageWrapper from "./PageWrapper"
import CoursesSection from "./CoursesSection"
import RoutineTable from "./RoutineTable"
import AdmissionTestQuestions from "./AdmissionTestQuestions"
import AdmissionTestResult from "./AdmissionTestResult"

interface Props {
  slug        : string
  defaultTitle: string   // title from menu (server side)
}

export default function PageContent({ slug, defaultTitle }: Props) {
  const [title,   setTitle]   = useState(defaultTitle)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/page?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.title)   setTitle(data.title)
        if (data.content) setContent(data.content)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // Special pages that don't use RTE content
  const isSpecialPage = ["results", "staff", "academic-photos", "academic-videos"].includes(slug)

  return (
    <div className="w-[99%] sm:w-[80vw] mx-auto py-16 px-0 sm:px-6">
      {/* <h1 className="text-3xl font-bold mb-6">{title}</h1> */}

      {loading && !isSpecialPage ? (
        // Skeleton loader while fetching
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      ) : slug === "results" ? (
        <ResultTable />
      ) : slug === "staff" ? (
        <StaffCards />
      ) : slug === "academic-photos" ? (
        <PhotoGallery />
      ) : slug === "academic-videos" ? (
        <VideoGallery />
      ) : slug === "contact" ? (
        <ContactPage content={content} title={title} />
      ) : slug === "courses" ? (
        <CoursesSection />
      ) : slug === "class-routine" ? (
        <RoutineTable />
      ) : slug === "questions" ? (
        <AdmissionTestQuestions />
      ) : slug === "result" ? (
        <AdmissionTestResult />
      ) : content ? (
        <PageWrapper
          title={title}
          subtitle=""
          // subtitle="প্রকাশিত কনটেন্ট সমূহ"
          // icon={resultsIcon}
        >
        <div
          className="quill-content text-gray-700 leading-7 break-words overflow-wrap-anywhere"
          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </PageWrapper>
      ) : (
        <p className="text-gray-400">এই পেজের কনটেন্ট শীঘ্রই যুক্ত করা হবে।</p>
      )}
    </div>
  )
}