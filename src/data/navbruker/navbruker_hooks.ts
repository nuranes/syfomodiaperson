import { BrukerinfoDTO } from "./types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

export const useNavBrukerData = () => {
  const brukerinfo: BrukerinfoDTO = useBrukerinfoQuery().brukerinfo;
  return {
    hasSikkerhetstiltak: brukerinfo.sikkerhetstiltak.length > 0,
    ...brukerinfo,
  };
};
