import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const AppFooter: React.FC = () => {
  return (
    <footer className="py-8 px-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 text-sm mb-3">
            © {new Date().getFullYear()} Tijuanita Mi Ciudad. Todos los derechos reservados.
          </p>
          <motion.a
            href="https://www.bitspirals.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gray-500">Developed by</span>
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg tracking-wide group-hover:from-violet-500 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-300">
              Bitspirals
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
};

export default AppFooter;
