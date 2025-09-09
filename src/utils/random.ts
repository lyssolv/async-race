import { carBrands } from './constants/carBrand';
import { MAX_COLOR_VALUE, HEX_RADIX, HEX_COLOR_LENGTH } from './constants/index';

export const getRandomFromArray = <T>(arr: T[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const generateRandomColor = () =>
  `#${Math.floor(Math.random() * MAX_COLOR_VALUE)
    .toString(HEX_RADIX)
    .padStart(HEX_COLOR_LENGTH, '0')}`;

export const generate100Cars = () =>
  Array.from({ length: 100 }, () => {
    const randomCarBrand = getRandomFromArray(carBrands);
    const randomCarModel = getRandomFromArray(randomCarBrand.children);
    return { name: `${randomCarBrand.name} ${randomCarModel}`, color: generateRandomColor() };
  });
