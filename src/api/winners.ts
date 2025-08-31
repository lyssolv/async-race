import { api } from './http';
import type { Car, Winner, WinnerRow, ListParams } from '@/utils/types';
import { BASE_URL } from '@/utils/constants/index';

export async function getWinner(id: number): Promise<Winner | null> {
  const res = await fetch(`${BASE_URL}/winners/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Winner;
}

export function createWinner(data: Winner) {
  return api<Winner>('/winners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateWinner(id: number, data: Partial<Winner>) {
  return api<Winner>(`/winners/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function listWinnersRaw(params: ListParams) {
  const { page = 1, limit = 10, sort, order } = params ?? {};
  const qs = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
  });
  if (sort) qs.set('_sort', sort);
  if (order) qs.set('_order', order);

  const res = await fetch(`${BASE_URL}/winners?${qs}`);
  if (!res.ok) throw new Error('Failed to load winners');
  const winners = (await res.json()) as Winner[];
  const total = Number(res.headers.get('X-Total-Count') ?? winners.length);
  return { winners, total, page, limit };
}

export async function fetchCarsByIds(ids: number[]): Promise<Car[]> {
  if (ids.length === 0) return [];
  const qs = new URLSearchParams();
  ids.forEach((id) => qs.append('id', String(id)));
  const res = await fetch(`${BASE_URL}/garage?${qs}`);
  if (!res.ok) throw new Error('Failed to load cars');
  return (await res.json()) as Car[];
}

export async function insertWinners(id: number, time: number) {
  const existing = await getWinner(id);
  if (!existing) {
    // Fetch car to get its name
    const carRes = await fetch(`${BASE_URL}/garage/${id}`);
    if (!carRes.ok) throw new Error('Failed to load car for winner');
    const car = (await carRes.json()) as Car;
    return createWinner({ id, name: car.name, wins: 1, time });
  }
  const best = Math.min(existing.time, time);
  return updateWinner(id, { wins: existing.wins + 1, time: best });
}

export async function listWinnersWithCars(
  params: ListParams = {},
): Promise<{ rows: WinnerRow[]; total: number }> {
  const { winners, total, page, limit } = await listWinnersRaw(params);
  const ids = winners.map((w) => w.id);
  const cars = await fetchCarsByIds(ids);
  const carMap = new Map(cars.map((c) => [c.id, c]));

  const baseNo = (page - 1) * limit;

  const rows: WinnerRow[] = winners.map((w, i) => {
    const car = carMap.get(w.id);
    return {
      no: baseNo + i + 1,
      id: w.id,
      name: car?.name ?? `#${w.id}`,
      color: car?.color ?? '#000000',
      wins: w.wins,
      time: w.time,
    };
  });

  return { rows, total };
}
