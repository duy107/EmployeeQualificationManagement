import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const notification = (mess: string, type: "error" | "success" = "error") => {
  toast[type](mess, {
    theme: "colored"
  });
}

export const removeEmptyStrings = (obj: any): any => {
  for (const key in obj) {
    obj[key] === "" && delete obj[key];
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