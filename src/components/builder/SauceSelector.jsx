import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import useBuilderRules from '../../hooks/useBuilderRules';
import IngredientCard from './IngredientCard';
import BuilderNav from './BuilderNav';
import { isItemSoldOut } from '../../lib/utils';

export default function SauceSelector({ onNext, onPrev }) {
  const getItemsByType = useCatalogStore((s) => s.getItemsByType);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const toggleSauce = useOrderStore((s) => s.toggleSauce);
  const { maxSauces } = useBuilderRules();

  const sauces = getItemsByType('sauce');
  const selectedIds = currentBowl.sauces.map((s) => s.item);
  const atMax = selectedIds.length >= maxSauces;

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        Elige tus salsas caseras
      </h3>
      <p className="text-sm text-gris mb-6">
        <span className={`font-semibold ${atMax ? 'text-naranja' : 'text-negro'}`}>
          {selectedIds.length}
        </span>{' '}
        de {maxSauces} seleccionadas
      </p>

      <div className="grid grid-cols-2 gap-3">
        {sauces.map((s) => (
          <IngredientCard
            key={s._id}
            name={s.name}
            isSelected={selectedIds.includes(s._id)}
            isDisabled={atMax && !selectedIds.includes(s._id)}
            isSoldOut={isItemSoldOut(s)}
            onClick={() => toggleSauce(s, maxSauces)}
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
