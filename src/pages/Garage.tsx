import { useMemo, useState } from "react";
import GarageNavbar from '@components/garage/GarageNavbar';
import CarList from "@components/garage/CarList";
import Pagination from "@components/garage/Pagination";
import type { Car } from "@utils/types";
import { GARAGE_PAGE_SIZE } from "@utils/constants";


const MOCK: Car[] = [
  { id: 1, name: "Tesla Model S", color: "#e63946" },
  { id: 2, name: "Ford Mustang",  color: "#1d3557" },
  { id: 3, name: "BMW M3",        color: "#457b9d" },
  { id: 4, name: "Audi A4",       color: "#2a9d8f" },
  { id: 5, name: "Porsche 911",   color: "#8a2be2" },
  { id: 6, name: "Nissan GTR",    color: "#f4a261" },
  { id: 7, name: "Ferrari Roma",  color: "#e76f51" },
  { id: 8, name: "Lambo Huracán", color: "#06d6a0" },
];

export default function Garage() {
  const [cars, setCars] = useState<Car[]>(MOCK);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const pageCount = Math.max(1, Math.ceil(cars.length / GARAGE_PAGE_SIZE));
  const pageCars = useMemo(() => {
    const start = (page - 1) * GARAGE_PAGE_SIZE;
    return cars.slice(start, start + GARAGE_PAGE_SIZE);
  }, [cars, page]);

  const createCar = (name: string, color: string) => {
    const id = Math.max(0, ...cars.map(c => c.id)) + 1;
    const next = [...cars, { id, name, color }];
    setCars(next);
    const newPage = Math.ceil(next.length / GARAGE_PAGE_SIZE);
    setPage(newPage);
  };

  const updateCar  = (id: number, name: string, color: string) => {
     setCars(prev => prev.map(c => (c.id === id ? { ...c, name, color } : c)));
};

  const removeCar = (id: number) => {
    const next = cars.filter(c => c.id !== id);
    setCars(next);
    if(selectedId === id) setSelectedId(null);
    const newPageCount = Math.max(1, Math.ceil(next.length / GARAGE_PAGE_SIZE));
    if (page > newPageCount) setPage(newPageCount);
  };

  const startRaceForPage = () => console.log("Start race for page", page);
  const resetRaceForPage = () => console.log("Reset race for page", page);
  const generate100 = () => {
    const brands = ["Tesla","Ford","BMW","Audi","Porsche","Nissan","Ferrari","Lamborghini","Toyota","Honda"];
    const models = ["Model S","Mustang","M3","A4","911","GTR","Roma","Huracán","Supra","Civic Type R"];
    const base = Math.max(0, ...cars.map(c => c.id));
    const add = Array.from({ length: 100 }, (_, i) => {
      const m1 = brands[Math.floor(Math.random()*brands.length)];
      const m2 = models[Math.floor(Math.random()*models.length)];
      const color = `#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")}`;
      return { id: base + i + 1, name: `${m1} ${m2}`, color } as Car;
    });
    const next = [...cars, ...add];
    setCars(next);
    setPage(Math.ceil(next.length / GARAGE_PAGE_SIZE));
  };



  return (
    <section className="garage-page">
      <GarageNavbar
        onStartAll={startRaceForPage}
        onResetAll={resetRaceForPage}
        onGenerate100={generate100}
        onCreate={createCar}
        selected={cars.find(c => c.id === selectedId) || null}
        onUpdateSelected={(name, color) => {
          if (selectedId != null) updateCar(selectedId, name, color);
        }}
      />

      <CarList
        cars={pageCars}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDelete={removeCar}
        onStart={(id) => console.log("start", id)}
        onStop={(id) => console.log("stop", id)}
      />

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
