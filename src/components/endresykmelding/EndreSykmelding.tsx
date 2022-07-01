import React from "react";
import Panel from "nav-frontend-paneler";
import styled from "styled-components";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import { erProd } from "@/utils/miljoUtil";

const StyledPanel = styled(Panel)`
  margin-bottom: 1em;
`;

const StyledSystemtittel = styled(Systemtittel)`
  margin-bottom: 0.5em;
`;

const StyledNormaltekst = styled(Normaltekst)`
  margin-bottom: 2em;
`;

const texts = {
  title: "Feilregistrerte opplysninger?",
  content:
    "Har du oppdaget feilregistrerte opplysninger fra papirsykmeldingen kan du endre det her.",
  buttonLabel: "Korriger sykmeldingen",
};

const EndreSykmelding = () => {
  const env = erProd() ? "nais.adeo" : "dev.adeo";
  const sykmeldingId = window.location.pathname.split("/")[3];
  const smregistrering = `https://smregistrering.${env}.no/?sykmeldingid=${sykmeldingId}`;

  return (
    <StyledPanel>
      <StyledSystemtittel>{texts.title}</StyledSystemtittel>
      <StyledNormaltekst>{texts.content}</StyledNormaltekst>
      <a href={smregistrering} className="knapp">
        {texts.buttonLabel}
      </a>
    </StyledPanel>
  );
};

export default EndreSykmelding;
