import Button from "@shared/components/button";
import CarIcon from "@shared/components/CarIcon";
import type { Car } from "@shared/types";
import "./CarCard.css";

type Props= {
    car: Car;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onStart: () => void;
    onStop: () => void;
};

export default function CarCard({ 
    car,
    selected, 
    onSelect,
    onDelete,
    onStart,
    onStop, 
}: Props) {
    return (
        <article className={`car-row${selected ? " selected" : ""}`} aria-label={`${car.name} lane`}>
            <aside className="car-tile">
                <div className="tile-actions">
                    <Button color="blue" onClick={onSelect} aria-label="Select car for editing">
                        {selected ? "UNSELECT" : "SELECT"}
                    </Button>
                    <Button onClick={onDelete} aria-label="Delete car">
                        REMOVE
                    </Button>
                </div>
                <div className="tile-drive">
                    <Button size="sm" color="yellow" onClick={onStart} aria-label="Start engine">A</Button>
                    <Button size="sm" color="white" onClick={onStop} aria-label="Stop engine">B</Button>
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
