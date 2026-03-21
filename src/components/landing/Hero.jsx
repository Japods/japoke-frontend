import { motion } from 'framer-motion';
import Button from '../ui/Button';

const B = [
  '/images/bowl-salmon-shrimp.jpeg',
  '/images/bowl-salmon-peanuts.jpeg',
  '/images/bowl-tuna-avocado.jpeg',
  '/images/bowl-chicken-crispy.jpeg',
  '/images/bowl-chicken-corn.jpeg',
  '/images/bowl-salmon-ceviche.jpeg',
  '/images/bowl-shrimp-chicken.jpeg',
  '/images/bowl-chicken-spicy.jpeg',
  '/images/bowl-salmon-mix.jpeg',
  '/images/bowl-ceviche-light.jpeg',
  '/images/bowl-ceviche-mango.jpeg',
  '/images/bowl-ceviche-fresh.jpeg',
  '/images/bowl-salmon-kani.jpeg',
];

function FloatingBowl({ src, delay, x, y, size, duration = 20, reverse = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
      className="absolute rounded-full overflow-hidden shadow-xl shadow-black/15 border-3 border-white/40"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <motion.img
        src={src}
        alt="Poke bowl"
        className="w-full h-full object-cover"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

// Corner bowls: cut in half by the edges
function CornerBowl({ src, delay, x, y, size, duration = 18, reverse = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute rounded-full overflow-hidden shadow-2xl shadow-black/20"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <motion.img
        src={src}
        alt="Poke bowl"
        className="w-full h-full object-cover"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

export default function Hero({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden sm:block">
        {/* Corner bowls — cut by edges */}
        <CornerBowl src={B[5]} delay={0.1} x="-80px" y="-80px" size={260} duration={30} />
        <CornerBowl src={B[8]} delay={0.2} x="calc(100% - 140px)" y="-60px" size={240} duration={35} reverse />
        <CornerBowl src={B[11]} delay={0.3} x="-70px" y="calc(100% - 160px)" size={250} duration={28} reverse />
        <CornerBowl src={B[9]} delay={0.4} x="calc(100% - 120px)" y="calc(100% - 140px)" size={230} duration={32} />

        {/* Left side bowls */}
        <FloatingBowl src={B[0]} delay={0.3} x="2%" y="28%" size={180} duration={25} reverse />
        <FloatingBowl src={B[2]} delay={0.5} x="8%" y="58%" size={150} duration={22} />

        {/* Right side bowls */}
        <FloatingBowl src={B[12]} delay={0.4} x="80%" y="26%" size={170} duration={23} />
        <FloatingBowl src={B[3]} delay={0.6} x="82%" y="56%" size={155} duration={27} reverse />

        {/* Mid-level accent bowls */}
        <FloatingBowl src={B[6]} delay={0.7} x="18%" y="14%" size={110} duration={20} />
        <FloatingBowl src={B[7]} delay={0.8} x="72%" y="12%" size={105} duration={24} reverse />
        <FloatingBowl src={B[1]} delay={0.9} x="16%" y="82%" size={100} duration={21} reverse />
        <FloatingBowl src={B[4]} delay={1.0} x="74%" y="84%" size={95} duration={26} />
      </div>

      {/* ═══ MOBILE LAYOUT ═══ */}
      <div className="sm:hidden">
        {/* Corner bowls — cut by edges */}
        <CornerBowl src={B[5]} delay={0.1} x="-70px" y="-70px" size={200} duration={28} />
        <CornerBowl src={B[12]} delay={0.2} x="calc(100% - 90px)" y="-50px" size={180} duration={32} reverse />
        <CornerBowl src={B[8]} delay={0.3} x="-60px" y="calc(100% - 110px)" size={190} duration={25} reverse />
        <CornerBowl src={B[4]} delay={0.4} x="calc(100% - 80px)" y="calc(100% - 90px)" size={180} duration={30} />

        {/* Side bowls */}
        <FloatingBowl src={B[0]} delay={0.4} x="-8%" y="30%" size={130} duration={22} reverse />
        <FloatingBowl src={B[3]} delay={0.5} x="74%" y="28%" size={125} duration={25} />

        {/* Small accents */}
        <FloatingBowl src={B[6]} delay={0.8} x="20%" y="8%" size={80} duration={18} />
        <FloatingBowl src={B[1]} delay={0.9} x="65%" y="88%" size={75} duration={21} reverse />
      </div>

      {/* ═══ CENTER CONTENT ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center z-10 max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-6xl sm:text-7xl font-heading font-extrabold tracking-tight">
            Ja<span className="text-naranja">poke</span>
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-dorado" />
            <span className="text-xs text-dorado font-medium uppercase tracking-widest">
              Poke Bowls
            </span>
            <div className="h-px w-8 bg-dorado" />
          </div>
        </motion.div>

        {/* Hero bowl image */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.3, stiffness: 150, damping: 15 }}
          className="mx-auto mb-6 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl shadow-naranja/25 border-4 border-white"
        >
          <motion.img
            src={B[12]}
            alt="Japoke Bowl"
            className="w-full h-full object-cover"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-heading font-bold text-negro mb-3"
        >
          Arma tu Poke perfecto
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gris text-base sm:text-lg mb-8"
        >
          Poke bowls frescos, hechos a tu medida
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto min-w-[220px]">
            Hacer mi pedido
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
