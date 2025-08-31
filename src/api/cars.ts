import { api } from './http';
import type { Car } from '@/utils/types';
import { BASE_URL } from '@/utils/constants/index';

export async function listCars(page = 1, limit = 7): Promise<{ cars: Car[]; total: number }> {
  const url = `${BASE_URL}/garage?_page=${page}&_limit=${limit}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Failed to load cars');
  const cars = (await r.json()) as Car[];
  const total = Number(r.headers.get('X-Total-Count') ?? cars.length);
  return { cars, total };
}

export const createCar = (data: Omit<Car, 'id'>) =>
  api<Car>('/garage', { method: 'POST', body: JSON.stringify(data) });

export const updateCar = (id: number, data: Omit<Car, 'id'>) =>
  api<Car>(`/garage/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteCar = (id: number) => api<void>(`/garage/${id}`, { method: 'DELETE' });
