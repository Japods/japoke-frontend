import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function Hero({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="waves" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M0 40c20-10 40 10 80 0"
              fill="none"
              stroke="#010101"
              strokeWidth="1.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center z-10 max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-6xl sm:text-7xl font-heading font-extrabold tracking-tight">
            Ja<span className="text-naranja">poke</span>
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-dorado" />
            <span className="text-xs text-dorado font-medium uppercase tracking-widest">
              Poke Bowls
            </span>
            <div className="h-px w-8 bg-dorado" />
          </div>
        </motion.div>

        {/* Bowl emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3, stiffness: 200 }}
          className="text-7xl mb-8"
        >
          🥢
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-heading font-bold text-negro mb-3"
        >
          Arma tu Poke perfecto
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gris text-base sm:text-lg mb-10"
        >
          Poke bowls frescos, hechos a tu medida
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto min-w-[220px]">
            Hacer mi pedido
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
