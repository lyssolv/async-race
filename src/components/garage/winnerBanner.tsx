import { useEffect } from 'react';
import { BANNER_TIMER } from '@/utils/constants/index';
import './winnerBanner.css';

export function WinnerBanner({
  winner,
  onClose,
}: {
  winner: { id: number; name: string; time: number } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!winner) return;

    const bannerDuration = window.setTimeout(onClose, BANNER_TIMER);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(bannerDuration);
      window.removeEventListener('keydown', onKey);
    };
  }, [winner, onClose]);

  if (!winner) return null;

  return (
    <div className="winner-banner" role="alert" aria-live="polite" aria-atomic="true">
      <div className="winner-banner__body">
        <div className="winner-banner__title">Winner</div>
        <div className="winner-banner__text">
          {winner.name} — {winner.time} SEC
        </div>
      </div>
      <button className="winner-banner__close" type="button" onClick={onClose} aria-label="Close">
        x
      </button>
    </div>
  );
}
