import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function VegetableSelector({ onNext, onPrev }) {
  const getItemsByType = useCatalogStore((s) => s.getItemsByType);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const toggleVegetable = useOrderStore((s) => s.toggleVegetable);
  const addExtra = useOrderStore((s) => s.addExtra);
  const removeExtra = useOrderStore((s) => s.removeExtra);
  const { maxVegetables } = useBuilderRules();

  const allVegetables = getItemsByType('vegetable');
  const freeVegetables = allVegetables.filter((v) => !v.extraOnly);
  const paidVegetables = allVegetables.filter((v) => v.extraOnly);

  const selectedIds = currentBowl.vegetables.map((v) => v.item);
  const atMax = selectedIds.length >= maxVegetables;

  function isPaidSelected(itemId) {
    return currentBowl.extras.some((e) => e.item === itemId);
  }

  function togglePaidVegetable(item) {
    if (isPaidSelected(item._id)) {
      removeExtra(item._id);
    } else {
      addExtra(item);
    }
  }

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tus vegetales
      </h3>
      <p className="text-sm text-gris mb-6">
        <span className={`font-semibold ${atMax ? 'text-naranja' : 'text-negro'}`}>
          {selectedIds.length}
        </span>{' '}
        de {maxVegetables} incluidos
      </p>

      <div className="grid grid-cols-2 gap-3">
        {freeVegetables.map((v) => (
          <IngredientCard
            key={v._id}
            name={v.name}
            isSelected={selectedIds.includes(v._id)}
            isDisabled={atMax && !selectedIds.includes(v._id)}
            isSoldOut={isItemSoldOut(v)}
            onClick={() => toggleVegetable(v, maxVegetables)}
          />
        ))}
      </div>

      {paidVegetables.length > 0 && (
        <>
          <p className="text-xs font-bold text-gris uppercase tracking-wider mt-6 mb-3">
            Premium
          </p>
          <div className="grid grid-cols-2 gap-3">
            {paidVegetables.map((v) => (
              <IngredientCard
                key={v._id}
                name={v.name}
                extraPrice={v.extraPrice}
                isSelected={isPaidSelected(v._id)}
                isSoldOut={isItemSoldOut(v)}
                onClick={() => togglePaidVegetable(v)}
              />
            ))}
          </div>
        </>
      )}

      <BuilderNav
        onPrev={onPrev}
        onNext={onNext}
        canGoBack={true}
        canGoNext={true}
      />
    </div>
  );
}
