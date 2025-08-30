function qs<T extends HTMLElement = HTMLElement>(root: ParentNode, sel: string) {
  return root.querySelector<T>(sel);
}

export function getRowElems(carId: number) {
  const row = document.querySelector<HTMLElement>(`article[data-carid="${carId}"]`);
  if (!row) return { row: null, tile: null, track: null, carEl: null };
  const tile = qs<HTMLElement>(row, '[data-tilecar]');
  const track = qs<HTMLElement>(row, '[data-track]');
  const carEl =
    tile?.querySelector<HTMLElement>('.car-visual') ||
    track?.querySelector<HTMLElement>('car-visual');
  return { row, tile, track, carEl };
}

export function resetCarPosition(carEl: HTMLElement) {
  carEl.style.transition = 'none';
  carEl.style.transform = 'translateX(0px)';
}
