import { useEffect, useState } from 'react';
import GarageNavbar from '@/components/garage/GarageNavbar';
import CarList from '@/components/garage/CarList';
import Pagination from '@/shared/components/Pagination';
import type { Car } from '@/utils/types';
import { GARAGE_PAGE_SIZE } from '@/utils/constants';
import { listCars, createCar, updateCar, deleteCar } from '@/api/cars';
import { generate100Cars } from '@/utils/random';

export default function Garage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const pageCount = Math.max(1, Math.ceil(total / GARAGE_PAGE_SIZE));

  async function fetchPage(p = page) {
    const { cars, total } = await listCars(p, GARAGE_PAGE_SIZE);
    setCars(cars);
    setTotal(total);
  }

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const handleCreate = async (name: string, color: string) => {
    await createCar({ name, color });
    const { total: newTotal } = await listCars(1, GARAGE_PAGE_SIZE);
    const last = Math.max(1, Math.ceil(newTotal / GARAGE_PAGE_SIZE));
    setPage(last);
    await fetchPage(last);
  };

  const handleUpdateSelected = async (name: string, color: string) => {
    if (selectedId == null) return;
    await updateCar(selectedId, { name, color });
    await fetchPage(page);
  };

  const handleDelete = async (id: number) => {
    await deleteCar(id);
    if (selectedId === id) setSelectedId(null);
    await fetchPage(page);
    if (cars.length === 1 && page > 1) {
      const prev = page - 1;
      setPage(prev);
      await fetchPage(prev);
    }
  };

  const startRaceForPage = () => console.log('Start race for page', page);
  const resetRaceForPage = () => console.log('Reset race for page', page);

  const handleGenerate100 = async () => {
    const payloads = generate100Cars();
    await Promise.all(payloads.map(createCar));

    const { total: newTotal } = await listCars(1, GARAGE_PAGE_SIZE);

    const last = Math.max(1, Math.ceil(newTotal / GARAGE_PAGE_SIZE));
    setPage(last);

    await fetchPage(last);
  };

  return (
    <section className="garage-page">
      <GarageNavbar
        onStartAll={startRaceForPage}
        onResetAll={resetRaceForPage}
        onGenerate100={handleGenerate100}
        onCreate={handleCreate}
        selected={cars.find((c) => c.id === selectedId) || null}
        onUpdateSelected={handleUpdateSelected}
      />

      <CarList
        cars={cars}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDelete={handleDelete}
        onStart={(id) => console.log('start', id)}
        onStop={(id) => console.log('stop', id)}
      />

      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Garage pagination" />
    </section>
  );
}
