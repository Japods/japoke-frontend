import { motion } from 'framer-motion';
import { MAIN_STEPS } from '../../lib/constants';

export default function ProgressBar({ currentStep }) {
  if (currentStep <= 0 || currentStep >= 5) return null;

  const visibleSteps = MAIN_STEPS.slice(1, 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-3">
      <div className="flex items-center gap-1">
        {visibleSteps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-1.5 rounded-full bg-gris-light overflow-hidden">
                {(isActive || isCompleted) && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isCompleted ? 'bg-success' : 'bg-naranja'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isActive ? 'text-naranja' : isCompleted ? 'text-success' : 'text-gris'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
