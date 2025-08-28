import { GARAGE_PAGE_SIZE } from "@utils/constants";

type Props = {
    page: number;
    pageCount: number;
    onChange: (p: number) => void;
};

export default function Pagination ({ page, pageCount, onChange }: Props) {
    if (pageCount <= 1) return null;

    const prev = () => onChange(Math.max(1, page - 1));
    const next = () => onChange(Math.min(pageCount, page + 1));
    const maxVisible = GARAGE_PAGE_SIZE;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(pageCount, page + half);
    if (end - start + 1 < maxVisible) {
        if (start === 1) end = Math.min(pageCount, start + maxVisible - 1);
        else if (end === pageCount) start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <nav className="pagination" aria-label="Garage pagination">
            <button onClick={prev} disabled={page === 1} aria-label="Previous page">
                ‹
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={p === page ? "active" : ""}
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