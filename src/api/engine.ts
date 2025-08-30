import { api } from './http';

export type StartResponse = { velocity: number; distance: number };
export type DriveResponse = { success: boolean };

export const startEngine = (id: number) =>
  api<StartResponse>(`/engine?id=${id}&status=started`, { method: 'PATCH' });

export const stopEngine = (id: number) =>
  api<StartResponse>(`/engine?id=${id}&status=stopped`, { method: 'PATCH' });

export const drive = (id: number) =>
  api<DriveResponse>(`/engine?id=${id}&status=drive`, { method: 'PATCH' });
