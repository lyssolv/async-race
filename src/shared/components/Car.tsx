import type { Car as TCar } from '@/utils/types';
import CarIcon from './carIcon';

interface IProps {
  car: TCar;
  fullDistance?: number;
}

const Car = ({ car }: IProps) => {
  return (
    <div id={`car-${car.id}`} className="car-visual">
      <CarIcon color={car.color} />
    </div>
  );
};

export default Car;
