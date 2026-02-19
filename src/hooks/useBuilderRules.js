import useCatalogStore from '../store/useCatalogStore';
import useOrderStore from '../store/useOrderStore';

export default function useBuilderRules() {
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);
  const currentBowl = useOrderStore((s) => s.currentBowl);

  const pokeType = pokeTypes.find((pt) => pt._id === currentBowl.pokeType);

  if (!pokeType) {
    return {
      proteinGrams: 100,
      baseGrams: 100,
      maxVegetables: 4,
      maxSauces: 2,
      maxToppings: 1,
      allowedProteinTiers: [],
      basePrice: 0,
      pokeTypeName: '',
    };
  }

  return {
    proteinGrams: pokeType.rules.proteinGrams,
    baseGrams: pokeType.rules.baseGrams,
    maxVegetables: pokeType.rules.maxVegetables,
    maxSauces: pokeType.rules.maxSauces,
    maxToppings: pokeType.rules.maxToppings,
    allowedProteinTiers: pokeType.allowedProteinTiers,
    basePrice: pokeType.basePrice,
    pokeTypeName: pokeType.name,
  };
}
