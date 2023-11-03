import React from "react";
import { Alert } from "@navikt/ds-react";

const texts = {
  searchCriteriaInfo:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til " +
    "kontoret. Søk gjerne med flere av disse samtidig.",
  noSearchMatchInfo:
    "Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
};

export const BehandlerAlert = () => (
  <Alert variant="info" size="small" style={{ marginTop: "1em" }}>
    <p>
      {texts.searchCriteriaInfo} {texts.noSearchMatchInfo}
    </p>
  </Alert>
);
