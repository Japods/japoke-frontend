import { motion, AnimatePresence } from 'framer-motion';

export default function Counter({ value = 0, onIncrement, onDecrement, min = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border-2 border-gris-border text-negro
                   flex items-center justify-center
                   hover:border-naranja hover:text-naranja
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors duration-200 cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-6 text-center font-semibold text-negro tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>

      <button
        type="button"
        onClick={onIncrement}
        className="w-9 h-9 rounded-full border-2 border-naranja text-naranja
                   flex items-center justify-center
                   hover:bg-naranja hover:text-white
                   transition-colors duration-200 cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
