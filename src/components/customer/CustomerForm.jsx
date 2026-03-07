import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import Input from '../ui/Input';

function LocationPicker({ mapUrl, onLocationSet }) {
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [pasteValue, setPasteValue] = useState('');

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError('Tu navegador no soporta geolocalización');
      return;
    }

    setLoading(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        onLocationSet(url);
        setLoading(false);
      },
      (err) => {
        const messages = {
          1: 'Permiso de ubicación denegado. Puedes pegar un link de Google Maps.',
          2: 'No se pudo obtener tu ubicación. Puedes pegar un link de Google Maps.',
          3: 'Se agotó el tiempo. Puedes pegar un link de Google Maps.',
        };
        setLocError(messages[err.code] || 'Error al obtener ubicación');
        setShowPasteInput(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationSet]);

  function handlePasteSubmit() {
    const val = pasteValue.trim();
    if (val && (val.includes('google.com/maps') || val.includes('maps.app.goo.gl') || val.includes('goo.gl/maps'))) {
      onLocationSet(val);
      setShowPasteInput(false);
      setPasteValue('');
      setLocError('');
    } else {
      setLocError('Pega un link válido de Google Maps');
    }
  }

  if (mapUrl) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-negro">Ubicación en Google Maps</label>
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-sm text-green-700 font-medium flex-1 truncate">Ubicación compartida</span>
          <button
            type="button"
            onClick={() => { onLocationSet(''); setShowPasteInput(false); setPasteValue(''); setLocError(''); }}
            className="text-xs text-green-600 hover:text-green-800 font-semibold cursor-pointer"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-negro">
        Ubicación en Google Maps
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gris-border
            text-sm font-medium text-gris hover:border-naranja hover:text-naranja transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Obteniendo...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Usar mi ubicación
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowPasteInput(!showPasteInput)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gris-border
            text-sm font-medium text-gris hover:border-naranja hover:text-naranja transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.072a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          Pegar link
        </button>
      </div>

      {showPasteInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={pasteValue}
            onChange={(e) => { setPasteValue(e.target.value); setLocError(''); }}
            placeholder="Pega aquí tu link de Google Maps"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gris-border text-sm text-negro placeholder:text-gris/50
              focus:outline-none focus:ring-2 focus:ring-naranja/30 focus:border-naranja"
          />
          <button
            type="button"
            onClick={handlePasteSubmit}
            className="px-4 py-2.5 bg-naranja text-white text-sm font-semibold rounded-xl hover:bg-naranja/90 transition-colors cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {locError && <p className="text-xs text-error">{locError}</p>}
      <p className="text-[11px] text-gris">
        Nos ayuda a calcular el costo del delivery y encontrar tu dirección más fácil.
      </p>
    </div>
  );
}

// Genera los slots disponibles: mínimo 1 hora desde ahora, redondeado al siguiente bloque de 30 min
function getAvailableSlots() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // Earliest allowed: 60 min from now, rounded up to next 30-min boundary
  const earliest = nowMinutes + 60;
  const earliestSlot = Math.ceil(earliest / 30) * 30;

  const slots = [];
  for (let h = 0; h <= 23; h++) {
    for (const m of [0, 30]) {
      const slotMinutes = h * 60 + m;
      if (slotMinutes >= earliestSlot) {
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
        <LocationPicker
          mapUrl={form.mapUrl}
          onLocationSet={(url) => setForm((f) => ({ ...f, mapUrl: url }))}
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
