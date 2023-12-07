import React from "react";
import {
  useCurrentVarighetOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { SyketilfelleSummaryElement } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  varighet: "Varighet: ",
  uker: "uker",
};

export const Varighet = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const weeks = useCurrentVarighetOppfolgingstilfelle();

  return !!startDate ? (
    <SyketilfelleSummaryElement
      keyword={texts.varighet}
      value={`${weeks} ${texts.uker}`}
    />
  ) : null;
};
