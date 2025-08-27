import CarCard from "./CarCard";
import type { Car } from "@shared/types";

type Props = {
    cars: Car[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onDelete: (id: number) => void;
    onStart: (id: number) => void;
    onStop: (id: number) => void;
};

export default function CarList ({
    cars,
    selectedId,
    onSelect,
    onDelete,
    onStart,
    onStop,
}: Props) {
    if (cars.length === 0) {
        return <div className="empty-garage">Don't just look at it, create it</div>;
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
                    />
                </li>
            ))}
        </ul>
    );
}