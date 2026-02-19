import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import BowlDetail from './BowlDetail';
import PriceBreakdown from './PriceBreakdown';

export default function OrderSummary() {
  const bowls = useOrderStore((s) => s.bowls);
  const editBowl = useOrderStore((s) => s.editBowl);
  const removeBowl = useOrderStore((s) => s.removeBowl);
  const addAnotherBowl = useOrderStore((s) => s.addAnotherBowl);
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-28"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Tu pedido
      </h2>
      <p className="text-gris mb-6">Revisa tu pedido antes de continuar</p>

      {/* Bowls */}
      <div className="space-y-3 mb-6">
        {bowls.map((bowl, idx) => (
          <BowlDetail
            key={idx}
            bowl={bowl}
            index={idx}
            onEdit={editBowl}
            onRemove={removeBowl}
          />
        ))}
      </div>

      {/* Add another bowl */}
      <button
        onClick={addAnotherBowl}
        className="w-full p-3 rounded-xl border-2 border-dashed border-dorado/40
                   text-dorado font-medium text-sm
                   hover:border-dorado hover:bg-dorado-light
                   transition-colors cursor-pointer mb-6"
      >
        + Agregar otro bowl
      </button>

      {/* Price breakdown */}
      <div className="mb-8">
        <PriceBreakdown />
      </div>

    </motion.div>
  );
}
