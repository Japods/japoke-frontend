import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

export default function IngredientCard({
  name,
  isSelected = false,
  isDisabled = false,
  isSoldOut = false,
  tier,
  extraPrice,
  onClick,
}) {
  const effectiveDisabled = isDisabled || isSoldOut;
  return (
    <motion.button
      type="button"
      whileTap={!effectiveDisabled ? { scale: 0.95 } : {}}
      layout
      onClick={!effectiveDisabled ? onClick : undefined}
      className={`
        relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        min-h-[56px]
        ${effectiveDisabled && !isSelected
          ? 'opacity-40 cursor-not-allowed border-gris-border bg-gris-light'
          : 'cursor-pointer'
        }
        ${isSelected
          ? 'border-naranja bg-naranja-light shadow-md shadow-naranja/10 scale-[1.02]'
          : !effectiveDisabled
            ? 'border-gris-border bg-white hover:border-dorado/50 hover:shadow-sm'
            : ''
        }
      `}
    >
      {/* Checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-2 right-2 w-5 h-5 bg-naranja rounded-full flex items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6l2.5 2.5 4.5-5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      <span className="font-medium text-negro text-sm block pr-6">{name}</span>

      {(tier || extraPrice > 0 || isSoldOut) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {isSoldOut && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              Agotado
            </span>
          )}
          {tier && (
            <Badge variant={tier === 'premium' ? 'premium' : 'base'}>
              {tier === 'premium' ? 'Premium' : 'Base'}
            </Badge>
          )}
          {extraPrice > 0 && (
            <Badge variant="price">+${extraPrice}</Badge>
          )}
        </div>
      )}
    </motion.button>
  );
}
