import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../lib/formatters';
import useCatalogStore from '../../store/useCatalogStore';

export default function PokeTypeCard({ pokeType, isSelected, onSelect }) {
  const { name, basePrice, rules, allowedProteinTiers } = pokeType;
  const isPremium = name.toLowerCase() === 'premium';
  const getProteinsByTiers = useCatalogStore((s) => s.getProteinsByTiers);
  // Premium solo muestra premium, Base solo muestra base
  const tierFilter = isPremium ? ['premium'] : ['base'];
  const proteinNames = getProteinsByTiers(tierFilter).map((p) => p.name);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
        cursor-pointer
        ${
          isSelected
            ? 'border-naranja bg-naranja-light shadow-lg shadow-naranja/10'
            : 'border-gris-border bg-white hover:border-dorado/50 hover:shadow-md'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-naranja rounded-full flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}

      <div className="mb-3">
        <Badge variant={isPremium ? 'premium' : 'base'}>
          {isPremium ? 'Premium' : 'Clásico'}
        </Badge>
      </div>

      <h3 className="text-xl font-heading font-bold text-negro mb-1">{name}</h3>
      <p className="text-3xl font-heading font-extrabold text-naranja mb-4">
        {formatCurrency(basePrice)}
      </p>

      <p className="text-sm text-gris mb-3">
        {proteinNames.length > 0
          ? `Elige entre ${proteinNames.join(', ')}`
          : 'Sin proteínas disponibles'}
      </p>

      <div className="space-y-1 text-xs text-gris">
        <p>{rules.proteinGrams}g proteína • {rules.baseGrams}g base</p>
        <p>
          {rules.maxVegetables} vegetales • {rules.maxSauces} salsas • {rules.maxToppings} topping
        </p>
        
      </div>
    </motion.button>
  );
}
