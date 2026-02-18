export const MAIN_STEPS = [
  { id: 0, label: 'Inicio' },
  { id: 1, label: 'Tipo de Poke' },
  { id: 2, label: 'Arma tu bowl' },
  { id: 3, label: 'Resumen' },
  { id: 4, label: 'Tus datos' },
  { id: 5, label: 'Confirmación' },
];

export const BUILDER_STEPS = [
  { id: 0, key: 'protein', label: 'Proteína' },
  { id: 1, key: 'base', label: 'Base' },
  { id: 2, key: 'vegetable', label: 'Vegetales' },
  { id: 3, key: 'sauce', label: 'Salsas' },
  { id: 4, key: 'topping', label: 'Toppings' },
  { id: 5, key: 'extras', label: 'Extras' },
];

export const CATEGORY_TYPE_MAP = {
  'protein-premium': 'protein',
  'protein-base': 'protein',
  base: 'base',
  vegetable: 'vegetable',
  sauce: 'sauce',
  topping: 'topping',
};

export function createEmptyBowl() {
  return {
    pokeType: null,
    proteins: [],
    isMixProtein: false,
    bases: [],
    isMixBase: false,
    vegetables: [],
    sauces: [],
    toppings: [],
    extras: [],
  };
}
