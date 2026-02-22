import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import useCatalogStore from '../../store/useCatalogStore';
import { createOrder, getExchangeRates } from '../../api/client';
import Input from '../ui/Input';
import Toast from '../ui/Toast';

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[11px] text-gris">{label}</p>
        <p className="font-medium text-negro truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gris-border"
        title="Copiar"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5 6.5-7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}

const PAYMENT_METHODS = [
  {
    id: 'pago_movil',
    label: 'Pago Móvil',
    description: 'Transferencia en Bolívares',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    currency: 'Bs',
  },
  {
    id: 'efectivo_usd',
    label: 'Efectivo USD',
    description: 'Descuento en USD efectivo',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    currency: 'USD',
  },
  {
    id: 'binance_usdt',
    label: 'Binance USDT',
    description: 'Descuento en USDT',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
      </svg>
    ),
    currency: 'USDT',
  },
];

function formatBs(amount) {
  return new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' Bs';
}
function formatUsd(amount) { return '$' + Number(amount).toFixed(2); }
function formatEur(amount) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(amount);
}

// Renders the payment data box + reference input for a given method
function PaymentDetails({ methodId, amountBs, amountUsd, discountPct, referenceValue, onReferenceChange, referenceName = 'referenceId' }) {
  if (methodId === 'pago_movil') return (
    <div className="space-y-3">
      <div className="rounded-xl bg-gris-light/50 border border-gris-border p-4 space-y-2">
        <p className="text-sm font-semibold text-negro mb-3">Datos para Pago Móvil</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <CopyField label="Teléfono" value="0412-3925909" />
          <CopyField label="Cédula" value="V-25870475" />
          <CopyField label="Banco" value="Banesco" />
          <div>
            <p className="text-[11px] text-gris">Monto total</p>
            <p className="font-bold text-naranja">{formatBs(amountBs)}</p>
          </div>
        </div>
      </div>
      <Input
        label="Número de referencia"
        name={referenceName}
        value={referenceValue}
        onChange={onReferenceChange}
        placeholder="Últimos 4 dígitos de la referencia"
      />
    </div>
  );

  if (methodId === 'efectivo_usd') return (
    <div className="rounded-xl bg-green-50 border border-green-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-green-700">💵</span>
        <p className="text-sm font-semibold text-negro">Pago en efectivo USD</p>
        {discountPct > 0 && (
          <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
        )}
      </div>
      <p className="text-sm text-gris">Monto: <span className="font-bold text-naranja">{formatUsd(amountUsd)}</span></p>
      <p className="text-xs text-gris mt-1">El pago se realiza al momento de la entrega</p>
    </div>
  );

  if (methodId === 'binance_usdt') return (
    <div className="space-y-3">
      <div className="rounded-xl bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-700">🪙</span>
          <p className="text-sm font-semibold text-negro">Pago con Binance (USDT)</p>
          {discountPct > 0 && (
            <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
          )}
        </div>
        <CopyField label="Correo Binance (Pay / P2P)" value="jcodepod@gmail.com" />
        <div className="mt-1">
          <p className="text-[11px] text-gris">Monto USDT</p>
          <p className="font-bold text-naranja">{formatUsd(amountUsd)}</p>
        </div>
      </div>
      <Input
        label="ID de transacción Binance"
        name={referenceName}
        value={referenceValue}
        onChange={onReferenceChange}
        placeholder="ID de la transacción"
      />
    </div>
  );

  return null;
}

