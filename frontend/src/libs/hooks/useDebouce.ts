import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, duration: number = 500): T {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [value, duration]);
  return debounceValue;
}
