import { useEffect, useState } from "react";

export enum StoreKey {
  FLEXJAR_FEEDBACK_DATE = "flexjarFeedbackDate",
}

export const useLocalStorageState = <T>(key: StoreKey) => {
  const item = localStorage.getItem(key);
  const [state, setState] = useState<T | null>(() => {
    try {
      return item === null ? null : JSON.parse(item);
    } catch (error) {
      return null;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return { storedValue: state, setStoredValue: setState } as const;
};
