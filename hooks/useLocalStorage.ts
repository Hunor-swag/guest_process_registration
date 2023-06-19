import { Language } from "@/types/typings";
import { useEffect, useState } from "react";

function getSavedValue(key: string, initialValue: any) {
  if (typeof window === "undefined") return initialValue;
  let savedValue;
  savedValue = JSON.parse(window.localStorage.getItem(key)!);
  if (savedValue) return savedValue;
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}
