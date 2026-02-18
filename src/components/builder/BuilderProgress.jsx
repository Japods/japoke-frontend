import { BUILDER_STEPS } from '../../lib/constants';

export default function BuilderProgress({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6 overflow-x-auto pb-2">
      {BUILDER_STEPS.map((s, idx) => {
        const isActive = currentStep === idx;
        const isCompleted = currentStep > idx;

        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-200
                  ${isActive ? 'bg-naranja text-white scale-110' :
                    isCompleted ? 'bg-success text-white' :
                    'bg-gris-light text-gris'}
                `}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                  isActive ? 'text-naranja' : isCompleted ? 'text-success' : 'text-gris'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < BUILDER_STEPS.length - 1 && (
              <div
                className={`w-4 sm:w-6 h-0.5 mx-0.5 mt-[-12px] rounded-full ${
                  isCompleted ? 'bg-success' : 'bg-gris-light'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
