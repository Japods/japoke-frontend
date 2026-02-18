import { AnimatePresence, motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import usePriceCalculator from '../../hooks/usePriceCalculator';
import { formatCurrency } from '../../lib/formatters';

export default function Header() {
  const step = useOrderStore((s) => s.step);
  const bowls = useOrderStore((s) => s.bowls);
  const { orderTotal, currentBowlPrice } = usePriceCalculator();

  const showPrice = step >= 1 && step <= 4;
  const displayTotal = step >= 3 ? orderTotal : orderTotal + currentBowlPrice;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gris-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => useOrderStore.getState().setStep(0)}
          className="font-heading font-bold text-xl text-negro tracking-tight cursor-pointer"
        >
          Ja<span className="text-naranja">poke</span>
        </button>

        <AnimatePresence>
          {showPrice && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              {bowls.length > 0 && (
                <span className="text-xs text-gris">
                  {bowls.length} bowl{bowls.length > 1 ? 's' : ''}
                </span>
              )}
              <span className="font-semibold text-naranja">
                {formatCurrency(displayTotal)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
