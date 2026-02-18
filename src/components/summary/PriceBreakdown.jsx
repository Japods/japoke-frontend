import usePriceCalculator from '../../hooks/usePriceCalculator';
import { formatCurrency } from '../../lib/formatters';

export default function PriceBreakdown() {
  const { bowlsPrices, orderTotal } = usePriceCalculator();

  return (
    <div className="rounded-2xl border border-gris-border p-5 space-y-3">
      <h4 className="font-heading font-bold text-negro">Desglose</h4>

      {bowlsPrices.map((price, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span className="text-gris">Bowl {idx + 1}</span>
          <span className="text-negro font-medium">{formatCurrency(price)}</span>
        </div>
      ))}

      <div className="border-t border-gris-border pt-3 flex justify-between">
        <span className="font-semibold text-negro">Total</span>
        <span className="font-bold text-xl text-naranja">{formatCurrency(orderTotal)}</span>
      </div>
    </div>
  );
}
