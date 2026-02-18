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
  const { maxVegetables } = useBuilderRules();

  const vegetables = getItemsByType('vegetable');
  const selectedIds = currentBowl.vegetables.map((v) => v.item);
  const atMax = selectedIds.length >= maxVegetables;

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tus vegetales
      </h3>
      <p className="text-sm text-gris mb-6">
        <span className={`font-semibold ${atMax ? 'text-naranja' : 'text-negro'}`}>
          {selectedIds.length}
        </span>{' '}
        de {maxVegetables} seleccionados
      </p>

      <div className="grid grid-cols-2 gap-3">
        {vegetables.map((v) => (
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

      <BuilderNav
        onPrev={onPrev}
        onNext={onNext}
        canGoBack={true}
        canGoNext={true}
      />
    </div>
  );
}
