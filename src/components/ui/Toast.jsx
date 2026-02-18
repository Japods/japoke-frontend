import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'error', show, onClose, duration = 4000 }) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const colors = {
    error: 'bg-error text-white',
    success: 'bg-success text-white',
    info: 'bg-dorado text-white',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-4 right-4 z-[100] flex justify-center"
        >
          <div
            className={`
              max-w-md w-full px-4 py-3 rounded-xl shadow-lg
              flex items-center justify-between gap-3
              ${colors[type]}
            `}
          >
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
              onClick={onClose}
              className="shrink-0 opacity-70 hover:opacity-100 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
