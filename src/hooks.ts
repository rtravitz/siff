import { useState, useEffect } from 'react'

export function useStickySet<T>(defaultValue: Set<T>, key: string): [Set<T>, (val: Set<T>) => void] {
  const [value, setValue] = useState<Set<T>>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? new Set(JSON.parse(stickyValue)) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(Array.from(value)));
  }, [key, value]);
  return [value, setValue];
}

