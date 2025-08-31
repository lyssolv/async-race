export type Car = {
  id: number;
  name: string;
  color: string;
};

export type Winner = {
  id: number;
  name: string;
  wins: number;
  time: number;
};

export type WinnerRow = {
  no: number;
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
};

export type ListParams = {
  page?: number;
  limit?: number;
  sort?: 'wins' | 'time';
  order?: 'asc' | 'desc';
};
