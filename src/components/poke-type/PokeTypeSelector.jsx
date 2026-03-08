import { motion } from 'framer-motion';
import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import PokeTypeCard from './PokeTypeCard';
import { formatCurrency } from '../../lib/formatters';

function PromoCard({ promo, pokeTypes, onSelect }) {
  const ptNames = promo.pokeTypes.map((pt) => {
    const found = pokeTypes.find((p) => p._id === pt.pokeType?._id || p._id === pt.pokeType);
    return `${pt.quantity} ${found?.name || 'Poke'}`;
  }).join(' + ');

  const proteinNames = promo.allowedProteins?.length > 0
    ? promo.allowedProteins.map((p) => p.name || p).join(', ')
    : null;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full text-left p-5 rounded-2xl border-2 border-dorado bg-dorado-light
                 hover:shadow-lg hover:shadow-dorado/10 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-dorado/20 text-dorado uppercase tracking-wide">
          Promo
        </span>
      </div>
      <h3 className="text-lg font-heading font-bold text-negro mb-1">{promo.name}</h3>
      {promo.description && (
        <p className="text-sm text-gris mb-2">{promo.description}</p>
      )}
      <p className="text-sm text-gris mb-1">{ptNames}</p>
      {proteinNames && (
        <p className="text-xs text-dorado font-medium mb-3">Proteína: {proteinNames}</p>
      )}
      <p className="text-2xl font-heading font-extrabold text-naranja">
        {formatCurrency(promo.promoPrice)}
      </p>
    </motion.button>
  );
}

export default function PokeTypeSelector({ onNext }) {
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);
  const promotions = useCatalogStore((s) => s.promotions);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const setPokeType = useOrderStore((s) => s.setPokeType);
  const selectedPromotion = useOrderStore((s) => s.selectedPromotion);
  const selectPromotion = useOrderStore((s) => s.selectPromotion);
  const promoBowlsBuilt = useOrderStore((s) => s.promoBowlsBuilt);

  const activePromos = promotions.filter((p) => p.active);

  // If in promo mode, show which promo bowl we're building
  const isPromoMode = !!selectedPromotion;
  const currentPromoPokeType = isPromoMode
    ? getPromoPokeTypeForCurrentBowl(selectedPromotion, promoBowlsBuilt)
    : null;

  // Auto-select poke type if promo dictates it
  function handlePromoSelect(promo) {
    selectPromotion(promo);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-28"
    >
      {isPromoMode && (
        <div className="mb-6 p-4 rounded-2xl bg-dorado-light border border-dorado/30">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-dorado/20 text-dorado uppercase tracking-wide">
              Promo
            </span>
            <span className="text-sm font-semibold text-negro">{selectedPromotion.name}</span>
          </div>
          <p className="text-sm text-gris">
            Armando bowl {promoBowlsBuilt + 1} de {selectedPromotion.totalQuantity}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Elige tu poke
      </h2>
      <p className="text-gris mb-8">
        {isPromoMode
          ? `Selecciona el tipo para el bowl ${promoBowlsBuilt + 1}`
          : 'Selecciona el tipo de bowl que quieres armar'}
      </p>

      {/* Promotions first */}
      {!isPromoMode && activePromos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-heading font-bold text-negro mb-2">
            Promociones
          </h3>
          <p className="text-gris text-sm mb-4">Aprovecha nuestras ofertas especiales</p>
          <div className="space-y-3">
            {activePromos.map((promo) => (
              <PromoCard
                key={promo._id}
                promo={promo}
                pokeTypes={pokeTypes}
                onSelect={() => handlePromoSelect(promo)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Poke types */}
      {!isPromoMode && activePromos.length > 0 && (
        <h3 className="text-lg font-heading font-bold text-negro mb-4">O arma tu bowl individual</h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pokeTypes.map((pt) => {
          if (isPromoMode && currentPromoPokeType && !isPokeTypeAllowedForPromoBowl(selectedPromotion, promoBowlsBuilt, pt._id)) {
            return null;
          }
          return (
            <PokeTypeCard
              key={pt._id}
              pokeType={pt}
              isSelected={currentBowl.pokeType === pt._id}
              onSelect={() => setPokeType(pt._id)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * Given the promo config and the current bowl index being built,
 * determine which pokeType IDs are allowed for this bowl.
 */
function getPromoPokeTypeForCurrentBowl(promo, bowlIndex) {
  let count = 0;
  for (const pt of promo.pokeTypes) {
    const pokeTypeId = pt.pokeType?._id || pt.pokeType;
    for (let i = 0; i < pt.quantity; i++) {
      if (count === bowlIndex) return pokeTypeId;
      count++;
    }
  }
  return null;
}

function isPokeTypeAllowedForPromoBowl(promo, bowlIndex, pokeTypeId) {
  // Build a flat array of allowed poke type IDs for each bowl slot
  const slots = [];
  for (const pt of promo.pokeTypes) {
    const id = pt.pokeType?._id || pt.pokeType;
    for (let i = 0; i < pt.quantity; i++) {
      slots.push(id);
    }
  }
  // If only one type in the slot, must match
  if (bowlIndex < slots.length) {
    return slots[bowlIndex] === pokeTypeId;
  }
  return true;
}
