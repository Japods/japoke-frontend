import { useState } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import Input from '../ui/Input';

// Genera los slots disponibles a partir de la hora actual (mínimo 12:00, máximo 23:00)
function getAvailableSlots() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots = [];
  for (let h = 0; h <= 23; h++) {
    for (const m of [0, 30]) {
      if (h === 23 && m === 30) continue;
      const slotMinutes = h * 60 + m;
      if (slotMinutes > nowMinutes) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
  }
  return slots;
}

export default function CustomerForm() {
  const customer = useOrderStore((s) => s.customer);
  const setCustomer = useOrderStore((s) => s.setCustomer);
  const deliveryTime = useOrderStore((s) => s.deliveryTime);
  const setDeliveryTime = useOrderStore((s) => s.setDeliveryTime);
  const nextStep = useOrderStore((s) => s.nextStep);

  const availableSlots = getAvailableSlots();

  const [form, setForm] = useState({ ...customer });
  const [selectedTime, setSelectedTime] = useState(deliveryTime || '');
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = 'Nombre es requerido (mín. 2 caracteres)';
    if (!form.identification.trim() || form.identification.trim().length < 3)
      newErrors.identification = 'Identificación es requerida (mín. 3 caracteres)';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email válido es requerido';
    if (!form.phone.trim() || form.phone.trim().length < 7)
      newErrors.phone = 'Teléfono es requerido (mín. 7 dígitos)';
    if (!form.address.trim() || form.address.trim().length < 5)
      newErrors.address = 'Dirección es requerida (mín. 5 caracteres)';
    if (!selectedTime)
      newErrors.deliveryTime = 'Selecciona la hora de entrega';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCustomer(form);
    setDeliveryTime(selectedTime);
    nextStep();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8 pb-28"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Tus datos
      </h2>
      <p className="text-gris mb-8">Para poder enviarte tu pedido</p>

      <form id="customer-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre completo"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          error={errors.name}
          required
        />
        <Input
          label="Cédula / Identificación"
          name="identification"
          value={form.identification}
          onChange={handleChange}
          placeholder="V-12345678"
          error={errors.identification}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
            required
          />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="0412-123-4567"
            error={errors.phone}
            required
          />
        </div>
        <Input
          label="Dirección de entrega"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Calle, edificio, referencia..."
          error={errors.address}
          required
        />
        {/* Hora de entrega */}
        <div>
          <label className="block text-sm font-medium text-negro mb-2">
            ¿A qué hora quieres tu poke? <span className="text-naranja">*</span>
          </label>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-gris bg-gris-light rounded-xl px-4 py-3">
              Ya no hay horarios disponibles para hoy. Puedes contactarnos directamente.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setSelectedTime(slot);
                    setErrors((prev) => ({ ...prev, deliveryTime: '' }));
                  }}
                  className={`py-2 text-sm font-semibold rounded-xl border-2 transition-colors duration-150 cursor-pointer
                    ${selectedTime === slot
                      ? 'bg-naranja border-naranja text-white'
                      : 'bg-white border-gris-border text-negro hover:border-naranja hover:text-naranja'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
          {errors.deliveryTime && (
            <p className="text-red-500 text-xs mt-1">{errors.deliveryTime}</p>
          )}
        </div>

        <Input
          label="Notas especiales"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Alergias, instrucciones especiales..."
          multiline
        />

      </form>

    </motion.div>
  );
}
