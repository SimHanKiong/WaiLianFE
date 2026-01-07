import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalise = (word: string) => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLowerCase();
};

export const startOfToday = (() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
})();

export const startOfTomorrow = (() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
})();