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
  const { pokeTypeName, proteinGrams } = useBuilderRules();

  // Premium solo muestra premium, Base solo muestra base
  const tierFilter = pokeTypeName.toLowerCase() === 'premium' ? ['premium'] : ['base'];
  const rawProteins = getProteinsByTiers(tierFilter);

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
