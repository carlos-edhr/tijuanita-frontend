import React, { useState, useEffect, Suspense, lazy } from "react";
import { cmsService, type CMSLandingPageContent } from "@/services/cmsService";
import ErrorBoundary from "@/components/ErrorBoundary";

const Navbar = lazy(() => import("./sections/Navbar"));
const Hero = lazy(() => import("./sections/Hero"));
const QueEs = lazy(() => import("./sections/QueEs"));
const WhoWeAre = lazy(() => import("./sections/WhoWeAre"));
const Gallery = lazy(() => import("./sections/Gallery"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/Footer"));

const SectionSkeleton = () => (
  <div className="min-h-[300px] animate-pulse bg-gray-100/30" />
);

const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="h-16 w-64 bg-gray-200/50 rounded-lg mx-auto animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-gray-200/30 rounded-3xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const defaultContent: CMSLandingPageContent = {
  config: null,
  navbar: null,
  hero: null,
  quees: null,
  whoweare: null,
  gallery: null,
  contact: null,
  footer: null,
  ctas: [],
};

const LandingPage: React.FC = () => {
  const [content, setContent] = useState<CMSLandingPageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getLandingPageContent();
        setContent(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch CMS content:", err);
        setError("Using default content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <main className="bg-blancoHuesoFondo z-10 relative min-h-screen w-screen">
        <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md animate-pulse" />
        <HeroSkeleton />
      </main>
    );
  }

  return (
    <main className="bg-blancoHuesoFondo z-10 relative min-h-screen w-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <Navbar content={content.navbar} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<HeroSkeleton />}>
          <Hero content={content.hero} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <QueEs content={content.quees} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <WhoWeAre content={content.whoweare} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <Gallery content={content.gallery} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact content={content.contact} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton />}>
          <Footer content={content.footer} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default LandingPage;
