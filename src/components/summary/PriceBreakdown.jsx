import usePriceCalculator from '../../hooks/usePriceCalculator';
import useOrderStore from '../../store/useOrderStore';
import { formatCurrency } from '../../lib/formatters';

export default function PriceBreakdown() {
  const { bowlsPrices, orderTotal, promoSavings, discountAmount, addOnsTotal, subtotal } = usePriceCalculator();
  const selectedPromotion = useOrderStore((s) => s.selectedPromotion);
  const promoItemIndexes = useOrderStore((s) => s.promoItemIndexes);
  const discountCode = useOrderStore((s) => s.discountCode);

  return (
    <div className="rounded-2xl border border-gris-border p-5 space-y-3">
      <h4 className="font-heading font-bold text-negro">Desglose</h4>

      {bowlsPrices.map((price, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span className="text-gris">
            Bowl {idx + 1}
            {selectedPromotion && promoItemIndexes.includes(idx) && (
              <span className="ml-1 text-[11px] font-bold text-dorado">(Promo)</span>
            )}
          </span>
          <span className="text-negro font-medium">{formatCurrency(price)}</span>
        </div>
      ))}

      {addOnsTotal > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gris">Complementos</span>
          <span className="text-negro font-medium">{formatCurrency(addOnsTotal)}</span>
        </div>
      )}

      {/* Promo savings */}
      {selectedPromotion && promoSavings > 0 && (
        <>
          <div className="border-t border-gris-border pt-2 flex justify-between text-sm">
            <span className="text-gris">Subtotal</span>
            <span className="text-negro font-medium">{formatCurrency(subtotal + promoSavings)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">
              Promo: {selectedPromotion.name}
            </span>
            <span className="text-green-600 font-medium">-{formatCurrency(promoSavings)}</span>
          </div>
        </>
      )}

      {/* Discount code */}
      {discountCode && discountAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-green-600 font-medium">
            Descuento ({discountCode.percentage}%)
          </span>
          <span className="text-green-600 font-medium">-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      <div className="border-t border-gris-border pt-3 flex justify-between">
        <span className="font-semibold text-negro">Total</span>
        <span className="font-bold text-xl text-naranja">{formatCurrency(orderTotal)}</span>
      </div>
    </div>
  );
}
