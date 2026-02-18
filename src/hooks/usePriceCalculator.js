import useCatalogStore from '../store/useCatalogStore';
import useOrderStore from '../store/useOrderStore';

export default function usePriceCalculator() {
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const bowls = useOrderStore((s) => s.bowls);

  function getBowlPrice(bowl) {
    const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
    if (!pt) return 0;

    const extrasTotal = bowl.extras.reduce(
      (sum, e) => sum + (e.extraPrice || 0) * (e.quantity || 1),
      0
    );

    return pt.basePrice + extrasTotal;
  }

  const currentBowlPrice = getBowlPrice(currentBowl);
  const currentExtrasTotal = currentBowl.extras.reduce(
    (sum, e) => sum + (e.extraPrice || 0) * (e.quantity || 1),
    0
  );
  const bowlsPrices = bowls.map(getBowlPrice);
  const orderTotal = bowlsPrices.reduce((sum, p) => sum + p, 0);

  return {
    currentBowlPrice,
    currentExtrasTotal,
    bowlsPrices,
    orderTotal,
    getBowlPrice,
  };
}
