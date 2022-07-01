import { BrukerinfoDTO } from "./types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

export const useNavBrukerData = (): BrukerinfoDTO => {
  const brukerinfo: BrukerinfoDTO = useBrukerinfoQuery().brukerinfo;
  return {
    ...brukerinfo,
  };
};
