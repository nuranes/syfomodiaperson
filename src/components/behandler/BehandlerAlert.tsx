import React from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const texts = {
  searchCriteriaInfo:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til " +
    "kontoret. Søk gjerne med flere av disse samtidig.",
  noSearchMatchInfo:
    "Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
};

export const BehandlerAlert = () => (
  <AlertstripeFullbredde type="info" margintop="2em">
    <p>
      {texts.searchCriteriaInfo} {texts.noSearchMatchInfo}
    </p>
  </AlertstripeFullbredde>
);
