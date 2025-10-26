import { useState, useEffect } from "react";

/**
 * A custom hook that functions like `useState` but persists the value
 * in the browser's localStorage.
 *
 * @param key The key to use in localStorage.
 * @param initialValue The initial value to use if nothing is in localStorage.
 * @returns A stateful value and a function to update it.
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Get initial value from localStorage or use the provided initialValue.
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if window is defined (to avoid SSR errors)
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // 2. Create a "setter" function that persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // 3. (Optional) Listen for changes to this key from other tabs
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? (JSON.parse(e.newValue) as T) : initialValue);
        } catch (error) {
          console.error(`Error parsing storage change for key “${key}”:`, error);
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);


  return [storedValue, setValue] as const;
}

export default useLocalStorage;