// Renders partial-amount details for a split payment panel.
// readOnly=true → shows a calculated amount display instead of an input field.
function SplitPaymentDetails({
  methodId,
  amountBsValue, amountUsdValue, referenceValue,
  onChange,
  amountBsName = 'amountBs2',
  amountUsdName = 'amountUsd2',
  referenceName = 'referenceId2',
  readOnly = false,
  displayAmountFormatted = '',
  discountPct = 0,
  amountError = '',
}) {
  const amountDisplay = (
    <div className="rounded-xl bg-naranja/5 border border-naranja/20 px-4 py-3">
      <p className="text-[11px] text-gris">Monto a pagar</p>
      <p className="font-bold text-naranja text-xl">{displayAmountFormatted || '—'}</p>
    </div>
  );

  if (methodId === 'pago_movil') return (
    <div className="space-y-3">
      <div className="rounded-xl bg-gris-light/50 border border-gris-border p-4 space-y-2">
        <p className="text-sm font-semibold text-negro mb-2">Datos para Pago Móvil</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <CopyField label="Teléfono" value="0412-3925909" />
          <CopyField label="Cédula" value="V-25870475" />
          <CopyField label="Banco" value="Banesco" />
        </div>
      </div>
      {readOnly
        ? amountDisplay
        : <Input label="Monto en Bs" name={amountBsName} type="number" value={amountBsValue} onChange={onChange} placeholder="¿Cuánto pagas en Bs?" error={amountError} />
      }
      <Input label="Número de referencia" name={referenceName} value={referenceValue} onChange={onChange} placeholder="Últimos 4 dígitos" />
    </div>
  );

  if (methodId === 'efectivo_usd') return (
    <div className="space-y-3">
      <div className="rounded-xl bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-negro">Efectivo USD</p>
          {discountPct > 0 && (
            <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
          )}
        </div>
        <p className="text-xs text-gris">El pago se realiza al momento de la entrega</p>
      </div>
      {readOnly
        ? amountDisplay
        : <Input label="Monto en USD" name={amountUsdName} type="number" value={amountUsdValue} onChange={onChange} placeholder="¿Cuánto pagas en USD?" error={amountError} />
      }
    </div>
  );

  if (methodId === 'binance_usdt') return (
    <div className="space-y-3">
      <div className="rounded-xl bg-green-50 border border-green-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-semibold text-negro">Binance USDT</p>
          {discountPct > 0 && (
            <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
          )}
        </div>
        <CopyField label="Correo Binance (Pay / P2P)" value="jcodepod@gmail.com" />
      </div>
      {readOnly
        ? amountDisplay
        : <Input label="Monto en USDT" name={amountUsdName} type="number" value={amountUsdValue} onChange={onChange} placeholder="¿Cuánto pagas en USDT?" error={amountError} />
      }
      <Input label="ID de transacción Binance" name={referenceName} value={referenceValue} onChange={onChange} placeholder="ID de la transacción" />
    </div>
  );

  return null;
}

