import { carBrands } from './constants/carBrand';

export const getRandomFromArray = <T>(arr: T[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;

export const generate100Cars = () =>
  Array.from({ length: 100 }, () => {
    const randomCarBrand = getRandomFromArray(carBrands);
    const randomCarModel = getRandomFromArray(randomCarBrand.children);
    return { name: `${randomCarBrand.name} ${randomCarModel}`, color: generateRandomColor() };
  });
