import { useEffect, useRef } from 'react';
import useOrderStore from '../store/useOrderStore';

export default function useHistoryNav() {
  const step = useOrderStore((s) => s.step);
  const builderStep = useOrderStore((s) => s.builderStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  const prevBuilderStep = useOrderStore((s) => s.prevBuilderStep);
  const setStep = useOrderStore((s) => s.setStep);
  const setBuilderStep = useOrderStore((s) => s.setBuilderStep);

  const isHandlingPopState = useRef(false);

  // Push a new history entry whenever step or builderStep changes
  useEffect(() => {
    if (isHandlingPopState.current) {
      isHandlingPopState.current = false;
      return;
    }
    const state = { step, builderStep };
    window.history.pushState(state, '', '');
  }, [step, builderStep]);

  // Listen for browser back/forward
  useEffect(() => {
    function handlePopState(e) {
      isHandlingPopState.current = true;

      const currentStep = useOrderStore.getState().step;
      const currentBuilderStep = useOrderStore.getState().builderStep;

      // If in builder (step 2) and not on first sub-step, go to prev builder step
      if (currentStep === 2 && currentBuilderStep > 0) {
        prevBuilderStep();
        return;
      }

      // If on step > 0, go to previous main step
      if (currentStep > 0) {
        if (currentStep === 2) {
          // Going back from builder step 0 -> reset builder
          setBuilderStep(0);
        }
        prevStep();
        return;
      }

      // If at step 0, allow normal browser behavior (push state back so user can leave)
      // Do nothing — let the browser handle it
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [prevStep, prevBuilderStep, setBuilderStep]);

  // Push initial state on mount
  useEffect(() => {
    window.history.replaceState({ step: 0, builderStep: 0 }, '', '');
  }, []);
}
