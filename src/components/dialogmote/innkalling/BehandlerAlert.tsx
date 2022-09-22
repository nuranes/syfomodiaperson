import React from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import styled from "styled-components";

const texts = {
  searchCriteriaInfo:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til " +
    "kontoret. Søk gjerne med flere av disse samtidig.",
  noSearchMatchInfo:
    "Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
};

const BehandlerInfo = styled(AlertstripeFullbredde)`
  margin-top: 2em;
`;

export const BehandlerAlert = () => (
  <BehandlerInfo type="info">
    <p>{texts.searchCriteriaInfo}</p>
    <p>{texts.noSearchMatchInfo}</p>
  </BehandlerInfo>
);
