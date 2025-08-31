import CarIcon from '@/shared/components/carIcon11';
import type { WinnerRow } from '@/utils/types';
import './winners11.css';

type SortKey = 'wins' | 'time';
type SortOrder = 'asc' | 'desc';

type Props = {
  rows: WinnerRow[];
  sort: SortKey;
  order: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
};

export default function WinnersTable({ rows, sort, order, onSortChange }: Props) {
  const nextOrder = (key: SortKey): SortOrder =>
    sort === key ? (order === 'asc' ? 'desc' : 'asc') : 'asc';

  const handleSort = (key: SortKey) => {
    onSortChange(key, nextOrder(key));
  };
  const arrow = (key: SortKey) => (sort === key ? (order === 'asc' ? '▲' : '▼') : '');
  if (rows.length === 0) {
    return <div className="winners-empty">No car won yet</div>;
  }
  return (
    <div className="winners-table-wrap">
      <table className="winners-table" aria-label="Winners table">
        <thead className="winners-navbar">
          <tr>
            <th className="w-col-no">№</th>
            <th className="w-col-car">CAR</th>
            <th className="w-col-name">NAME</th>
            <th
              className="w-col-sort"
              onClick={() => handleSort('wins')}
              role="button"
              tabIndex={0}
            >
              WINS <span className="sort-arrow">{arrow('wins')}</span>
            </th>
            <th
              className="w-col-sort"
              onClick={() => handleSort('time')}
              role="button"
              tabIndex={0}
            >
              BEST TIME (SEC) <span className="sort-arrow">{arrow('time')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <CarIcon color={row.color} />
              </td>
              <td>{row.name}</td>
              <td>{row.wins}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
