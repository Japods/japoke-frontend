import { useEffect, useRef } from 'react';
import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import MixToggle from './MixToggle';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function ProteinSelector({ onNext, onPrev }) {
  const getProteinsByTiers = useCatalogStore((s) => s.getProteinsByTiers);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const selectProtein = useOrderStore((s) => s.selectProtein);
  const toggleMixProtein = useOrderStore((s) => s.toggleMixProtein);
  const selectedPromotion = useOrderStore((s) => s.selectedPromotion);
  const nextBuilderStep = useOrderStore((s) => s.nextBuilderStep);
  const { pokeTypeName, proteinGrams } = useBuilderRules();

  // Premium: solo premium en individual, ambas tiers en 50/50; Base: siempre solo base.
  // Si la promo restringe proteínas, esa lista manda y se ignora el tier filter
  // (la promo puede permitir bases en un Premium, p.ej. "2 Premium con Pollo").
  const isLockedByPromo = selectedPromotion?.allowedProteins?.length > 0;
  let rawProteins;
  if (isLockedByPromo) {
    const allowedIds = selectedPromotion.allowedProteins.map((p) => p._id || p);
    rawProteins = getProteinsByTiers(['premium', 'base'])
      .filter((p) => !p.extraOnly && allowedIds.includes(p._id));
  } else {
    const tierFilter =
      pokeTypeName.toLowerCase() === 'premium'
        ? currentBowl.isMixProtein
          ? ['premium', 'base']
          : ['premium']
        : ['base'];
    rawProteins = getProteinsByTiers(tierFilter).filter((p) => !p.extraOnly);
  }

  // Expand items with preparationStyles into virtual entries
  const proteins = rawProteins.flatMap((p) =>
    p.preparationStyles?.length
      ? p.preparationStyles.map((style) => ({
          ...p,
          _virtId: `${p._id}_${style.id}`,
          name: style.label,
          preparationStyle: style.id,
        }))
      : [{ ...p, _virtId: p._id, preparationStyle: null }]
  );

  const selectedVirtIds = currentBowl.proteins.map(
    (p) => `${p.item}_${p.preparationStyle ?? ''}`
  );
  const maxCount = currentBowl.isMixProtein ? 2 : 1;
  const isComplete = selectedVirtIds.length === maxCount;

  const perPortionGrams = currentBowl.isMixProtein
    ? proteinGrams / 2
    : proteinGrams;

  // Si la promo deja exactamente las proteínas necesarias y ninguna requiere
  // elegir estilo de preparación (plancha/crispie), seleccionamos auto y saltamos.
  // Ref-guard porque selectProtein es toggle: en StrictMode, dos corridas del effect
  // deseleccionan la proteína y llaman nextBuilderStep dos veces.
  const didAutoSkipRef = useRef(false);
  useEffect(() => {
    if (didAutoSkipRef.current) return;
    if (!isLockedByPromo) return;
    if (currentBowl.proteins.length > 0) return;
    const exactlyEnough = rawProteins.length === maxCount;
    const noStyles = rawProteins.every((p) => !p.preparationStyles?.length);
    if (exactlyEnough && noStyles) {
      didAutoSkipRef.current = true;
      proteins.forEach((p) => selectProtein(p));
      nextBuilderStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tu proteína
      </h3>
      <p className="text-sm text-gris mb-4">
        {proteinGrams}g incluidos
        {currentBowl.isMixProtein && ` (${perPortionGrams}g + ${perPortionGrams}g)`}
      </p>

      <MixToggle
        isActive={currentBowl.isMixProtein}
        onToggle={toggleMixProtein}
        label={`Mezcla 50/50 (${proteinGrams / 2}g + ${proteinGrams / 2}g)`}
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        {proteins.map((p) => (
          <IngredientCard
            key={p._virtId}
            name={p.name}
            tier={p.tier}
            isSelected={selectedVirtIds.includes(`${p._id}_${p.preparationStyle ?? ''}`)}
            isDisabled={
              !selectedVirtIds.includes(`${p._id}_${p.preparationStyle ?? ''}`) &&
              selectedVirtIds.length >= maxCount
            }
            isSoldOut={isItemSoldOut(p)}
            onClick={() => selectProtein(p)}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gris">
        {selectedVirtIds.length} de {maxCount} seleccionada{maxCount > 1 ? 's' : ''}
      </div>

      <BuilderNav
        onPrev={onPrev}
        onNext={onNext}
        canGoBack={true}
        canGoNext={isComplete}
      />
    </div>
  );
}
