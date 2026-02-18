import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function ToppingSelector({ onNext, onPrev }) {
  const getItemsByType = useCatalogStore((s) => s.getItemsByType);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const toggleTopping = useOrderStore((s) => s.toggleTopping);
  const { maxToppings } = useBuilderRules();

  const toppings = getItemsByType('topping');
  const selectedIds = currentBowl.toppings.map((t) => t.item);
  const atMax = selectedIds.length >= maxToppings;

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tu topping
      </h3>
      <p className="text-sm text-gris mb-6">
        <span className={`font-semibold ${atMax ? 'text-naranja' : 'text-negro'}`}>
          {selectedIds.length}
        </span>{' '}
        de {maxToppings} seleccionado{maxToppings > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {toppings.map((t) => (
          <IngredientCard
            key={t._id}
            name={t.name}
            isSelected={selectedIds.includes(t._id)}
            isDisabled={atMax && !selectedIds.includes(t._id)}
            isSoldOut={isItemSoldOut(t)}
            onClick={() => toggleTopping(t, maxToppings)}
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
