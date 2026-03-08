import useCatalogStore from '../store/useCatalogStore';
import useOrderStore from '../store/useOrderStore';

export default function usePriceCalculator() {
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const bowls = useOrderStore((s) => s.bowls);
  const selectedPromotion = useOrderStore((s) => s.selectedPromotion);
  const promoItemIndexes = useOrderStore((s) => s.promoItemIndexes);
  const discountCode = useOrderStore((s) => s.discountCode);

  function getBowlPrice(bowl) {
    const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
    if (!pt) return 0;

    const extrasTotal = bowl.extras.reduce(
      (sum, e) => sum + (e.extraPrice || 0) * (e.quantity || 1),
      0
    );

    return pt.basePrice + extrasTotal;
  }

  function getBowlExtras(bowl) {
    return bowl.extras.reduce(
      (sum, e) => sum + (e.extraPrice || 0) * (e.quantity || 1),
      0
    );
  }

  const currentBowlPrice = getBowlPrice(currentBowl);
  const currentExtrasTotal = currentBowl.extras.reduce(
    (sum, e) => sum + (e.extraPrice || 0) * (e.quantity || 1),
    0
  );

  // Calculate order total with promo and discount
  let subtotal = 0;
  let promoSavings = 0;
  let discountAmount = 0;

  if (selectedPromotion && promoItemIndexes.length > 0) {
    // Promo bowls: promoPrice + extras only
    const promoExtras = promoItemIndexes.reduce((sum, idx) => {
      if (bowls[idx]) return sum + getBowlExtras(bowls[idx]);
      return sum;
    }, 0);
    const promoTotal = selectedPromotion.promoPrice + promoExtras;

    // Non-promo bowls: normal price
    const nonPromoTotal = bowls.reduce((sum, bowl, idx) => {
      if (promoItemIndexes.includes(idx)) return sum;
      return sum + getBowlPrice(bowl);
    }, 0);

    // What it would have cost without promo
    const fullPrice = bowls.reduce((sum, bowl) => sum + getBowlPrice(bowl), 0);
    subtotal = promoTotal + nonPromoTotal;
    promoSavings = fullPrice - subtotal;
  } else {
    subtotal = bowls.reduce((sum, bowl) => sum + getBowlPrice(bowl), 0);
  }

  // Apply discount code (only if no promo)
  if (discountCode && !selectedPromotion) {
    discountAmount = subtotal * (discountCode.percentage / 100);
  }

  const orderTotal = subtotal - discountAmount;
  const bowlsPrices = bowls.map(getBowlPrice);

  const basePrice = (() => {
    const pt = pokeTypes.find((p) => p._id === currentBowl.pokeType);
    return pt?.basePrice || 0;
  })();

  return {
    currentBowlPrice,
    currentExtrasTotal,
    basePrice,
    bowlsPrices,
    subtotal,
    promoSavings,
    discountAmount,
    orderTotal,
    getBowlPrice,
  };
}
