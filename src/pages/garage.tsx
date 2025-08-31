import { useEffect, useState, useRef } from 'react';
import GarageNavbar from '@/components/garage/garageNavbar';
import CarList from '@/components/garage/carList';
import type { Car } from '@/utils/types';
import { GARAGE_PAGE_SIZE } from '@/utils/constants';
import { listCars, createCar, updateCar, deleteCar } from '@/api/cars';
import { generate100Cars } from '@/utils/random';
import { startEngine, drive, stopEngine } from '@/api/engine';
import { getRowElems, resetCarPosition } from '@/utils/engine';
import { insertWinners } from '@/api/winners';
import Pagination from '@/shared/components/pagination';

export default function Garage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState<Record<number, boolean>>({});
  const [isDriving, setIsDriving] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<Record<number, boolean>>({});
  const [raceLocked, setRaceLocked] = useState(false);
  const [needsReset, setNeedsReset] = useState(false);

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

      const { velocity, distance } = await startEngine(id);
      const durationMs = Math.max(1, Math.round(distance / velocity));

      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: true }));

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
      const time1 = performance.now();
      await drive(id);
      const time2 = performance.now();
      const timeSec = +((time2 - time1) / 1000).toFixed(2);
      raceTimesRef.current[id] = timeSec;
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

  const carsRef = useRef<Car[]>(cars);
  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);
  const finishedRef = useRef<Record<number, boolean>>({});
  useEffect(() => {
    finishedRef.current = isFinished;
  }, [isFinished]);
  const raceTimesRef = useRef<Record<number, number>>({});

  async function startRaceForPage() {
    if (raceLocked || needsReset) return;
    setRaceLocked(true);

    cars.forEach((car) => handleStartCar(car.id));

    const checkWinner = async () => {
      const winner = carsRef.current.find((car) => finishedRef.current[car.id]);
      if (winner) {
        const raceTime = raceTimesRef.current[winner.id];
        alert(`🏆 Winner: ${winner.name} Time: ${raceTime}s`);
        try {
          await insertWinners(winner.id, raceTime);
        } catch (e) {}
        setRaceLocked(false);
        setNeedsReset(true);
        return;
      }
      requestAnimationFrame(checkWinner);
    };
    requestAnimationFrame(checkWinner);
  }

  function resetRaceForPage() {
    setRaceLocked(false);
    setNeedsReset(false);

    cars.forEach((car) => {
      const { carEl } = getRowElems(car.id);
      if (carEl) resetCarPosition(carEl);

      setIsStarting((s) => ({ ...s, [car.id]: false }));
      setIsDriving((s) => ({ ...s, [car.id]: false }));
      setIsFinished((s) => ({ ...s, [car.id]: false }));
      stopEngine(car.id).catch(() => {});
    });
  }

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
        raceLocked={raceLocked}
        needsReset={needsReset}
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
        raceLocked={raceLocked}
      />
      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Garage pagination" />
    </section>
  );
}
