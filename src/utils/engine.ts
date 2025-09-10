export function getRowElems(carId: number) {
  const row = document.querySelector<HTMLElement>(`article[data-carid="${carId}"]`);
  if (!row) return { row: null, tile: null, track: null, carEl: null, finishEl: null };
  const tile = row.querySelector<HTMLElement>('[data-tilecar]');
  const track = row.querySelector<HTMLElement>('[data-track]');
  const carEl =
    tile?.querySelector<HTMLElement>('.car-visual') ??
    track?.querySelector<HTMLElement>('.car-visual') ??
    null;
  const finishEl = row.querySelector<HTMLElement>('.finish');
  return { row, tile, track, carEl, finishEl };
}

export function getTranslateX(el: HTMLElement): number {
  const transformValue = getComputedStyle(el).transform;
  if (!transformValue || transformValue === 'none') return 0;
  try {
    const transformMatrix = new DOMMatrixReadOnly(transformValue);
    return transformMatrix.m41;
  } catch {
    return 0;
  }
}

export function computeFinish(finish: HTMLElement, carEl: HTMLElement): number {
  //const trackRect = track.getBoundingClientRect();
  const finishRect = finish.getBoundingClientRect();
  const carRect = carEl.getBoundingClientRect();

  const translateX = getTranslateX(carEl);
  const distance = finishRect.left - carRect.left + translateX - carRect.width;
  return Math.max(0, distance);
}

export function resetCarPosition(carEl: HTMLElement) {
  carEl.style.transition = 'none';
  carEl.style.transform = 'translateX(0px)';
}

export function freezeAtCurrentPosition(el: HTMLElement) {
  const translateX = getTranslateX(el);
  el.style.transition = 'none';
  el.style.transform = `translateX(${translateX}px)`;
}

export function isCarAtStart(id: number): boolean {
  const { carEl } = getRowElems(id);
  const start = 0.5;
  if (!carEl) return true;
  return Math.abs(getTranslateX(carEl)) < start;
}
