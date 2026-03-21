import { useState } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import useCatalogStore from '../../store/useCatalogStore';
import { validateDiscountCode } from '../../api/client';
import BowlDetail from './BowlDetail';
import PriceBreakdown from './PriceBreakdown';
import Counter from '../ui/Counter';
import { formatCurrency } from '../../lib/formatters';

export default function OrderSummary() {
  const bowls = useOrderStore((s) => s.bowls);
  const editBowl = useOrderStore((s) => s.editBowl);
  const removeBowl = useOrderStore((s) => s.removeBowl);
  const addAnotherBowl = useOrderStore((s) => s.addAnotherBowl);
  const selectedPromotion = useOrderStore((s) => s.selectedPromotion);
  const discountCode = useOrderStore((s) => s.discountCode);
  const setDiscountCode = useOrderStore((s) => s.setDiscountCode);
  const addOns = useOrderStore((s) => s.addOns);
  const addAddOn = useOrderStore((s) => s.addAddOn);
  const removeAddOn = useOrderStore((s) => s.removeAddOn);
  const categories = useCatalogStore((s) => s.categories);

  const addOnItems = categories
    .filter((cat) => cat.type === 'beverage' || cat.type === 'dessert')
    .flatMap((cat) => cat.items.filter((item) => item.isAvailable !== false));

  const [codeInput, setCodeInput] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  async function handleApplyCode() {
    if (!codeInput.trim()) return;
    setCodeLoading(true);
    setCodeError('');
    try {
      const data = await validateDiscountCode(codeInput.trim());
      setDiscountCode({ code: data.code, percentage: data.percentage });
      setCodeInput('');
    } catch (err) {
      setCodeError(err.message || 'Código inválido');
    } finally {
      setCodeLoading(false);
    }
  }

  function handleRemoveCode() {
    setDiscountCode(null);
    setCodeInput('');
    setCodeError('');
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-28"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Tu pedido
      </h2>
      <p className="text-gris mb-6">Revisa tu pedido antes de continuar</p>

      {/* Promo badge */}
      {selectedPromotion && (
        <div className="mb-4 p-3 rounded-xl bg-dorado-light border border-dorado/30 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-dorado/20 text-dorado uppercase tracking-wide">
            Promo
          </span>
          <span className="text-sm font-semibold text-negro">{selectedPromotion.name}</span>
        </div>
      )}

      {/* Bowls */}
      <div className="space-y-3 mb-6">
        {bowls.map((bowl, idx) => (
          <BowlDetail
            key={idx}
            bowl={bowl}
            index={idx}
            onEdit={editBowl}
            onRemove={removeBowl}
          />
        ))}
      </div>

      {/* Add another bowl */}
      <button
        onClick={addAnotherBowl}
        className="w-full p-3 rounded-xl border-2 border-dashed border-dorado/40
                   text-dorado font-medium text-sm
                   hover:border-dorado hover:bg-dorado-light
                   transition-colors cursor-pointer mb-6"
      >
        + Agregar otro bowl
      </button>

      {/* Complementos */}
      {addOnItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-heading font-bold text-negro mb-3">
            ¿Quieres agregar algo más?
          </h3>
          <div className="space-y-2">
            {addOnItems.map((item) => {
              const current = addOns.find((a) => a.item === item._id);
              const qty = current ? current.quantity : 0;

              return (
                <div
                  key={item._id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    qty > 0
                      ? 'border-naranja/30 bg-naranja-light'
                      : 'border-gris-border bg-white'
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-sm text-negro">{item.name}</p>
                    {item.portionSize > 0 && (
                      <p className="text-xs text-gris">{item.portionSize}g</p>
                    )}
                    <span className="text-xs font-semibold text-naranja">
                      {formatCurrency(item.extraPrice)}
                    </span>
                  </div>
                  <Counter
                    value={qty}
                    onIncrement={() => addAddOn(item)}
                    onDecrement={() => removeAddOn(item._id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discount code - only if no promo */}
      {!selectedPromotion && (
        <div className="mb-6">
          {discountCode ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
              <div>
                <p className="text-sm font-semibold text-green-700">
                  Código: {discountCode.code}
                </p>
                <p className="text-xs text-green-600">{discountCode.percentage}% de descuento aplicado</p>
              </div>
              <button
                onClick={handleRemoveCode}
                className="text-xs text-red-500 font-medium hover:text-red-700 cursor-pointer"
              >
                Quitar
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-negro mb-1.5">
                ¿Tienes un código de descuento?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value.toUpperCase());
                    setCodeError('');
                  }}
                  placeholder="Ej: JAPOKE15"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gris-border text-sm
                             focus:outline-none focus:border-naranja focus:ring-2 focus:ring-naranja/20
                             placeholder:text-gris/50"
                />
                <button
                  type="button"
                  onClick={handleApplyCode}
                  disabled={codeLoading || !codeInput.trim()}
                  className="px-4 py-2.5 bg-naranja text-white text-sm font-semibold rounded-xl
                             hover:bg-naranja-dark transition-colors cursor-pointer
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {codeLoading ? '...' : 'Aplicar'}
                </button>
              </div>
              {codeError && (
                <p className="text-xs text-error mt-1">{codeError}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Price breakdown */}
      <div className="mb-8">
        <PriceBreakdown />
      </div>

    </motion.div>
  );
}
