import * as React from "react";
import { useState } from "react";
import PengestoppModal from "./PengestoppModal";
import PengestoppHistorikk from "./PengestoppHistorikk";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  Arbeidsgiver,
  Status,
  StatusEndring,
} from "@/data/pengestopp/types/FlaggPerson";
import { unikeArbeidsgivereMedSykmeldingSiste3Maneder } from "@/utils/pengestoppUtils";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import { Alert, BodyShort, Box, Button } from "@navikt/ds-react";

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

interface IPengestoppProps {
  sykmeldinger: SykmeldingOldFormat[];
}

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
    <Box background="surface-default" padding="4" className="mb-4">
      {isError && (
        <Alert variant="error" size="small" className="mb-4">
          {texts.hentingFeiletMessage}
        </Alert>
      )}
      {sykmeldtNotEligible && (
        <Alert variant="error" size="small" className="mb-4">
          {texts.sykmeldtNotEligibleError}
        </Alert>
      )}
      <Button
        variant="secondary"
        onClick={() =>
          toggleModal(true, uniqueArbeidsgivereWithSykmeldingLast3Months)
        }
      >
        {texts.stansSykepenger}
      </Button>
      <BodyShort className="my-4" size="small">
        {texts.explanation}
      </BodyShort>
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
    </Box>
  );
};

export default Pengestopp;
