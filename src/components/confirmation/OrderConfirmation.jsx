import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/formatters';

export default function OrderConfirmation() {
  const completedOrder = useOrderStore((s) => s.completedOrder);
  const resetOrder = useOrderStore((s) => s.resetOrder);

  if (!completedOrder) return null;

  const { customer } = completedOrder;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-lg mx-auto px-4 py-12"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center"
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <motion.path
            d="M10 20l8 8 12-16"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-heading font-bold text-negro mb-2 text-center"
      >
        ¡Pedido confirmado!
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 text-center"
      >
        <p className="text-gris mb-4">Tu número de pedido es:</p>
        <div className="inline-block px-6 py-3 bg-dorado-light border border-dorado/30 rounded-2xl">
          <span className="text-2xl font-heading font-bold text-dorado">
            {completedOrder.orderNumber}
          </span>
        </div>
        {completedOrder.createdAt && (
          <p className="text-xs text-gris mt-3 flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pedido realizado a las{' '}
            <span className="font-semibold text-negro">
              {new Date(completedOrder.createdAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {' '}del{' '}
            <span className="font-semibold text-negro">
              {new Date(completedOrder.createdAt).toLocaleDateString('es-VE', { day: 'numeric', month: 'long' })}
            </span>
          </p>
        )}
      </motion.div>

      {/* Customer info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gris-border p-5 mb-4 text-left"
      >
        <h4 className="font-heading font-bold text-negro mb-3">Datos de entrega</h4>
        <div className="space-y-2 text-sm">
          <InfoRow label="Nombre" value={customer.name} />
          <InfoRow label="Identificación" value={customer.identification} />
          <InfoRow label="Email" value={customer.email} />
          <InfoRow label="Teléfono" value={customer.phone} />
          <InfoRow label="Dirección" value={customer.address} />
          {customer.notes && <InfoRow label="Notas" value={customer.notes} />}
        </div>
      </motion.div>

      {/* Bowls detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-gris-border p-5 mb-4 text-left"
      >
        <h4 className="font-heading font-bold text-negro mb-3">Detalle del pedido</h4>
        <div className="space-y-4">
          {completedOrder.items?.map((item, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-negro">
                  Bowl {idx + 1}: {item.pokeTypeName}
                </span>
                <span className="font-bold text-naranja">
                  {formatCurrency(item.itemTotal)}
                </span>
              </div>
              <div className="space-y-1 text-gris pl-3 border-l-2 border-gris-light">
                {item.proteins?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Proteína:</span>{' '}
                    {item.proteins.map((p) => `${p.name} (${p.quantity}g)`).join(' + ')}
                  </p>
                )}
                {item.bases?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Base:</span>{' '}
                    {item.bases.map((b) => `${b.name} (${b.quantity}g)`).join(' + ')}
                  </p>
                )}
                {item.vegetables?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Vegetales:</span>{' '}
                    {item.vegetables.map((v) => v.name).join(', ')}
                  </p>
                )}
                {item.sauces?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Salsas:</span>{' '}
                    {item.sauces.map((s) => s.name).join(', ')}
                  </p>
                )}
                {item.toppings?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Toppings:</span>{' '}
                    {item.toppings.map((t) => t.name).join(', ')}
                  </p>
                )}
                {item.extras?.length > 0 && (
                  <p>
                    <span className="text-negro font-medium">Extras:</span>{' '}
                    {item.extras.map((e) => `${e.name} x${e.quantity} (${formatCurrency(e.subtotal)})`).join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-gris-light p-5 mb-4"
      >
        <div className="space-y-2 text-sm">
          {completedOrder.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gris">Bowl {idx + 1}</span>
              <span className="text-negro font-medium">{formatCurrency(item.itemTotal)}</span>
            </div>
          ))}
          <div className="border-t border-gris-border pt-2 flex justify-between">
            <span className="font-semibold text-negro">Total</span>
            <span className="font-bold text-xl text-naranja">
              {formatCurrency(completedOrder.total)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Payment info */}
      {completedOrder.payment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="rounded-2xl border border-gris-border p-5 mb-8 text-left"
        >
          <h4 className="font-heading font-bold text-negro mb-3">Datos de pago</h4>
          <div className="space-y-2 text-sm">
            <InfoRow
              label="Método"
              value={
                completedOrder.payment.method === 'pago_movil' ? 'Pago Móvil (Bs)' :
                completedOrder.payment.method === 'efectivo_usd' ? 'Efectivo (USD)' :
                'Binance (USDT)'
              }
            />
            {completedOrder.payment.amountBs > 0 && (
              <InfoRow label="Monto Bs" value={`${Number(completedOrder.payment.amountBs).toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs`} />
            )}
            {completedOrder.payment.amountUsd > 0 && completedOrder.payment.method !== 'pago_movil' && (
              <InfoRow label="Monto USD" value={`$${Number(completedOrder.payment.amountUsd).toFixed(2)}`} />
            )}
            {completedOrder.payment.referenceId && (
              <InfoRow label="Referencia" value={completedOrder.payment.referenceId} />
            )}
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-gris mb-8 text-center"
      >
        Te avisaremos cuando esté listo 🥢
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Button size="lg" variant="outline" onClick={resetOrder} className="w-full">
          Hacer otro pedido
        </Button>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex">
      <span className="text-gris w-28 shrink-0">{label}:</span>
      <span className="text-negro">{value}</span>
    </div>
  );
}
