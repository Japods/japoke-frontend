import useOrderStore from './store/useOrderStore';
import useHistoryNav from './hooks/useHistoryNav';
import Header from './components/layout/Header';
import ProgressBar from './components/layout/ProgressBar';
import GlobalBottomBar from './components/layout/GlobalBottomBar';
import OrderFlow from './pages/OrderFlow';

export default function App() {
  const step = useOrderStore((s) => s.step);
  useHistoryNav();

  return (
    <div className="min-h-screen bg-white">
      {step > 0 && step < 6 && <Header />}
      {step > 0 && step < 6 && <ProgressBar currentStep={step} />}
      <OrderFlow />
      <GlobalBottomBar />
    </div>
  );
}
