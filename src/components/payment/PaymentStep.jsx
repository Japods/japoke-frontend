import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import useCatalogStore from '../../store/useCatalogStore';
import { createOrder, getExchangeRates } from '../../api/client';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

const PAYMENT_METHODS = [
  {
    id: 'pago_movil',
    label: 'Pago Móvil',
    description: 'Transferencia en Bolívares',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    currency: 'Bs',
  },
  {
    id: 'efectivo_usd',
    label: 'Efectivo USD',
    description: 'Descuento pagando en USD efectivo',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    currency: 'USD',
  },
  {
    id: 'binance_usdt',
    label: 'Binance USDT',
    description: 'Descuento pagando en USDT',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
      </svg>
    ),
    currency: 'USDT',
  },
];

function formatBs(amount) {
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' Bs';
}

function formatUsd(amount) {
  return '$' + Number(amount).toFixed(2);
}

function formatEur(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function PaymentStep() {
  const customer = useOrderStore((s) => s.customer);
  const bowls = useOrderStore((s) => s.bowls);
  const paymentData = useOrderStore((s) => s.paymentData);
  const setPaymentData = useOrderStore((s) => s.setPaymentData);
  const setCompletedOrder = useOrderStore((s) => s.setCompletedOrder);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);

  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Calculate total in EUR
  const totalEur = bowls.reduce((sum, bowl) => {
    const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
    const base = pt?.basePrice || 0;
    const extrasTotal = bowl.extras.reduce((s, e) => s + (e.extraPrice || 0) * e.quantity, 0);
    return sum + base + extrasTotal;
  }, 0);

  useEffect(() => {
    async function fetchRates() {
      try {
        const data = await getExchangeRates();
        setRates(data);
      } catch {
        setApiError('No se pudieron cargar las tasas de cambio');
      } finally {
        setLoadingRates(false);
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

  function handleMethodSelect(methodId) {
    setPaymentData({ ...paymentData, method: methodId });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  }

  function buildPayload() {
    const totalProteinGrams = (pt) => pt?.rules?.proteinGrams ?? 100;
    const totalBaseGrams = (pt) => pt?.rules?.baseGrams ?? 120;

    return {
      customer: {
        name: customer.name,
        identification: customer.identification,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        notes: customer.notes || '',
      },
      items: bowls.map((bowl) => {
        const pt = pokeTypes.find((p) => p._id === bowl.pokeType);
        const proteinGrams = bowl.isMixProtein
          ? totalProteinGrams(pt) / bowl.proteins.length
          : totalProteinGrams(pt);
        const baseGrams = bowl.isMixBase
          ? totalBaseGrams(pt) / bowl.bases.length
          : totalBaseGrams(pt);

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
      }),
      payment: {
        method: paymentData.method,
        referenceId: paymentData.referenceId || '',
        referenceImageUrl: paymentData.referenceImageUrl || '',
      },
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!paymentData.method) {
      setApiError('Selecciona un método de pago');
      return;
    }

    setLoading(true);
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
    }
  }

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentData.method);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Método de pago
      </h2>
      <p className="text-gris mb-6">Selecciona cómo deseas pagar tu pedido</p>

      {/* Amount summary */}
      <div className="rounded-2xl bg-dorado-light border border-dorado/20 p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gris">Total del pedido</span>
          <span className="text-2xl font-heading font-bold text-naranja">
            {formatEur(totalEur)}
          </span>
        </div>

        {!loadingRates && rates && (
          <div className="space-y-1.5 pt-3 border-t border-dorado/20">
            <div className="flex justify-between text-sm">
              <span className="text-gris">En Bolívares</span>
              <span className="font-semibold text-negro">{formatBs(amountBs)}</span>
            </div>
            <div className="flex gap-3 mt-2 pt-2 border-t border-dorado/10">
              <span className="text-[10px] text-gris">
                Tasa EUR BCV: {euroBcv.toFixed(2)} Bs
              </span>
            </div>
          </div>
        )}

        {loadingRates && (
          <p className="text-xs text-gris text-center py-2">Cargando tasas...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment method selector */}
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentData.method === method.id;
            let displayAmount = '';
            if (method.currency === 'Bs') displayAmount = formatBs(amountBs);
            else if (method.currency === 'USD') displayAmount = formatUsd(amountUsd);
            else if (method.currency === 'USDT') displayAmount = formatUsd(amountUsd);

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
                  ${isSelected
                    ? 'border-naranja bg-naranja/5 ring-2 ring-naranja/20'
                    : 'border-gris-border hover:border-gris hover:bg-gris-light/30'
                  }
                `}
              >
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-naranja/10 text-naranja' : 'bg-gris-light text-gris'}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isSelected ? 'text-naranja' : 'text-negro'}`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-gris">{method.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-heading font-bold ${isSelected ? 'text-naranja' : 'text-negro'}`}>
                    {displayAmount || '—'}
                  </p>
                  {(method.id === 'efectivo_usd' || method.id === 'binance_usdt') && discountPct > 0 ? (
                    <p className="text-[10px] font-semibold text-green-600">
                      {discountPct}% descuento
                    </p>
                  ) : (
                    <p className="text-[10px] text-gris">{method.currency}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment details per method */}
        {paymentData.method === 'pago_movil' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-gris-light/50 border border-gris-border p-4 space-y-2">
              <p className="text-sm font-semibold text-negro mb-2">Datos para Pago Móvil</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[11px] text-gris">Teléfono</p>
                  <p className="font-medium text-negro">0412-3925909</p>
                </div>
                <div>
                  <p className="text-[11px] text-gris">Cédula</p>
                  <p className="font-medium text-negro">V-25870475</p>
                </div>
                <div>
                  <p className="text-[11px] text-gris">Banco</p>
                  <p className="font-medium text-negro">Banesco</p>
                </div>
                <div>
                  <p className="text-[11px] text-gris">Monto</p>
                  <p className="font-bold text-naranja">{formatBs(amountBs)}</p>
                </div>
              </div>
            </div>
            <Input
              label="Número de referencia"
              name="referenceId"
              value={paymentData.referenceId || ''}
              onChange={handleChange}
              placeholder="Últimos 4 dígitos de la referencia"
            />
          </motion.div>
        )}

        {paymentData.method === 'efectivo_usd' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-700 text-lg">💵</span>
                <p className="text-sm font-semibold text-negro">Pago en efectivo USD</p>
                {discountPct > 0 && (
                  <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {discountPct}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gris">
                Monto a pagar: <span className="text-lg font-bold text-naranja">{formatUsd(amountUsd)}</span>
              </p>
              <p className="text-xs text-gris">El pago se realiza al momento de la entrega</p>
            </div>
            <Input
              label="Nota o referencia (opcional)"
              name="referenceId"
              value={paymentData.referenceId || ''}
              onChange={handleChange}
              placeholder="Alguna nota sobre el pago"
            />
          </motion.div>
        )}

        {paymentData.method === 'binance_usdt' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-700 text-lg">🪙</span>
                <p className="text-sm font-semibold text-negro">Pago con Binance (USDT)</p>
                {discountPct > 0 && (
                  <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {discountPct}% OFF
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-sm">
                <div>
                  <p className="text-[11px] text-gris">Correo Binance (Pay / P2P)</p>
                  <p className="font-medium text-negro">jcodepod@gmail.com</p>
                </div>
                <div>
                  <p className="text-[11px] text-gris">Monto USDT</p>
                  <p className="text-lg font-bold text-naranja">{formatUsd(amountUsd)}</p>
                </div>
              </div>
            </div>
            <Input
              label="ID de transacción Binance"
              name="referenceId"
              value={paymentData.referenceId || ''}
              onChange={handleChange}
              placeholder="ID de la transacción"
            />
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={prevStep}
            className="flex-1"
          >
            Volver
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            loading={loading}
            disabled={!paymentData.method || loadingRates}
          >
            Confirmar pedido
          </Button>
        </div>
      </form>

      <Toast
        message={apiError}
        type="error"
        show={!!apiError}
        onClose={() => setApiError('')}
      />
    </motion.div>
  );
}
