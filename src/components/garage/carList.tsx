import CarCard from './carCard';
import type { Car } from '@/utils/types';
import './carList.css';

type Flags = Record<number, boolean>;

type Props = {
  cars: Car[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  isStarting?: Flags;
  isDriving?: Flags;
  isFinished?: Flags;
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
  isFinished = {},
  raceLocked = false,
}: Props) {
  if (cars.length === 0) {
    return <div className="empty-garage">Cars under repair</div>;
  }
  return (
    <ul className="car-list">
      {cars.map((car) => {
        const isSelected = selectedId === car.id;
        return (
          <CarCard
            key={car.id}
            car={car}
            selected={isSelected}
            onSelect={() => onSelect(isSelected ? null : car.id)}
            onDelete={() => onDelete(car.id)}
            onStart={() => onStart(car.id)}
            onStop={() => onStop(car.id)}
            isStarting={!!isStarting[car.id]}
            isDriving={!!isDriving[car.id]}
            raceLocked={raceLocked}
            isFinished={!!isFinished[car.id]}
          />
        );
      })}
    </ul>
  );
}
