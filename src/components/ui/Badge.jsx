const variants = {
  premium: 'bg-dorado/15 text-dorado border border-dorado/30',
  base: 'bg-gris-light text-gris border border-gris-border',
  price: 'bg-naranja-light text-naranja-dark border border-naranja/20',
  success: 'bg-success/10 text-success border border-success/20',
};

export default function Badge({ children, variant = 'base', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
