import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function FruitSelector({ onNext, onPrev }) {
  const getItemsByType = useCatalogStore((s) => s.getItemsByType);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const toggleFruit = useOrderStore((s) => s.toggleFruit);
  const { maxFruits } = useBuilderRules();

  const fruits = getItemsByType('fruit');
  const selectedIds = currentBowl.fruits.map((f) => f.item);
  const atMax = selectedIds.length >= maxFruits;

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        ¿Quieres frutas?
      </h3>
      <p className="text-sm text-gris mb-6">
        Opcional — hasta{' '}
        <span className={`font-semibold ${atMax ? 'text-naranja' : 'text-negro'}`}>
          {maxFruits}
        </span>{' '}
        frutas
      </p>

      {fruits.length === 0 ? (
        <div className="rounded-2xl border border-gris-border bg-gris-light/50 p-6 text-center">
          <p className="text-sm text-gris">
            No hay frutas disponibles en este momento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {fruits.map((f) => (
            <IngredientCard
              key={f._id}
              name={f.name}
              isSelected={selectedIds.includes(f._id)}
              isDisabled={atMax && !selectedIds.includes(f._id)}
              isSoldOut={isItemSoldOut(f)}
              onClick={() => toggleFruit(f, maxFruits)}
            />
          ))}
        </div>
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
