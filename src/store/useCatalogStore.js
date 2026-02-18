import { create } from 'zustand';
import { getCatalog } from '../api/client';

const useCatalogStore = create((set, get) => ({
  pokeTypes: [],
  categories: [],
  loading: false,
  error: null,

  fetchCatalog: async () => {
    if (get().pokeTypes.length > 0) return;
    set({ loading: true, error: null });
    try {
      const data = await getCatalog();
      set({
        pokeTypes: data.pokeTypes,
        categories: data.categories,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getItemsByType: (type) => {
    return get()
      .categories.filter((cat) => cat.type === type)
      .flatMap((cat) => cat.items);
  },

  getProteinsByTiers: (allowedTiers) => {
    return get()
      .categories.filter((cat) => cat.type === 'protein')
      .flatMap((cat) => cat.items)
      .filter((item) => allowedTiers.includes(item.tier));
  },

  getItemById: (id) => {
    for (const cat of get().categories) {
      const item = cat.items.find((i) => i._id === id);
      if (item) return { ...item, categoryType: cat.type };
    }
    return null;
  },
}));

export default useCatalogStore;
