import { useEffect, useState } from 'react';
import GarageNavbar from '@/components/garage/GarageNavbar';
import CarList from '@/components/garage/CarList';
import Pagination from '@/shared/components/Pagination';
import type { Car } from '@/utils/types';
import { GARAGE_PAGE_SIZE } from '@/utils/constants';
import { listCars, createCar, updateCar, deleteCar } from '@/api/cars';
import { generate100Cars } from '@/utils/random';
import { startEngine, drive, stopEngine } from '@/api/engine';
import { getRowElems, resetCarPosition } from '@/utils/engine';

export default function Garage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState<Record<number, boolean>>({});
  const [isDriving, setIsDriving] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<Record<number, boolean>>({});

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

  async function handleStartCar(id: number) {
    if (isStarting[id] || isDriving[id] || isFinished[id]) return;
    const { tile, track, carEl } = getRowElems(id);
    if (!tile || !track || !carEl) return;
    try {
      setIsStarting((state) => ({ ...state, [id]: true }));
      console.log('before', { start: !!isStarting[id] });
      const { velocity, distance } = await startEngine(id);
      const durationMs = Math.max(1, Math.round(distance / velocity));

      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: true }));
      console.log('flags during drive', {
        start: !!isStarting[id],
        drive: !!isDriving[id],
        fin: !!isFinished[id],
      });
      carEl.style.transition = `${durationMs}ms linear`;

      setTimeout(() => {
        const carWrapperEl = document.getElementById(`car-wrapper-${id}`);

        const carWrapperElPos = carWrapperEl?.getBoundingClientRect()!;

        if (!carWrapperElPos) return;

        const carWrapperElEnd = carWrapperElPos.left + carWrapperElPos.width;

        const carEl = document.getElementById(`car-${id}`);
        const carElPos = carEl?.getBoundingClientRect()!;
        console.log(carEl, 'asd');
        if (!carEl || !carElPos) return;

        const carTransitionEndPos = carWrapperElEnd - (carElPos.left + carElPos.width) - 30;
        carEl.style.transform = `translateX(${carTransitionEndPos}px)`;
      }, 0);
      await drive(id);
      setIsDriving((state) => ({ ...state, [id]: false }));
      setIsFinished((state) => ({ ...state, [id]: true }));
    } catch (e) {
      if (carEl) resetCarPosition(carEl);
      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: false }));
      setIsFinished((state) => ({ ...state, [id]: false }));
    }
  }

  async function handleStopCar(id: number) {
    const { carEl } = getRowElems(id);
    if (!carEl) return;
    resetCarPosition(carEl);
    try {
      await stopEngine(id);
    } finally {
      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: false }));
      setIsFinished((state) => ({ ...state, [id]: false }));
    }
  }

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
        onStart={handleStartCar}
        onStop={handleStopCar}
        isStarting={isStarting}
        isDriving={isDriving}
        isFinished={isFinished}
      />
      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Garage pagination" />
    </section>
  );
}
