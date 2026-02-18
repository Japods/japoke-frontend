import { motion } from 'framer-motion';
import usePriceCalculator from '../../hooks/usePriceCalculator';
import useBuilderRules from '../../hooks/useBuilderRules';
import { formatCurrency } from '../../lib/formatters';

export default function BottomSummary({
  onNext,
  onPrev,
  nextLabel = 'Siguiente',
  disabled = false,
  showPrev = true,
}) {
  const { currentBowlPrice, currentExtrasTotal } = usePriceCalculator();
  const { basePrice } = useBuilderRules();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gris-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Price row */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gris">Tu bowl</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-negro">
                {formatCurrency(currentBowlPrice)}
              </span>
              {currentExtrasTotal > 0 && (
                <span className="text-xs text-gris">
                  ({formatCurrency(basePrice)} + {formatCurrency(currentExtrasTotal)} extras)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex gap-3">
          {showPrev && (
            <button
              onClick={onPrev}
              className="flex-1 py-2.5 border-2 border-gris-border text-negro font-semibold rounded-xl
                         hover:bg-gris-light transition-colors duration-200 cursor-pointer"
            >
              ← Anterior
            </button>
          )}
          <button
            onClick={onNext}
            disabled={disabled}
            className="flex-[2] py-2.5 bg-naranja text-white font-semibold rounded-xl
                       hover:bg-naranja-dark transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
