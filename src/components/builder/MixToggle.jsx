import { motion } from 'framer-motion';

export default function MixToggle({ isActive, onToggle, label = 'Mezcla 50/50' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${isActive ? 'bg-naranja' : 'bg-gris-border'}
        `}
      >
        <motion.div
          animate={{ x: isActive ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
      <span
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-naranja' : 'text-gris group-hover:text-negro'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
