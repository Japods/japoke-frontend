import { useState, useEffect } from 'react';
import useOrderStore from './store/useOrderStore';
import useHistoryNav from './hooks/useHistoryNav';
import Header from './components/layout/Header';
import ProgressBar from './components/layout/ProgressBar';
import GlobalBottomBar from './components/layout/GlobalBottomBar';
import OrderFlow from './pages/OrderFlow';
import { getStoreStatus } from './api/client';

function ClosedScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xs">
        <div className="text-7xl mb-6">🍣</div>
        <h1 className="font-heading text-3xl font-bold text-negro mb-3">
          Estamos cerrados
        </h1>
        <p className="text-gris text-base mb-1">
          Trabajamos de <span className="font-semibold text-negro">jueves a domingo</span>
        </p>
        <p className="text-gris text-sm mt-4">
          ¡Te esperamos con el mejor Japoke bowl!
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const step = useOrderStore((s) => s.step);
  useHistoryNav();

  const [storeOpen, setStoreOpen] = useState(null);

  useEffect(() => {
    getStoreStatus()
      .then((d) => setStoreOpen(d.isOpen))
      .catch(() => setStoreOpen(false));
  }, []);

  // Loading
  if (storeOpen === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-naranja border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!storeOpen) return <ClosedScreen />;

  return (
    <div className="min-h-screen bg-white">
      {step > 0 && step < 6 && <Header />}
      {step > 0 && step < 6 && <ProgressBar currentStep={step} />}
      <OrderFlow />
      <GlobalBottomBar />
    </div>
  );
}
