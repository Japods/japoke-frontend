import { motion } from 'framer-motion';
import useCatalogStore from '../../store/useCatalogStore';
import useOrderStore from '../../store/useOrderStore';
import PokeTypeCard from './PokeTypeCard';
import Button from '../ui/Button';

export default function PokeTypeSelector({ onNext }) {
  const pokeTypes = useCatalogStore((s) => s.pokeTypes);
  const currentBowl = useOrderStore((s) => s.currentBowl);
  const setPokeType = useOrderStore((s) => s.setPokeType);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-heading font-bold text-negro mb-2">
        Elige tu poke
      </h2>
      <p className="text-gris mb-8">Selecciona el tipo de bowl que quieres armar</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {pokeTypes.map((pt) => (
          <PokeTypeCard
            key={pt._id}
            pokeType={pt}
            isSelected={currentBowl.pokeType === pt._id}
            onSelect={() => setPokeType(pt._id)}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!currentBowl.pokeType}
        onClick={onNext}
      >
        Armar mi bowl
      </Button>
    </motion.div>
  );
}
