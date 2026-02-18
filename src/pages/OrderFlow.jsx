import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useOrderStore from '../store/useOrderStore';
import useCatalog from '../hooks/useCatalog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Hero from '../components/landing/Hero';
import PokeTypeSelector from '../components/poke-type/PokeTypeSelector';
import BuilderStepper from '../components/builder/BuilderStepper';
import OrderSummary from '../components/summary/OrderSummary';
import CustomerForm from '../components/customer/CustomerForm';
import PaymentStep from '../components/payment/PaymentStep';
import OrderConfirmation from '../components/confirmation/OrderConfirmation';

export default function OrderFlow() {
  const step = useOrderStore((s) => s.step);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  const setBuilderStep = useOrderStore((s) => s.setBuilderStep);
  const { loading, error } = useCatalog();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gris">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-error font-semibold mb-2">Error al cargar el catálogo</p>
          <p className="text-gris text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-naranja text-white rounded-xl font-medium cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <Hero key="hero" onStart={nextStep} />
      )}
      {step === 1 && (
        <PokeTypeSelector key="poke-type" onNext={nextStep} />
      )}
      {step === 2 && (
        <BuilderStepper
          key="builder"
          onBack={() => {
            setBuilderStep(0);
            prevStep();
          }}
        />
      )}
      {step === 3 && (
        <OrderSummary key="summary" />
      )}
      {step === 4 && (
        <CustomerForm key="customer" />
      )}
      {step === 5 && (
        <PaymentStep key="payment" />
      )}
      {step === 6 && (
        <OrderConfirmation key="confirmation" />
      )}
    </AnimatePresence>
  );
}
