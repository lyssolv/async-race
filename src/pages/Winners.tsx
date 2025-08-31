import { useEffect, useState } from 'react';
import WinnersTable from '@/components/winners/winnersTable';
import { listWinnersWithCars } from '@/api/winners';
import type { WinnerRow } from '@/utils/types';
import Pagination from '@/shared/components/pagination';
import { WINNERS_PAGE_SIZE } from '@/utils/constants';
import '@/components/winners/Winners.css';

type SortKey = 'wins' | 'time';
type SortOrder = 'asc' | 'desc';

export default function Winners() {
  const [rows, setRows] = useState<WinnerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('wins');
  const [order, setOrder] = useState<SortOrder>('desc');
  const pageCount = Math.max(1, Math.ceil(total / WINNERS_PAGE_SIZE));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { rows, total } = await listWinnersWithCars({
          page,
          limit: WINNERS_PAGE_SIZE,
          sort,
          order,
        });
        if (!cancelled) {
          setRows(rows);
          setTotal(total);
        }
      } catch (e) {}
    })();
    return () => {
      cancelled = true;
    };
  }, [page, sort, order]);

  const handleSortChange = (key: SortKey, nextOrder: SortOrder) => {
    setSort(key);
    setOrder(nextOrder);
    setPage(1);
  };

  return (
    <section className="winners-page">
      <header className="winners-header">
        <h1>WINNERS</h1>
      </header>

      <WinnersTable rows={rows} sort={sort} order={order} onSortChange={handleSortChange} />

      <Pagination page={page} pageCount={pageCount} onChange={setPage} label="Winners pagination" />
    </section>
  );
}
