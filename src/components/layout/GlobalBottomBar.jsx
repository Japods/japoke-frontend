import useOrderStore from '../../store/useOrderStore';
import usePriceCalculator from '../../hooks/usePriceCalculator';
import useBuilderRules from '../../hooks/useBuilderRules';
import { formatCurrency } from '../../lib/formatters';

export default function GlobalBottomBar() {
  const step = useOrderStore((s) => s.step);
  const builderStep = useOrderStore((s) => s.builderStep);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const bowls = useOrderStore((s) => s.bowls);
  const paymentData = useOrderStore((s) => s.paymentData);
  const paymentLoading = useOrderStore((s) => s.paymentLoading);
  const paymentLoadingRates = useOrderStore((s) => s.paymentLoadingRates);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  const nextBuilderStep = useOrderStore((s) => s.nextBuilderStep);
  const prevBuilderStep = useOrderStore((s) => s.prevBuilderStep);
  const setBuilderStep = useOrderStore((s) => s.setBuilderStep);
  const addBowlToOrder = useOrderStore((s) => s.addBowlToOrder);

  const { currentBowlPrice, currentExtrasTotal } = usePriceCalculator();
  const { basePrice } = useBuilderRules();

  // Solo visible en pasos intermedios
  if (step === 0 || step >= 6) return null;

  // --- Step 1: Tipo de Poke ---
  if (step === 1) {
    return (
      <BottomBar>
        <FullButton onClick={nextStep} disabled={!currentBowl.pokeType}>
          Armar mi bowl
        </FullButton>
      </BottomBar>
    );
  }

  // --- Step 2: Builder ---
  if (step === 2) {
    const isLast = builderStep === 5;

    const canGoNext = (() => {
      if (builderStep === 0) {
        const maxCount = currentBowl.isMixProtein ? 2 : 1;
        return currentBowl.proteins.length === maxCount;
      }
      if (builderStep === 1) {
        const maxCount = currentBowl.isMixBase ? 2 : 1;
        return currentBowl.bases.length === maxCount;
      }
      return true;
    })();

    function handlePrev() {
      if (builderStep === 0) {
        setBuilderStep(0);
        prevStep();
      } else {
        prevBuilderStep();
      }
    }

    function handleNext() {
      if (isLast) {
        addBowlToOrder();
      } else {
        nextBuilderStep();
      }
    }

    return (
      <BottomBar showPrice price={currentBowlPrice} basePrice={basePrice} extrasTotal={currentExtrasTotal}>
        <SplitButtons
          onPrev={handlePrev}
          onNext={handleNext}
          disabledNext={!canGoNext}
          nextLabel={isLast ? 'Agregar al pedido' : 'Siguiente'}
        />
      </BottomBar>
    );
  }

  // --- Step 3: Resumen ---
  if (step === 3) {
    return (
      <BottomBar>
        <SplitButtons
          onPrev={prevStep}
          onNext={nextStep}
          disabledNext={bowls.length === 0}
          nextLabel="Continuar"
        />
      </BottomBar>
    );
  }

  // --- Step 4: Datos del cliente ---
  if (step === 4) {
    return (
      <BottomBar>
        <SplitButtons
          onPrev={prevStep}
          nextType="submit"
          nextForm="customer-form"
          nextLabel="Continuar al pago"
        />
      </BottomBar>
    );
  }

  // --- Step 5: Pago ---
  if (step === 5) {
    return (
      <BottomBar>
        <SplitButtons
          onPrev={prevStep}
          prevLabel="Volver"
          nextType="submit"
          nextForm="payment-form"
          disabledNext={!paymentData.method || paymentLoadingRates || paymentLoading}
          nextLabel={paymentLoading ? 'Confirmando...' : 'Confirmar pedido'}
        />
      </BottomBar>
    );
  }

  return null;
}

// --- Sub-componentes internos ---

function BottomBar({ children, showPrice, price, basePrice, extrasTotal }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gris-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {showPrice && (
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-lg font-bold text-negro">{formatCurrency(price)}</span>
            {extrasTotal > 0 && (
              <span className="text-xs text-gris">
                ({formatCurrency(basePrice)} + {formatCurrency(extrasTotal)} extras)
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function FullButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 bg-naranja text-white font-semibold rounded-xl
                 hover:bg-naranja-dark transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {children}
    </button>
  );
}

function SplitButtons({
  onPrev,
  onNext,
  disabledNext,
  nextLabel,
  prevLabel = '← Anterior',
  nextType = 'button',
  nextForm,
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onPrev}
        className="flex-1 py-3 border-2 border-gris-border text-negro font-semibold rounded-xl
                   hover:bg-gris-light transition-colors duration-200 cursor-pointer whitespace-nowrap"
      >
        {prevLabel}
      </button>
      <button
        type={nextType}
        form={nextForm}
        onClick={nextType === 'button' ? onNext : undefined}
        disabled={disabledNext}
        className="flex-[2] py-3 bg-naranja text-white font-semibold rounded-xl
                   hover:bg-naranja-dark transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
      >
        {nextLabel}
      </button>
    </div>
  );
}
