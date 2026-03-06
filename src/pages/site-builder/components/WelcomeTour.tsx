import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { 
  ChevronRight, 
  ChevronLeft, 
  X,
  Layout,
  Edit3,
  Save,
  Sparkles
} from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "sidebar",
    title: "Navega las Secciones",
    content: "Usa el menú lateral para moverte entre las diferentes secciones de tu página. Cada sección es independiente y se-edita por separado.",
    position: "right"
  },
  {
    target: "editor",
    title: "Edita el Contenido",
    content: "Aquí puedes modificar todo el contenido de la sección seleccionada. Los cambios se guardan automáticamente como borrador.",
    position: "left"
  },
  {
    target: "actions",
    title: "Guarda y Publica",
    content: "Usa 'Guardar Borrador' para guardar tus cambios o 'Publicar' para hacerlos visibles en el sitio en vivo.",
    position: "bottom"
  }
];

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("site-builder-tour-completed", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("site-builder-tour-completed", "true");
    setIsVisible(false);
    onSkip();
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("site-builder-tour-completed");
    if (hasSeenTour) {
      setIsVisible(false);
      onSkip();
    }
  }, [onSkip]);

  if (!isVisible) return null;

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return Layout;
      case 1: return Edit3;
      case 2: return Save;
      default: return Sparkles;
    }
  };

  const Icon = getStepIcon(currentStep);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Header with progress */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white/90">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Tour del Editor</span>
              </div>
              <button
                onClick={handleSkip}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Icon className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              {step.title}
            </h3>
            
            <p className="text-gray-600 text-center leading-relaxed">
              {step.content}
            </p>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep 
                      ? "bg-green-600 w-6" 
                      : index < currentStep 
                        ? "bg-green-300" 
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Omitir
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 gap-1"
              >
                {currentStep === TOUR_STEPS.length - 1 ? "¡Comenzar!" : "Siguiente"}
                {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeTour;
