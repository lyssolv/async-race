/* eslint-disable max-lines-per-function */
import { useEffect, useState, useRef, useCallback } from 'react';
import GarageNavbar from '@/components/garage/garageNavbar';
import CarList from '@/components/garage/carList';
import type { Car } from '@/utils/types';
import { GARAGE_PAGE_SIZE, MS_PER_SECOND, TO_FIXED_DECIMALS } from '@/utils/constants';
import { listCars, createCar, updateCar, deleteCar } from '@/api/cars';
import { generate100Cars } from '@/utils/random';
import { startEngine, drive, stopEngine } from '@/api/engine';
import {
  getRowElems,
  resetCarPosition,
  computeFinish,
  getTranslateX,
  freezeAtCurrentPosition,
  waitForTransformEnd,
} from '@/utils/engine';
import { insertWinners, deleteWinner } from '@/api/winners';
import Pagination from '@/shared/components/pagination';
import '@/components/garage/carList.css';

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

  const fetchPage = useCallback(async (p: number) => {
    const { cars, total } = await listCars(p, GARAGE_PAGE_SIZE);
    setCars(cars);
    setTotal(total);
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const carsRef = useRef<Car[]>(cars);
  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);
  const finishedRef = useRef<Record<number, boolean>>({});
  useEffect(() => {
    finishedRef.current = isFinished;
  }, [isFinished]);
  const raceTimesRef = useRef<Record<number, number>>({});
  const resizeRafId = useRef<number | null>(null);
  const animDoneRef = useRef<Record<number, Promise<void> | null>>({});
  const raceIdRef = useRef(0);
  const winnerRafRef = useRef<number | null>(null);

  const handleResize = useCallback(() => {
    if (resizeRafId.current !== null) return;
    resizeRafId.current = requestAnimationFrame(() => {
      resizeRafId.current = null;

      const rows = document.querySelectorAll<HTMLElement>('article[data-carid]');
      rows.forEach((row) => {
        const carIdAttr = row.getAttribute('data-carid');
        if (!carIdAttr) return;
        const id = Number(carIdAttr);
        if (Number.isNaN(id)) return;

        const { track, carEl, finishEl } = getRowElems(id);
        if (!track || !carEl || !finishEl) return;

        const maxDistance = computeFinish(finishEl, carEl);
        if (maxDistance <= 0) return;

        const finished = !!finishedRef.current[id];
        const translateX = getTranslateX(carEl);
        const rawProgress = finished ? 1 : translateX / maxDistance;
        const progress = Math.max(0, Math.min(1, rawProgress));

        const prevTransition = carEl.style.transition;
        carEl.style.transition = 'none';
        carEl.style.transform = `translateX(${progress * maxDistance}px)`;
        void carEl.offsetWidth;
        carEl.style.transition = prevTransition;
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const id = requestAnimationFrame(handleResize);
    return () => cancelAnimationFrame(id);
  }, [cars, page, handleResize]);

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
    await deleteWinner(id).catch(() => {});
    if (selectedId === id) setSelectedId(null);
    await fetchPage(page);
    if (cars.length === 1 && page > 1) {
      const prev = page - 1;
      setPage(prev);
      await fetchPage(prev);
    }
  };

  async function handleStartCar(id: number) {
    const myRace = raceIdRef.current;
    if (isStarting[id] || isDriving[id] || isFinished[id]) return;
    const { track, carEl, finishEl } = getRowElems(id);
    if (!track || !carEl || !finishEl) return;

    try {
      setIsStarting((state) => ({ ...state, [id]: true }));
      const { velocity, distance } = await startEngine(id);
      if (raceIdRef.current !== myRace) return;
      const durationMs = Math.max(1, Math.round(distance / velocity));

      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: true }));

      const maxDistance = computeFinish(finishEl, carEl);
      carEl.style.transition = `transform ${durationMs}ms linear`;
      animDoneRef.current[id] = waitForTransformEnd(carEl, durationMs);

      requestAnimationFrame(() => {
        if (raceIdRef.current === myRace) {
          carEl.style.transform = `translateX(${maxDistance}px)`;
        }
      });

      const timeBeforeDrive = performance.now();
      await drive(id);
      if (raceIdRef.current !== myRace) return;
      const timeAfterDrive = performance.now();

      const raceTime = +((timeAfterDrive - timeBeforeDrive) / MS_PER_SECOND).toFixed(
        TO_FIXED_DECIMALS,
      );
      raceTimesRef.current[id] = raceTime;

      setIsDriving((state) => ({ ...state, [id]: false }));
      setIsFinished((state) => ({ ...state, [id]: true }));
    } catch {
      if (carEl) freezeAtCurrentPosition(carEl);

      setIsStarting((state) => ({ ...state, [id]: false }));
      setIsDriving((state) => ({ ...state, [id]: false }));
      setIsFinished((state) => ({ ...state, [id]: false }));
      animDoneRef.current[id] = null;
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

  async function startRaceForPage() {
    if (raceLocked || needsReset) return;
    setRaceLocked(true);

    const myRace = ++raceIdRef.current;
    cars.forEach((car) => {
      animDoneRef.current[car.id] = null;
    });
    cars.forEach((car) => handleStartCar(car.id));

    const checkWinner = async () => {
      if (raceIdRef.current !== myRace) return;
      const winner = carsRef.current.find((car) => finishedRef.current[car.id]);
      if (winner) {
        const raceTime = raceTimesRef.current[winner.id];
        const animDone = animDoneRef.current[winner.id];
        if (animDone) {
          await animDone;
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
          if (raceIdRef.current !== myRace) return;
        }

        alert(`🏆 Winner: ${winner.name} Time: ${raceTime}s`);
        try {
          await insertWinners(winner.id, raceTime);
        } catch {
          // intentionally ignored
        }
        setRaceLocked(false);
        setNeedsReset(true);
        return;
      }
      winnerRafRef.current = requestAnimationFrame(checkWinner);
    };
    winnerRafRef.current = requestAnimationFrame(checkWinner);
  }

  function resetRaceForPage() {
    raceIdRef.current++;
    if (winnerRafRef.current !== null) {
      cancelAnimationFrame(winnerRafRef.current);
      winnerRafRef.current = null;
    }

    setRaceLocked(false);
    setNeedsReset(false);

    cars.forEach((car) => {
      const { carEl } = getRowElems(car.id);
      if (carEl) resetCarPosition(carEl);

      setIsStarting((s) => ({ ...s, [car.id]: false }));
      setIsDriving((s) => ({ ...s, [car.id]: false }));
      setIsFinished((s) => ({ ...s, [car.id]: false }));
      animDoneRef.current[car.id] = null;
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
      <footer className="garage-total" aria-live="polite">
        {`GARAGE (${total})`}
      </footer>
    </section>
  );
}
