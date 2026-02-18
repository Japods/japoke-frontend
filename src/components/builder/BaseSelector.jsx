import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import MixToggle from './MixToggle';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function BaseSelector({ onNext, onPrev }) {
  const getItemsByType = useCatalogStore((s) => s.getItemsByType);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const selectBase = useOrderStore((s) => s.selectBase);
  const toggleMixBase = useOrderStore((s) => s.toggleMixBase);
  const { baseGrams } = useBuilderRules();

  const bases = getItemsByType('base');
  const selectedIds = currentBowl.bases.map((b) => b.item);
  const maxCount = currentBowl.isMixBase ? 2 : 1;
  const isComplete = selectedIds.length === maxCount;

  const perPortionGrams = currentBowl.isMixBase ? baseGrams / 2 : baseGrams;

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tu base
      </h3>
      <p className="text-sm text-gris mb-4">
        {baseGrams}g incluidos
        {currentBowl.isMixBase && ` (${perPortionGrams}g + ${perPortionGrams}g)`}
      </p>

      <MixToggle
        isActive={currentBowl.isMixBase}
        onToggle={toggleMixBase}
        label={`Mezcla (${baseGrams / 2}g + ${baseGrams / 2}g)`}
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        {bases.map((b) => (
          <IngredientCard
            key={b._id}
            name={b.name}
            isSelected={selectedIds.includes(b._id)}
            isDisabled={!selectedIds.includes(b._id) && selectedIds.length >= maxCount}
            isSoldOut={isItemSoldOut(b)}
            onClick={() => selectBase(b)}
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
