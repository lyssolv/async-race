/* eslint-disable max-lines-per-function */
import { DIVISOR_TWO } from '@/utils/constants/index';
import './pagination.css';

type Props = {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  label?: string;
  disabled?: boolean;
};

const makeItems = (page: number, pageCount: number): Array<number | 'ellipsis'> => {
  const middlePages = 3;
  if (pageCount <= middlePages) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const first = 1;
  const last = pageCount;

  const minStart = 2;
  const maxStart = last - middlePages;
  let start = Math.max(minStart, Math.min(page - Math.floor(middlePages / DIVISOR_TWO), maxStart));
  let end = start + middlePages - 1;

  const items: Array<number | 'ellipsis'> = [first];
  if (start > minStart) items.push('ellipsis');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < last - 1) items.push('ellipsis');
  items.push(last);
  return items;
};

export default function Pagination({
  page,
  pageCount,
  onChange,
  disabled,
  label = 'Pagination',
}: Props) {
  if (pageCount <= 1) return null;
  const items = makeItems(page, pageCount);
  return (
    <nav className="pagination" aria-label={label}>
      <button
        onClick={() => !disabled && onChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-disabled={disabled || page <= 1}
      >
        ‹
      </button>
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`e-${index}`} className="ellipsis" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            disabled={disabled || item === page}
            aria-current={item === page ? 'page' : undefined}
            className={item === page ? 'active' : ''}
          >
            {item}
          </button>
        ),
      )}
      <button
        onClick={() => !disabled && onChange(page + 1)}
        disabled={disabled || page >= pageCount}
        aria-disabled={disabled || page >= pageCount}
      >
        ›
      </button>
    </nav>
  );
}
