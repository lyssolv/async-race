import { MAX_PAGE_VISIBLE } from '@/utils/constants';
import './pagination.css';

type Props = {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  label?: string;
};

export default function Pagination({ page, pageCount, onChange, label = 'Pagination' }: Props) {
  if (pageCount <= 1) return null;

  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pageCount, page + 1));
  const maxVisible = MAX_PAGE_VISIBLE;
  const DIVISOR_TWO = 2;
  const half = Math.floor(maxVisible / DIVISOR_TWO);
  let start = Math.max(1, page - half);
  let end = Math.min(pageCount, page + half);
  if (end - start + 1 < maxVisible) {
    if (start === 1) end = Math.min(pageCount, start + maxVisible - 1);
    else if (end === pageCount) start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label={label}>
      <button onClick={prev} disabled={page === 1} aria-label="Previous page">
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={p === page ? 'active' : ''}
        >
          {p}
        </button>
      ))}
      <button onClick={next} disabled={page === pageCount} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}
