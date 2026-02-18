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
  const { allowedProteinTiers, proteinGrams } = useBuilderRules();

  const proteins = getProteinsByTiers(allowedProteinTiers);
  const selectedIds = currentBowl.proteins.map((p) => p.item);
  const maxCount = currentBowl.isMixProtein ? 2 : 1;
  const isComplete = selectedIds.length === maxCount;

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
            key={p._id}
            name={p.name}
            tier={p.tier}
            isSelected={selectedIds.includes(p._id)}
            isDisabled={!selectedIds.includes(p._id) && selectedIds.length >= maxCount}
            isSoldOut={isItemSoldOut(p)}
            onClick={() => selectProtein(p)}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gris">
        {selectedIds.length} de {maxCount} seleccionada{maxCount > 1 ? 's' : ''}
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
