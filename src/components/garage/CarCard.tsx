import Button from '@/shared/components/button';
import CarIcon from '@/shared/components/CarIcon';
import type { Car } from '@/utils/types';
import './CarCard.css';

type Props = {
  car: Car;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onStart: () => void;
  onStop: () => void;

  isStarting?: boolean;
  isDriving?: boolean;
  isStopping?: boolean;
  isDeleting?: boolean;
  raceLocked?: boolean;
};

export default function CarCard({
  car,
  selected,
  onSelect,
  onDelete,
  onStart,
  onStop,
  isStarting = false,
  isDriving = false,
  isStopping = false,
  isDeleting = false,
  raceLocked = false,
}: Props) {
  const disableStart = raceLocked || isStarting || isDriving;
  const disableStop = raceLocked || isStopping || (!isStarting && !isDriving);
  const disableCRUD = raceLocked || isDeleting;

  return (
    <article
      className={`car-row${selected ? ' selected' : ''}`}
      aria-label={`${car.name} lane`}
      data-carid={car.id}
    >
      <aside className="car-tile">
        <div className="tile-actions">
          <Button
            color="blue"
            onClick={onSelect}
            aria-label="Select car for editing"
            disabled={disableCRUD}
          >
            {selected ? 'UNSELECT' : 'SELECT'}
          </Button>
          <Button onClick={onDelete} aria-label="Delete car" disabled={disableCRUD}>
            REMOVE
          </Button>
        </div>
        <div className="tile-drive">
          <Button
            size="sm"
            color="yellow"
            onClick={onStart}
            aria-label="Start engine"
            disabled={disableStart}
          >
            A
          </Button>
          <Button
            size="sm"
            color="white"
            onClick={onStop}
            aria-label="Stop engine"
            disabled={disableStop}
          >
            {isStopping ? '…' : 'B'}
          </Button>
        </div>
        <div className="tile-car">
          <CarIcon color={car.color} />
        </div>
      </aside>
      <div className="car-track">
        <div className="start" aria-hidden="true" />
        <div className="car-name">{car.name}</div>
        <div className="finish" aria-hidden="true" />
      </div>
    </article>
  );
}
