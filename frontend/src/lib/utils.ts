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

const parseDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || dateStr === '-') return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};


export const checkDate = (validFrom: string, validTo: string) => {
  const from = parseDate(validFrom);
  const to = parseDate(validTo);
  const toDateOnly = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  let isValid = false;
  if (from && to) {
    const f = toDateOnly(from);
    const t = toDateOnly(to);
    const today = toDateOnly(new Date());

    if (f.getTime() === t.getTime()) {
      isValid = true;
    }
    else if (f.getTime() <= today.getTime() && today.getTime() <= t.getTime()) {
      isValid = true;
    } else {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
}