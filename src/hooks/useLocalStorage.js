import { useState, useEffect } from 'react';

// Veriyi localStorage ile senkron tutan basit hook.
// İlk değer localStorage'dan okunur; her değişiklikte tekrar yazılır.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Depolama dolu veya erişilemez — sessizce geç.
    }
  }, [key, value]);

  return [value, setValue];
}
