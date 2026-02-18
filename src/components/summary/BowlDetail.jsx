import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePriceCalculator from '../../hooks/usePriceCalculator';
import { formatCurrency } from '../../lib/formatters';
import useCatalogStore from '../../store/useCatalogStore';

export default function BowlDetail({ bowl, index, onEdit, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const { getBowlPrice } = usePriceCalculator();
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);

  const price = getBowlPrice(bowl);
  const pokeType = pokeTypes.find((pt) => pt._id === bowl.pokeType);
  const pokeTypeName = pokeType?.name || 'Poke';

  const proteinNames = bowl.proteins.map((p) => p.name).join(' + ');
  const baseNames = bowl.bases.map((b) => b.name).join(' + ');

  return (
    <div className="border border-gris-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gris-light/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-negro text-sm">
            Bowl {index + 1}: {pokeTypeName}
          </p>
          <p className="text-xs text-gris truncate mt-0.5">
            {proteinNames}{bowl.isMixProtein ? ' 50/50' : ''} • {baseNames}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-3">
          <span className="font-bold text-naranja">{formatCurrency(price)}</span>
          <svg
            className={`w-4 h-4 text-gris transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 text-sm border-t border-gris-border pt-3">
              <DetailRow label="Proteína" value={proteinNames} />
              <DetailRow label="Base" value={baseNames} />
              {bowl.vegetables.length > 0 && (
                <DetailRow label="Vegetales" value={bowl.vegetables.map((v) => v.name).join(', ')} />
              )}
              {bowl.sauces.length > 0 && (
                <DetailRow label="Salsas" value={bowl.sauces.map((s) => s.name).join(', ')} />
              )}
              {bowl.toppings.length > 0 && (
                <DetailRow label="Toppings" value={bowl.toppings.map((t) => t.name).join(', ')} />
              )}
              {bowl.extras.length > 0 && (
                <div>
                  <span className="text-gris">Extras:</span>
                  {bowl.extras.map((e) => (
                    <span key={e.item} className="ml-2 text-negro">
                      {e.name} x{e.quantity} ({formatCurrency(e.extraPrice * e.quantity)})
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onEdit(index)}
                  className="text-xs text-dorado font-medium hover:text-dorado/80 cursor-pointer"
                >
                  Editar
                </button>
                <span className="text-gris-border">|</span>
                <button
                  onClick={() => onRemove(index)}
                  className="text-xs text-error font-medium hover:text-error/80 cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex">
      <span className="text-gris w-20 shrink-0">{label}:</span>
      <span className="text-negro">{value}</span>
    </div>
  );
}
