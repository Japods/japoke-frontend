import { useState } from 'react';
import { motion } from 'framer-motion';
import useOrderStore from '../../store/useOrderStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function CustomerForm() {
  const customer = useOrderStore((s) => s.customer);
  const setCustomer = useOrderStore((s) => s.setCustomer);
  const nextStep = useOrderStore((s) => s.nextStep);

  const [form, setForm] = useState({ ...customer });
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
    nextStep();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Tus datos
      </h2>
      <p className="text-gris mb-8">Para poder enviarte tu pedido</p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
        <Input
          label="Notas especiales"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Alergias, instrucciones especiales..."
          multiline
        />

        <Button type="submit" size="lg" className="w-full mt-4">
          Continuar al pago
        </Button>
      </form>
    </motion.div>
  );
}
