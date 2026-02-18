import useOrderStore from './store/useOrderStore';
import useHistoryNav from './hooks/useHistoryNav';
import Header from './components/layout/Header';
import ProgressBar from './components/layout/ProgressBar';
import OrderFlow from './pages/OrderFlow';

export default function App() {
  const step = useOrderStore((s) => s.step);
  useHistoryNav();

  return (
    <div className="min-h-screen bg-white">
      {step > 0 && step < 5 && <Header />}
      {step > 0 && step < 5 && <ProgressBar currentStep={step} />}
      <OrderFlow />
    </div>
  );
}
