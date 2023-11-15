import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";
import { SyketilfelleSummaryElement } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  startDate: "Sykmeldt: ",
};

export const TilfellePeriod = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  const periode = `${tilLesbarDatoMedArUtenManedNavn(
    startDate
  )} - ${tilLesbarDatoMedArUtenManedNavn(endDate)}`;
  return !!startDate && !!endDate ? (
    <SyketilfelleSummaryElement keyword={texts.startDate} value={periode} />
  ) : null;
};
