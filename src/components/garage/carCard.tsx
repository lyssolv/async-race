/* eslint-disable max-lines-per-function */
import type { Car as TCar } from '@/utils/types';
import Button from '@/shared/components/button';
import Car from '@/shared/components/car';
import './carCard.css';
import { isCarAtStart } from '@/utils/engine';

type Props = {
  car: TCar;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onStart: () => void;
  onStop: () => void;

  isStarting?: boolean;
  isDriving?: boolean;
  raceLocked?: boolean;
  isFinished?: boolean;
};

const CarCard = ({
  car,
  selected,
  onSelect,
  onDelete,
  onStart,
  onStop,
  isStarting = false,
  isDriving = false,
  isFinished = false,
  raceLocked = false,
}: Props) => {
  const atStart = isCarAtStart(car.id);
  const disableStart = raceLocked || isStarting || isDriving || isFinished || !atStart;
  const disableStop = raceLocked || (!isStarting && !isDriving && !isFinished && atStart);
  const disableCRUD = raceLocked;

  return (
    <li id={`car-wrapper-${car.id}`}>
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
              SELECT
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
              B
            </Button>
          </div>
          <div className="tile-car" data-tilecar>
            <Car car={car} />
          </div>
        </aside>
        <div className="car-track" data-track>
          <div className="start" aria-hidden="true" />
          <div className="car-name">{car.name}</div>
          <div className="finish" aria-hidden="true" />
        </div>
      </article>
    </li>
  );
};

export default CarCard;
