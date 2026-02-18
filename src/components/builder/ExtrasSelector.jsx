import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import usePriceCalculator from '../../hooks/usePriceCalculator';
import Counter from '../ui/Counter';
import Badge from '../ui/Badge';
import BuilderNav from './BuilderNav';
import { formatCurrency } from '../../lib/formatters';
import { isItemSoldOut } from '../../lib/utils';

export default function ExtrasSelector({ onFinish, onPrev }) {
  const categories = useCatalogStore((s) => s.categories);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const addExtra = useOrderStore((s) => s.addExtra);
  const removeExtra = useOrderStore((s) => s.removeExtra);
  const { currentExtrasTotal } = usePriceCalculator();

  // Build available extras from all categories
  const extraItems = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.extraPrice > 0) {
        extraItems.push({
          ...item,
          categoryName: cat.name,
          categoryType: cat.type,
        });
      }
    }
  }

  function getExtraQty(itemId) {
    const e = currentBowl.extras.find((x) => x.item === itemId);
    return e ? e.quantity : 0;
  }

  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-negro mb-1">
        ¿Algo extra?
      </h3>
      <p className="text-sm text-gris mb-6">Opcional — agrega porciones adicionales</p>

      <div className="space-y-3">
        {extraItems.map((item) => {
          const soldOut = isItemSoldOut(item);
          const qty = getExtraQty(item._id);

          return (
            <div
              key={item._id}
              className={`
                flex items-center justify-between p-4 rounded-xl border
                transition-colors duration-200
                ${soldOut
                  ? 'border-gris-border/50 bg-gris-light/50 opacity-60'
                  : qty > 0
                    ? 'border-naranja/30 bg-naranja-light'
                    : 'border-gris-border bg-white'
                }
              `}
            >
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm ${soldOut ? 'text-gris line-through' : 'text-negro'}`}>
                    {item.name}
                  </p>
                  {soldOut && (
                    <span className="text-[10px] font-semibold text-error bg-error/10 px-1.5 py-0.5 rounded">
                      Agotado
                    </span>
                  )}
                </div>
                {!soldOut && (
                  <Badge variant="price" className="mt-1">
                    +{formatCurrency(item.extraPrice)}
                  </Badge>
                )}
              </div>

              {!soldOut && (
                <Counter
                  value={qty}
                  onIncrement={() => addExtra(item)}
                  onDecrement={() => removeExtra(item._id)}
                />
              )}
            </div>
          );
        })}
      </div>

      {currentExtrasTotal > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-dorado-light border border-dorado/20">
          <p className="text-sm text-dorado font-semibold">
            Extras: {formatCurrency(currentExtrasTotal)}
          </p>
        </div>
      )}

      <BuilderNav
        onPrev={onPrev}
        onNext={onFinish}
        canGoBack={true}
        canGoNext={true}
        nextLabel="Agregar al pedido"
        isLast
      />
    </div>
  );
}
