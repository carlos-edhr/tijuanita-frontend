import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Instagram, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { cmsService, type CMSGallery, type CMSGalleryImage } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";
import { SOCIAL_LINKS } from "@/constants/social";

interface GalleryProps {
  content: CMSGallery | null;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: "/gallery/galería-1.-Caminatas.jpg",
    alt: "Caminatas",
    description: "Caminatas.",
  },
  {
    id: "2",
    src: "/gallery/galería 2. recrear las calles.jpg",
    alt: "Recrear las calles",
    description: "Recrear las calles.",
  },
  {
    id: "3",
    src: "/gallery/Galería-3.-Talleres-creativos.jpg",
    alt: "Talleres creativos",
    description: "Talleres recreativos.",
  },
  {
    id: "4",
    src: "/gallery/galería 4. colaboraciones multidisciplinarias_.jpg",
    alt: "Colaboraciones multidisciplinarias",
    description: "Colaboraciones multidisciplinarias.",
  },
  {
    id: "5",
    src: "/gallery/Galería 5. territorios de paz.jpg",
    alt: "Territorios de paz",
    description: "Territorios de paz.",
  },
  {
    id: "6",
    src: "/gallery/Galería 6. Socialización vecinal.JPG",
    alt: "Socialización vecinal",
    description: "Socialización vecinal.",
  },
  {
    id: "7",
    src: "/gallery/Galería 7. actividad física_.png",
    alt: "Actividad física",
    description: "Actividad física.",
  },
  {
    id: "8",
    src: "/gallery/Galería 8. Iniciativa voluntaria.jpg",
    alt: "Iniciativa voluntaria",
    description: "Iniciativa voluntaria.",
  },
  {
    id: "9",
    src: "/gallery/Galería 9. convivencia intergeneracional.jpg",
    alt: "Convivencia intergeneracional",
    description: "Convivencia intergeneracional.",
  },
];

const Gallery: React.FC<GalleryProps> = ({ content }) => {
  const { language, getLocalizedValue } = useLanguage();
  const title = getLocalizedValue(content?.title);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoadingImages(true);
        const images = await cmsService.getGalleryImages();
        if (images.length > 0) {
          // Map CMSGalleryImage to GalleryItem
          const mappedImages = images
            .filter(img => img.is_active && img.image) // Only active images with image URL
            .sort((a, b) => a.order - b.order) // Sort by order
            .map((img, index) => ({
              id: img.id?.toString() || `cms-${index}`,
              src: img.image || '',
              alt: img.alt_text?.es || img.title?.es || 'Gallery image',
              description: img.description?.es || img.title?.es || '',
            }));
          setGalleryImages(mappedImages);
        } else {
          // Fallback to hardcoded images
          setGalleryImages(galleryItems);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
        setGalleryImages(galleryItems);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === "Escape") {
          setSelectedItem(null);
          setScale(1);
        }
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const goToNext = () => {
    if (!selectedItem) return;
    const currentIndex = galleryImages.findIndex(
      (item) => item.id === selectedItem.id
    );
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedItem(galleryImages[nextIndex]);
    setScale(1);
  };

  const goToPrev = () => {
    if (!selectedItem) return;
    const currentIndex = galleryImages.findIndex(
      (item) => item.id === selectedItem.id
    );
    const prevIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedItem(galleryImages[prevIndex]);
    setScale(1);
  };

  if (!mounted) return null;

  if (loadingImages) {
    return (
      <section
        id="galeria"
        className="relative overflow-hidden bg-blancoHuesoFondo py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[url('/images/textures/noise.jpg')] opacity-10 mix-blend-soft-light" />
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200/30 rounded-lg animate-pulse max-w-md mx-auto mb-8" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="galeria"
      className="relative overflow-hidden bg-blancoHuesoFondo py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[url('/images/textures/noise.jpg')] opacity-10 mix-blend-soft-light" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full bg-[#fde047]/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-kawaiiRT text-4xl text-white md:text-6xl mb-8">
            <span className="block bg-gradient-to-r from-moradoSecundario to-[#0a33ff] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        </motion.div>

        {galleryImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">No hay imágenes en la galería.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {galleryImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-2xl border-4 border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition-all hover:border-[#FDE047]/30 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  initial={{ y: 20 }}
                  whileInView={{ y: 0 }}
                >
                  <p className="text-xs md:text-sm font-semibold line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FDE047] via-[#4ECDC4] to-[#FDE047] bg-[length:200%_auto] px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
          >
            Ver más recuerdos en Instagram
            <Instagram className="ml-2 h-5 w-5 md:h-6 md:w-6 text-gray-900" />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setSelectedItem(null);
              setScale(1);
            }}
          >
            <div
              className="relative w-full max-w-6xl max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hover:bg-[#FDE047]/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hover:bg-[#FDE047]/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale((s) => Math.min(s + 0.25, 3));
                  }}
                  className="bg-black/50 p-2 rounded-full hover:bg-[#FDE047]/20 transition-colors"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale((s) => Math.max(s - 0.25, 1));
                  }}
                  className="bg-black/50 p-2 rounded-full hover:bg-[#FDE047]/20 transition-colors"
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                    setScale(1);
                  }}
                  className="bg-black/50 p-2 rounded-full hover:bg-[#FDE047]/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div
                className="relative aspect-video overflow-hidden"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-center text-sm md:text-base">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