export default function PaymentStep() {
  const customer = useOrderStore((s) => s.customer);
  const deliveryTime = useOrderStore((s) => s.deliveryTime);
  const bowls = useOrderStore((s) => s.bowls);
  const paymentData = useOrderStore((s) => s.paymentData);
  const setPaymentData = useOrderStore((s) => s.setPaymentData);
  const splitPaymentData = useOrderStore((s) => s.splitPaymentData);
  const setSplitPaymentData = useOrderStore((s) => s.setSplitPaymentData);
  const setCompletedOrder = useOrderStore((s) => s.setCompletedOrder);
  const nextStep = useOrderStore((s) => s.nextStep);
  const setPaymentLoading = useOrderStore((s) => s.setPaymentLoading);
  const setPaymentLoadingRates = useOrderStore((s) => s.setPaymentLoadingRates);
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);

  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const totalEur = bowls.reduce((sum, bowl) => {
    const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
    const base = pt?.basePrice || 0;
    const extrasTotal = bowl.extras.reduce((s, e) => s + (e.extraPrice || 0) * e.quantity, 0);
    return sum + base + extrasTotal;
  }, 0);

  useEffect(() => {
    setPaymentLoadingRates(true);
    async function fetchRates() {
      try {
        const data = await getExchangeRates();
        setRates(data);
      } catch {
        setApiError('No se pudieron cargar las tasas de cambio');
      } finally {
        setLoadingRates(false);
        setPaymentLoadingRates(false);
      }
    }
    fetchRates();
  }, []);

  const euroBcv = rates?.euro_bcv?.rate || 0;
  const dolarParalelo = rates?.dolar_paralelo?.rate || 0;
  const amountBs = euroBcv > 0 ? totalEur * euroBcv : 0;
  const amountUsd = dolarParalelo > 0 ? amountBs / dolarParalelo : 0;
  const discountPct = totalEur > 0 && amountUsd > 0
    ? Math.round(((totalEur - amountUsd) / totalEur) * 100)
    : 0;

  const isSplitMode = paymentData.method === 'split';

  // ── Handlers ──────────────────────────────────────────────────────────

  function selectMode(modeId) {
    if (modeId === 'split') {
      setPaymentData({ method: 'split', referenceId: '', referenceImageUrl: '' });
      setSplitPaymentData({ method1: '', amountBs1: '', amountUsd1: '', referenceId1: '', method2: '', referenceId2: '' });
    } else {
      setPaymentData({ method: modeId, referenceId: '', referenceImageUrl: '' });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  }

  function selectSplitMethod1(methodId) {
    const newData = { ...splitPaymentData, method1: methodId, amountBs1: '', amountUsd1: '', referenceId1: '' };
    if (splitPaymentData.method2 === methodId) {
      newData.method2 = '';
      newData.referenceId2 = '';
    }
    setSplitPaymentData(newData);
  }

  function selectSplitMethod2(methodId) {
    setSplitPaymentData({ ...splitPaymentData, method2: methodId, referenceId2: '' });
  }

  function handleSplitChange(e) {
    const { name, value } = e.target;
    setSplitPaymentData({ ...splitPaymentData, [name]: value });
  }

  // Auto-calculates the remainder for Panel 2 based on what was entered in Panel 1
  function getRemainderAmounts() {
    const { method1, method2, amountBs1, amountUsd1 } = splitPaymentData;
    if (!method1 || !method2) return { amountBs: 0, amountUsd: 0 };

    const isUsd = (m) => m === 'efectivo_usd' || m === 'binance_usdt';

    if (!isUsd(method1) && isUsd(method2)) {
      // Bs → USD: user pays some in Bs, rest converted to USD
      const paid = parseFloat(amountBs1) || 0;
      const remaining = Math.max(0, amountBs - paid);
      return { amountBs: 0, amountUsd: dolarParalelo > 0 ? Math.round((remaining / dolarParalelo) * 100) / 100 : 0 };
    }

    if (isUsd(method1) && !isUsd(method2)) {
      // USD → Bs: user pays some in USD, rest in Bs
      const paidUsd = parseFloat(amountUsd1) || 0;
      const paidBs = paidUsd * dolarParalelo;
      return { amountBs: Math.max(0, Math.round((amountBs - paidBs) * 100) / 100), amountUsd: 0 };
    }

    if (isUsd(method1) && isUsd(method2)) {
      // Both USD
      const paidUsd = parseFloat(amountUsd1) || 0;
      return { amountBs: 0, amountUsd: Math.max(0, Math.round((amountUsd - paidUsd) * 100) / 100) };
    }

    // Both Bs (shouldn't happen, same method is blocked)
    const paid = parseFloat(amountBs1) || 0;
    return { amountBs: Math.max(0, Math.round((amountBs - paid) * 100) / 100), amountUsd: 0 };
  }

  // Returns an inline error if the Panel 1 amount exceeds the invoice total
  function getPanel1AmountError() {
    const { method1, amountBs1, amountUsd1 } = splitPaymentData;
    if (!method1) return '';
    const isUsd1 = method1 !== 'pago_movil';
    if (isUsd1) {
      const val = parseFloat(amountUsd1);
      if (val && val > amountUsd) return `No puede superar el total: ${formatUsd(amountUsd)}`;
    } else {
      const val = parseFloat(amountBs1);
      if (val && val > amountBs) return `No puede superar el total: ${formatBs(amountBs)}`;
    }
    return '';
  }

  // ── Payload ───────────────────────────────────────────────────────────

  function buildPayload() {
    const totalProteinGrams = (pt) => pt?.rules?.proteinGrams ?? 100;
    const totalBaseGrams = (pt) => pt?.rules?.baseGrams ?? 120;

    const items = bowls.map((bowl) => {
      const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
      const proteinGrams = bowl.isMixProtein ? totalProteinGrams(pt) / bowl.proteins.length : totalProteinGrams(pt);
      const baseGrams = bowl.isMixBase ? totalBaseGrams(pt) / bowl.bases.length : totalBaseGrams(pt);
      return {
        pokeType: bowl.pokeType,
        selections: {
          proteins: bowl.proteins.map((p) => ({ item: p.item, quantity: proteinGrams })),
          bases: bowl.bases.map((b) => ({ item: b.item, quantity: baseGrams })),
          vegetables: bowl.vegetables.map((v) => ({ item: v.item })),
          sauces: bowl.sauces.map((s) => ({ item: s.item })),
          toppings: bowl.toppings.map((t) => ({ item: t.item })),
        },
        extras: bowl.extras.map((e) => ({ item: e.item, quantity: e.quantity })),
      };
    });

    const customer = useOrderStore.getState().customer;
    const currentDeliveryTime = useOrderStore.getState().deliveryTime;

    const base = {
      customer: {
        name: customer.name,
        identification: customer.identification,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        notes: customer.notes || '',
      },
      items,
      deliveryTime: currentDeliveryTime || null,
    };

    if (isSplitMode) {
      const isUsd = (m) => m === 'efectivo_usd' || m === 'binance_usdt';
      const remainder = getRemainderAmounts();
      return {
        ...base,
        payment: {
          method: splitPaymentData.method1,
          referenceId: splitPaymentData.referenceId1 || '',
          referenceImageUrl: '',
          amountBs: !isUsd(splitPaymentData.method1) ? (parseFloat(splitPaymentData.amountBs1) || undefined) : undefined,
          amountUsd: isUsd(splitPaymentData.method1) ? (parseFloat(splitPaymentData.amountUsd1) || undefined) : undefined,
        },
        splitPayment: splitPaymentData.method2 ? {
          method: splitPaymentData.method2,
          amountBs: remainder.amountBs > 0 ? remainder.amountBs : undefined,
          amountUsd: remainder.amountUsd > 0 ? remainder.amountUsd : undefined,
          referenceId: splitPaymentData.referenceId2 || '',
        } : undefined,
      };
    }

    return {
      ...base,
      payment: {
        method: paymentData.method,
        referenceId: paymentData.referenceId || '',
        referenceImageUrl: paymentData.referenceImageUrl || '',
      },
    };
  }

  // ── Submit ────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();

    if (!paymentData.method) {
      setApiError('Selecciona un método de pago');
      return;
    }
    if (isSplitMode && !splitPaymentData.method1) {
      setApiError('Selecciona el primer método de pago');
      return;
    }
    if (isSplitMode && !splitPaymentData.method2) {
      setApiError('Selecciona el segundo método de pago');
      return;
    }
    if (isSplitMode) {
      const isUsd1 = splitPaymentData.method1 !== 'pago_movil';
      const amount1 = isUsd1
        ? parseFloat(splitPaymentData.amountUsd1)
        : parseFloat(splitPaymentData.amountBs1);
      if (!amount1 || amount1 <= 0) {
        setApiError('Ingresa el monto del primer pago');
        return;
      }
      const maxAmount = isUsd1 ? amountUsd : amountBs;
      if (amount1 > maxAmount) {
        setApiError(`El primer pago no puede superar el total (${isUsd1 ? formatUsd(amountUsd) : formatBs(amountBs)})`);
        return;
      }
    }

    setLoading(true);
    setPaymentLoading(true);
    setApiError('');

    try {
      const payload = buildPayload();
      const order = await createOrder(payload);
      setCompletedOrder(order);
      nextStep();
    } catch (err) {
      setApiError(err.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
      setPaymentLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-28"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">Método de pago</h2>
      <p className="text-gris mb-6">Selecciona cómo deseas pagar tu pedido</p>

      {/* Total summary */}
      <div className="rounded-2xl bg-dorado-light border border-dorado/20 p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gris">Total del pedido</span>
          <span className="text-2xl font-heading font-bold text-naranja">{formatEur(totalEur)}</span>
        </div>
        {!loadingRates && rates && (
          <div className="space-y-1.5 pt-3 border-t border-dorado/20">
            <div className="flex justify-between text-sm">
              <span className="text-gris">En Bolívares</span>
              <span className="font-semibold text-negro">{formatBs(amountBs)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gris">En USD</span>
              <span className="font-semibold text-negro">{formatUsd(amountUsd)}</span>
            </div>
            <p className="text-[10px] text-gris pt-1 border-t border-dorado/10">Tasa EUR BCV: {euroBcv.toFixed(2)} Bs</p>
          </div>
        )}
        {loadingRates && <p className="text-xs text-gris text-center py-2">Cargando tasas...</p>}
      </div>

      <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">

        {/* ── Mode selector: 3 single methods + split ── */}
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentData.method === method.id;
            const displayAmount = method.currency === 'Bs' ? formatBs(amountBs) : formatUsd(amountUsd);

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => selectMode(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
                  ${isSelected ? 'border-naranja bg-naranja/5 ring-2 ring-naranja/20' : 'border-gris-border hover:border-gris hover:bg-gris-light/30'}`}
              >
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-naranja/10 text-naranja' : 'bg-gris-light text-gris'}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isSelected ? 'text-naranja' : 'text-negro'}`}>{method.label}</p>
                  <p className="text-xs text-gris">{method.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-heading font-bold ${isSelected ? 'text-naranja' : 'text-negro'}`}>{displayAmount || '—'}</p>
                  {(method.id === 'efectivo_usd' || method.id === 'binance_usdt') && discountPct > 0 ? (
                    <p className="text-[10px] font-semibold text-green-600">{discountPct}% descuento</p>
                  ) : (
                    <p className="text-[10px] text-gris">{method.currency}</p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Split mode card */}
          <button
            type="button"
            onClick={() => selectMode('split')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
              ${isSplitMode ? 'border-naranja bg-naranja/5 ring-2 ring-naranja/20' : 'border-gris-border hover:border-gris hover:bg-gris-light/30'}`}
          >
            <div className={`p-2.5 rounded-xl ${isSplitMode ? 'bg-naranja/10 text-naranja' : 'bg-gris-light text-gris'}`}>
              {/* Split icon: two overlapping cards */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${isSplitMode ? 'text-naranja' : 'text-negro'}`}>Pago dividido</p>
              <p className="text-xs text-gris">Combina dos métodos de pago</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-heading font-bold text-sm ${isSplitMode ? 'text-naranja' : 'text-gris'}`}>
                {isSplitMode ? '2 métodos' : '—'}
              </p>
            </div>
          </button>
        </div>

        {/* ── Single method details ── */}
        {!isSplitMode && paymentData.method && (
          <motion.div key={paymentData.method} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <PaymentDetails
              methodId={paymentData.method}
              amountBs={amountBs}
              amountUsd={amountUsd}
              discountPct={discountPct}
              referenceValue={paymentData.referenceId || ''}
              onReferenceChange={handleChange}
              referenceName="referenceId"
            />
          </motion.div>
        )}

        {/* ── Split mode: two payment panels ── */}
        {isSplitMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Panel 1 */}
            <div className="rounded-xl border-2 border-gris-border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-naranja text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-semibold text-negro text-sm">Primer pago</p>
                  <p className="text-[11px] text-gris">¿Cuánto pagas aquí?</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-gris">Total pedido</p>
                  <p className="text-xs font-semibold text-negro">{formatBs(amountBs)}</p>
                </div>
              </div>

              {/* Method 1 selector */}
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((m) => {
                  const sel = splitPaymentData.method1 === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => selectSplitMethod1(m.id)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer
                        ${sel ? 'border-naranja bg-naranja/5 text-naranja' : 'border-gris-border text-gris hover:border-gris'}`}
                    >
                      <span className={sel ? 'text-naranja' : 'text-gris'}>{m.icon}</span>
                      <span className="text-[11px] font-semibold leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Method 1 details with amount input */}
              {splitPaymentData.method1 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <SplitPaymentDetails
                    methodId={splitPaymentData.method1}
                    amountBsValue={splitPaymentData.amountBs1}
                    amountUsdValue={splitPaymentData.amountUsd1}
                    referenceValue={splitPaymentData.referenceId1}
                    onChange={handleSplitChange}
                    amountBsName="amountBs1"
                    amountUsdName="amountUsd1"
                    referenceName="referenceId1"
                    readOnly={false}
                    discountPct={discountPct}
                    amountError={getPanel1AmountError()}
                  />
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gris-border" />
              <span className="text-xs font-bold text-gris px-2">+</span>
              <div className="flex-1 h-px bg-gris-border" />
            </div>

            {/* Panel 2 */}
            <div className="rounded-xl border-2 border-gris-border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-naranja text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-semibold text-negro text-sm">Segundo pago</p>
                  <p className="text-[11px] text-gris">Calculado automáticamente</p>
                </div>
              </div>

              {/* Method 2 selector — excludes method1 */}
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((m) => {
                  const sel = splitPaymentData.method2 === m.id;
                  const isDisabled = m.id === splitPaymentData.method1;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => !isDisabled && selectSplitMethod2(m.id)}
                      disabled={isDisabled}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all
                        ${isDisabled ? 'border-gris-border/40 text-gris/30 cursor-not-allowed opacity-40' :
                          sel ? 'border-naranja bg-naranja/5 text-naranja cursor-pointer' :
                          'border-gris-border text-gris hover:border-gris cursor-pointer'}`}
                    >
                      <span>{m.icon}</span>
                      <span className="text-[11px] font-semibold leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Method 2 details — auto-calculated remainder */}
              {splitPaymentData.method2 && (() => {
                const remainder = getRemainderAmounts();
                const isUsd2 = splitPaymentData.method2 !== 'pago_movil';
                const displayAmount = isUsd2 ? formatUsd(remainder.amountUsd) : formatBs(remainder.amountBs);
                return (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <SplitPaymentDetails
                      methodId={splitPaymentData.method2}
                      referenceValue={splitPaymentData.referenceId2}
                      onChange={handleSplitChange}
                      referenceName="referenceId2"
                      readOnly={true}
                      displayAmountFormatted={displayAmount}
                      discountPct={discountPct}
                    />
                  </motion.div>
                );
              })()}
            </div>
          </motion.div>
        )}

      </form>

      <Toast message={apiError} type="error" show={!!apiError} onClose={() => setApiError('')} />
    </motion.div>
  );
}
