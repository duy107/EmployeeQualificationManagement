import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeEmptyStrings = (obj: Record<string, unknown>): Record<string, unknown> => {
  for (const key in obj) {
    if (obj[key] === "") {
      delete obj[key];
    }
  }
  return obj;
};

export const checkDate = (validFrom: Date | string | null, validTo: Date | string | null) => {

  const from = validFrom && new Date(validFrom);
  const to = validTo && new Date(validTo);
  const today = new Date();

  let isValid = false;
  
  if (from && to) {
    if (from.getTime() === to.getTime()) {
      isValid = true;
    }
    else if (from.getTime() <= today.getTime() && today.getTime() <= to.getTime()) {
      isValid = true;
    } else {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  return isValid;
}