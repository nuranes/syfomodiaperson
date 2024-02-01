import React, { useEffect, useState } from "react";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";

export enum Malform {
  BOKMAL = "nb",
  NYNORSK = "nn",
}

type MalformProviderProps = {
  children: React.ReactNode;
};

type MalformContextState = {
  setMalform: (malform: Malform) => void;
  malform: Malform;
};

export const MalformContext = React.createContext<
  MalformContextState | undefined
>(undefined);

export const MalformProvider = ({ children }: MalformProviderProps) => {
  const { storedValue: storedMalform, setStoredValue: setStoredMalform } =
    useLocalStorageState<Malform>(StoreKey.MALFORM);
  const [malform, setMalform] = useState<Malform>(
    storedMalform ?? Malform.BOKMAL
  );

  useEffect(() => {
    setStoredMalform(malform);
  }, [malform, setStoredMalform]);

  return (
    <MalformContext.Provider
      value={{
        malform,
        setMalform,
      }}
    >
      {children}
    </MalformContext.Provider>
  );
};

export const useMalform = () => {
  const context = React.useContext(MalformContext);
  if (!context) {
    throw new Error(`useMalform must be used within a MalformProvider`);
  }
  return context;
};
