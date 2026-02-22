import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEmptyBowl } from '../lib/constants';

const useOrderStore = create(
  persist(
    (set, get) => ({
      // Navigation
      step: 0,
      builderStep: 0,

      // Customer data
      customer: {
        name: '',
        identification: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      },

      deliveryTime: '',
      setDeliveryTime: (deliveryTime) => set({ deliveryTime }),

      // Order
      bowls: [],
      currentBowl: createEmptyBowl(),
      editingBowlIndex: null,

      // Payment data
      paymentData: {
        method: '',
        referenceId: '',
        referenceImageUrl: '',
      },

      // Split payment
      splitPaymentData: {
        method1: '',
        amountBs1: '',
        amountUsd1: '',
        referenceId1: '',
        method2: '',
        referenceId2: '',
      },

      // Completed order
      completedOrder: null,

      // Payment UI state (transient, for GlobalBottomBar)
      paymentLoading: false,
      paymentLoadingRates: true,

      // Navigation actions
      setStep: (step) => set({ step }),
      nextStep: () => set((s) => ({ step: s.step + 1 })),
      prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      setBuilderStep: (builderStep) => set({ builderStep }),
      nextBuilderStep: () => set((s) => ({ builderStep: s.builderStep + 1 })),
      prevBuilderStep: () => set((s) => ({ builderStep: Math.max(0, s.builderStep - 1) })),

      // Customer actions
      setCustomer: (customer) => set({ customer }),

      // Payment actions
      setPaymentData: (paymentData) => set({ paymentData }),
      setSplitPaymentData: (splitPaymentData) => set({ splitPaymentData }),
      setPaymentLoading: (paymentLoading) => set({ paymentLoading }),
      setPaymentLoadingRates: (paymentLoadingRates) => set({ paymentLoadingRates }),

      // Poke type
      setPokeType: (pokeType) =>
        set((s) => ({
          currentBowl: { ...s.currentBowl, pokeType },
        })),

      // Protein actions
      selectProtein: (protein) =>
        set((s) => {
          const bowl = s.currentBowl;
          const virtId = `${protein._id}_${protein.preparationStyle ?? ''}`;
          const existing = bowl.proteins.find(
            (p) => `${p.item}_${p.preparationStyle ?? ''}` === virtId
          );
          const entry = {
            item: protein._id,
            name: protein.name,
            preparationStyle: protein.preparationStyle ?? null,
          };
          if (existing) {
            return {
              currentBowl: {
                ...bowl,
                proteins: bowl.proteins.filter(
                  (p) => `${p.item}_${p.preparationStyle ?? ''}` !== virtId
                ),
              },
            };
          }
          const maxCount = bowl.isMixProtein ? 2 : 1;
          if (bowl.proteins.length >= maxCount) {
            const newProteins = bowl.isMixProtein
              ? [bowl.proteins[1], entry]
              : [entry];
            return { currentBowl: { ...bowl, proteins: newProteins } };
          }
          return {
            currentBowl: {
              ...bowl,
              proteins: [...bowl.proteins, entry],
            },
          };
        }),

      toggleMixProtein: () =>
        set((s) => {
          const isMix = !s.currentBowl.isMixProtein;
          // Limpiar selección al cambiar modo para evitar proteínas
          // de tiers incorrectos guardadas invisiblemente
          return {
            currentBowl: { ...s.currentBowl, isMixProtein: isMix, proteins: [] },
          };
        }),

      // Base actions
      selectBase: (base) =>
        set((s) => {
          const bowl = s.currentBowl;
          const existing = bowl.bases.find((b) => b.item === base._id);
          if (existing) {
            return {
              currentBowl: {
                ...bowl,
                bases: bowl.bases.filter((b) => b.item !== base._id),
              },
            };
          }
          const maxCount = bowl.isMixBase ? 2 : 1;
          if (bowl.bases.length >= maxCount) {
            const newBases = bowl.isMixBase
              ? [bowl.bases[1], { item: base._id, name: base.name }]
              : [{ item: base._id, name: base.name }];
            return { currentBowl: { ...bowl, bases: newBases } };
          }
          return {
            currentBowl: {
              ...bowl,
              bases: [...bowl.bases, { item: base._id, name: base.name }],
            },
          };
        }),

      toggleMixBase: () =>
        set((s) => {
          const isMix = !s.currentBowl.isMixBase;
          const bases = isMix
            ? s.currentBowl.bases.slice(0, 2)
            : s.currentBowl.bases.slice(0, 1);
          return {
            currentBowl: { ...s.currentBowl, isMixBase: isMix, bases },
          };
        }),

      // Vegetable, sauce, topping toggles
      toggleVegetable: (item, max) =>
        set((s) => {
          const bowl = s.currentBowl;
          const exists = bowl.vegetables.find((v) => v.item === item._id);
          if (exists) {
            return {
              currentBowl: {
                ...bowl,
                vegetables: bowl.vegetables.filter((v) => v.item !== item._id),
              },
            };
          }
          if (bowl.vegetables.length >= max) return {};
          return {
            currentBowl: {
              ...bowl,
              vegetables: [...bowl.vegetables, { item: item._id, name: item.name }],
            },
          };
        }),

      toggleSauce: (item, max) =>
        set((s) => {
          const bowl = s.currentBowl;
          const exists = bowl.sauces.find((v) => v.item === item._id);
          if (exists) {
            return {
              currentBowl: {
                ...bowl,
                sauces: bowl.sauces.filter((v) => v.item !== item._id),
              },
            };
          }
          if (bowl.sauces.length >= max) return {};
          return {
            currentBowl: {
              ...bowl,
              sauces: [...bowl.sauces, { item: item._id, name: item.name }],
            },
          };
        }),

      toggleTopping: (item, max) =>
        set((s) => {
          const bowl = s.currentBowl;
          const exists = bowl.toppings.find((v) => v.item === item._id);
          if (exists) {
            return {
              currentBowl: {
                ...bowl,
                toppings: bowl.toppings.filter((v) => v.item !== item._id),
              },
            };
          }
          if (bowl.toppings.length >= max) return {};
          return {
            currentBowl: {
              ...bowl,
              toppings: [...bowl.toppings, { item: item._id, name: item.name }],
            },
          };
        }),

      // Extras
      addExtra: (item) =>
        set((s) => {
          const bowl = s.currentBowl;
          const existing = bowl.extras.find((e) => e.item === item._id);
          if (existing) {
            return {
              currentBowl: {
                ...bowl,
                extras: bowl.extras.map((e) =>
                  e.item === item._id ? { ...e, quantity: e.quantity + 1 } : e
                ),
              },
            };
          }
          return {
            currentBowl: {
              ...bowl,
              extras: [
                ...bowl.extras,
                { item: item._id, name: item.name, extraPrice: item.extraPrice, quantity: 1 },
              ],
            },
          };
        }),

      removeExtra: (itemId) =>
        set((s) => {
          const bowl = s.currentBowl;
          const existing = bowl.extras.find((e) => e.item === itemId);
          if (!existing) return {};
          if (existing.quantity <= 1) {
            return {
              currentBowl: {
                ...bowl,
                extras: bowl.extras.filter((e) => e.item !== itemId),
              },
            };
          }
          return {
            currentBowl: {
              ...bowl,
              extras: bowl.extras.map((e) =>
                e.item === itemId ? { ...e, quantity: e.quantity - 1 } : e
              ),
            },
          };
        }),

      // Bowl management
      addBowlToOrder: () =>
        set((s) => {
          const { editingBowlIndex, currentBowl, bowls } = s;
          let newBowls;
          if (editingBowlIndex !== null) {
            newBowls = [...bowls];
            newBowls[editingBowlIndex] = currentBowl;
          } else {
            newBowls = [...bowls, currentBowl];
          }
          return {
            bowls: newBowls,
            currentBowl: createEmptyBowl(),
            editingBowlIndex: null,
            step: 3,
            builderStep: 0,
          };
        }),

      editBowl: (index) =>
        set((s) => ({
          currentBowl: { ...s.bowls[index] },
          editingBowlIndex: index,
          step: 2,
          builderStep: 0,
        })),

      removeBowl: (index) =>
        set((s) => ({
          bowls: s.bowls.filter((_, i) => i !== index),
        })),

      addAnotherBowl: () =>
        set({
          currentBowl: createEmptyBowl(),
          editingBowlIndex: null,
          step: 1,
          builderStep: 0,
        }),

      setCompletedOrder: (order) => set({ completedOrder: order }),

      // Reset
      resetOrder: () =>
        set({
          step: 0,
          builderStep: 0,
          bowls: [],
          currentBowl: createEmptyBowl(),
          editingBowlIndex: null,
          completedOrder: null,
          paymentData: { method: '', referenceId: '', referenceImageUrl: '' },
          splitPaymentData: { method1: '', amountBs1: '', amountUsd1: '', referenceId1: '', method2: '', referenceId2: '' },
          paymentLoading: false,
          paymentLoadingRates: true,
        }),
    }),
    {
      name: 'japoke-order',
      partialize: (state) => ({
        customer: state.customer,
        deliveryTime: state.deliveryTime,
      }),
    }
  )
);

export default useOrderStore;
