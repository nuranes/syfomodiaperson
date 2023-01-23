import { HistorikkEvent } from "./types/historikkTypes";
import {
  useHistorikkMotebehovQuery,
  useHistorikkOppfolgingsplan,
} from "@/data/historikk/historikkQueryHooks";

export const useHistorikk: () => {
  hentingHistorikkFeilet: boolean;
  oppfolgingsplanHistorikk: HistorikkEvent[];
  motebehovHistorikk: HistorikkEvent[];
  henterHistorikk: boolean;
} = () => {
  const motebehovHistorikkQuery = useHistorikkMotebehovQuery();
  const oppfolgingsplanHistorikkQuery = useHistorikkOppfolgingsplan();

  const henterHistorikk =
    oppfolgingsplanHistorikkQuery.isInitialLoading ||
    motebehovHistorikkQuery.isInitialLoading;

  return {
    henterHistorikk,
    hentingHistorikkFeilet:
      motebehovHistorikkQuery.isError || oppfolgingsplanHistorikkQuery.isError,
    motebehovHistorikk: motebehovHistorikkQuery.data,
    oppfolgingsplanHistorikk: oppfolgingsplanHistorikkQuery.data,
  };
};
