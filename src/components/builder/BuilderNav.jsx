import Button from '../ui/Button';

export default function BuilderNav({
  onPrev,
  onNext,
  canGoBack = true,
  canGoNext = true,
  nextLabel = 'Siguiente',
  isLast = false,
}) {
  return (
    <div className="hidden sm:flex gap-3 mt-8 pb-8">
      {canGoBack && (
        <Button variant="ghost" size="md" onClick={onPrev} className="flex-1">
          ← Anterior
        </Button>
      )}
      <Button
        size="md"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex-1"
        variant={isLast ? 'secondary' : 'primary'}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
