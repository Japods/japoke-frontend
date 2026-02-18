import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import BuilderProgress from './BuilderProgress';
import BottomSummary from '../layout/BottomSummary';
import ProteinSelector from './ProteinSelector';
import BaseSelector from './BaseSelector';
import VegetableSelector from './VegetableSelector';
import SauceSelector from './SauceSelector';
import ToppingSelector from './ToppingSelector';
import ExtrasSelector from './ExtrasSelector';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function BuilderStepper({ onBack }) {
  const builderStep = useOrderStore((s) => s.builderStep);
  const nextBuilderStep = useOrderStore((s) => s.nextBuilderStep);
  const prevBuilderStep = useOrderStore((s) => s.prevBuilderStep);
  const addBowlToOrder = useOrderStore((s) => s.addBowlToOrder);
  const currentBowl = useOrderStore((s) => s.currentBowl);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [builderStep]);

  function handlePrev() {
    if (builderStep === 0) {
      onBack();
    } else {
      prevBuilderStep();
    }
  }

  function handleNext() {
    nextBuilderStep();
  }

  function handleFinish() {
    addBowlToOrder();
  }

  // Validation: can advance?
  const canGoNext = (() => {
    switch (builderStep) {
      case 0: { // Protein
        const maxCount = currentBowl.isMixProtein ? 2 : 1;
        return currentBowl.proteins.length === maxCount;
      }
      case 1: { // Base
        const maxCount = currentBowl.isMixBase ? 2 : 1;
        return currentBowl.bases.length === maxCount;
      }
      default:
        return true;
    }
  })();

  const steps = [
    <ProteinSelector onNext={handleNext} onPrev={handlePrev} />,
    <BaseSelector onNext={handleNext} onPrev={handlePrev} />,
    <VegetableSelector onNext={handleNext} onPrev={handlePrev} />,
    <SauceSelector onNext={handleNext} onPrev={handlePrev} />,
    <ToppingSelector onNext={handleNext} onPrev={handlePrev} />,
    <ExtrasSelector onFinish={handleFinish} onPrev={handlePrev} />,
  ];

  const isLast = builderStep === 5;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-44 sm:pb-8"
    >
      <BuilderProgress currentStep={builderStep} />

      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={builderStep}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {steps[builderStep]}
        </motion.div>
      </AnimatePresence>

      {/* Mobile bottom bar with prev + next */}
      <div className="sm:hidden">
        <BottomSummary
          onNext={isLast ? handleFinish : handleNext}
          onPrev={handlePrev}
          nextLabel={isLast ? 'Agregar al pedido' : 'Siguiente'}
          disabled={!canGoNext}
          showPrev={true}
        />
      </div>
    </motion.div>
  );
}
