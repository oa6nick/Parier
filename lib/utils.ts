import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GetMediaUrl = (value?: string) => {
  if (value) {
    return `${process.env.NEXT_PUBLIC_API_URL}/media/${value}/raw`;
  }
  return "";
};