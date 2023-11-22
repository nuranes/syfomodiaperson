import * as React from "react";
import { useState } from "react";
import { Knapp } from "nav-frontend-knapper";
import AlertStripe from "nav-frontend-alertstriper";
import styled from "styled-components";
import PengestoppModal from "./PengestoppModal";
import PengestoppHistorikk from "./PengestoppHistorikk";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  Arbeidsgiver,
  Status,
  StatusEndring,
} from "@/data/pengestopp/types/FlaggPerson";
import { unikeArbeidsgivereMedSykmeldingSiste3Maneder } from "@/utils/pengestoppUtils";
import Panel from "nav-frontend-paneler";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";

export const texts = {
  stansSykepenger: "Stanse sykepenger?",
  explanation:
    "Her sender du beskjed til NAV Arbeid og ytelser om stans av sykepenger. Foreløpig må du også lage notat i Gosys med begrunnelse",
  hentingFeiletMessage:
    "Vi har problemer med baksystemene. Du kan sende beskjeden, men det vil ikke bli synlig her før vi er tilbake i normal drift",
  sykmeldtNotEligibleError:
    "Den sykmeldte behandles ikke i vedtaksløsningen. Du må sende en “Vurder konsekvens for ytelse”-oppgave i Gosys, jf servicerutinene.",
  gosys: "Se Gosys for detaljer",
  beskjeder: "Tidligere sendte beskjeder om stans av sykepenger",
};

const Wrapper = styled(Panel)`
  margin-bottom: 1em;
  padding: 1em;
`;

interface IPengestoppProps {
  sykmeldinger: SykmeldingOldFormat[];
}

const Alert = styled(AlertStripe)`
  margin-bottom: 1em;
`;

const StyledP = styled.p`
  padding: 1em 0;
`;

const Pengestopp = ({ sykmeldinger }: IPengestoppProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: statusEndringList, isError } = usePengestoppStatusQuery();
  const [sykmeldtNotEligible, setSykmeldtNotEligible] = useState(false);

  const toggleModal = (isOpen: boolean, arbeidsgivere: Arbeidsgiver[]) => {
    if (arbeidsgivere.length === 0) {
      setSykmeldtNotEligible(true);
    } else {
      setSykmeldtNotEligible(false);
      setModalIsOpen(isOpen);
    }
  };

  const pengestopp: StatusEndring | undefined = statusEndringList.find(
    (statusEndring: StatusEndring) =>
      statusEndring.status === Status.STOPP_AUTOMATIKK
  );

  const uniqueArbeidsgivereWithSykmeldingLast3Months =
    unikeArbeidsgivereMedSykmeldingSiste3Maneder(sykmeldinger);

  return (
    <Wrapper>
      {isError && <Alert type="feil">{texts.hentingFeiletMessage}</Alert>}
      {sykmeldtNotEligible && (
        <Alert type="feil">{texts.sykmeldtNotEligibleError}</Alert>
      )}
      <Knapp
        onClick={() =>
          toggleModal(true, uniqueArbeidsgivereWithSykmeldingLast3Months)
        }
      >
        {texts.stansSykepenger}
      </Knapp>
      <StyledP>{texts.explanation}</StyledP>

      {pengestopp?.status === Status.STOPP_AUTOMATIKK && (
        <PengestoppHistorikk
          statusEndringList={statusEndringList}
          sykmeldinger={sykmeldinger}
        />
      )}
      <p>{texts.gosys}</p>
      <PengestoppModal
        arbeidsgivere={uniqueArbeidsgivereWithSykmeldingLast3Months}
        isOpen={modalIsOpen}
        onModalClose={() =>
          toggleModal(false, uniqueArbeidsgivereWithSykmeldingLast3Months)
        }
      />
    </Wrapper>
  );
};

export default Pengestopp;
