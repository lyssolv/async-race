import CarCard from './CarCard';
import type { Car } from '@/utils/types';
import './CarList.css';

type Flags = Record<number, boolean>;

type Props = {
  cars: Car[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  onStop: (id: number) => void;

  isStarting?: Flags;
  isDriving?: Flags;
  isStopping?: Flags;
  isDeleting?: Flags;
  raceLocked?: boolean;
};

export default function CarList({
  cars,
  selectedId,
  onSelect,
  onDelete,
  onStart,
  onStop,
  isStarting = {},
  isDriving = {},
  isStopping = {},
  isDeleting = {},
  raceLocked = false,
}: Props) {
  if (cars.length === 0) {
    return <div className="empty-garage">Don't just stare at it, create it</div>;
  }
  return (
    <ul className="car-list">
      {cars.map((car) => (
        <li key={car.id}>
          <CarCard
            car={car}
            selected={selectedId === car.id}
            onSelect={() => onSelect(car.id)}
            onDelete={() => onDelete(car.id)}
            onStart={() => onStart(car.id)}
            onStop={() => onStop(car.id)}
            isStarting={!!isStarting[car.id]}
            isDriving={!!isDriving[car.id]}
            isStopping={!!isStopping[car.id]}
            isDeleting={!!isDeleting[car.id]}
            raceLocked={raceLocked}
          />
        </li>
      ))}
    </ul>
  );
}
