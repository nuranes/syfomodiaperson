import React from "react";
import styled from "styled-components";
import { Row } from "nav-frontend-grid";
import { restdatoTildato } from "@/utils/datoUtils";
import PersonKortVirksomhetHeader from "./PersonKortVirksomhetHeader";
import EpostButton from "../EpostButton";
import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledereTypes";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { capitalizeAllWords } from "@/utils/stringUtils";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Detail } from "@navikt/ds-react";

const texts = {
  name: "Navn",
  phone: "Telefon",
  email: "E-post",
  orgnummer: "Org.nummer",
  startDate: "Meldt inn",
  active: "Nåværende",
  deactivated: "Deaktivert",
  deactivatedArbeidstaker: "Deaktivert av arbeidstakeren",
  deactivatedLeder: "Deaktivert av lederen",
  deactivatedArbeidsforhold: "Arbeidsforholdet er avsluttet",
  deactivatedNyLeder: "Ny leder er meldt inn",
};

const getNarmesteLederRelasjonStatusText = (
  status: NarmesteLederRelasjonStatus
) => {
  switch (status) {
    case NarmesteLederRelasjonStatus.INNMELDT_AKTIV:
      return texts.active;
    case NarmesteLederRelasjonStatus.DEAKTIVERT:
      return texts.deactivated;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSTAKER:
      return texts.deactivatedArbeidstaker;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING:
      return texts.deactivatedArbeidstaker;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_LEDER:
      return texts.deactivatedLeder;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_ARBEIDSFORHOLD:
      return texts.deactivatedArbeidsforhold;
    case NarmesteLederRelasjonStatus.DEAKTIVERT_NY_LEDER:
      return texts.deactivatedNyLeder;
    default:
      return "";
  }
};

const RowFullWidth = styled(Row)`
  width: 100%;
  margin-bottom: 0.5em;
`;

export const PersonKortVirksomhetLederIngressRow = () => {
  return (
    <RowFullWidth>
      <div className="float-left relative w-1/3 px-2">
        <Detail>{texts.name}</Detail>
      </div>
      <div className="float-left relative w-1/6 px-2">
        <Detail className="uppercase">{texts.email}</Detail>
      </div>
      <div className="float-left relative w-1/6 px-2">
        <Detail className="uppercase">{texts.phone}</Detail>
      </div>
      <div className="float-left relative w-1/6 px-2">
        <Detail className="uppercase">{texts.startDate}</Detail>
      </div>
    </RowFullWidth>
  );
};

interface PersonKortVirksomhetLederColumnProps {
  size: "small" | "medium";
  text?: string;
  isActive: boolean;
}

export const PersonKortVirksomhetLederColumn = (
  personKortVirksomhetLederColumnProps: PersonKortVirksomhetLederColumnProps
) => {
  const { size, text, isActive } = personKortVirksomhetLederColumnProps;
  const width = size === "small" ? "1/6" : "1/3";

  return (
    <div className={`float-left relative w-${width} px-2`}>
      <p>{isActive ? <b>{text}</b> : text}</p>
    </div>
  );
};

interface PersonKortVirksomhetLederRowProps {
  leder: NarmesteLederRelasjonDTO;
}

export const PersonKortVirksomhetLederRow = (
  personKortVirksomhetLederRowProps: PersonKortVirksomhetLederRowProps
) => {
  const { leder } = personKortVirksomhetLederRowProps;
  const isActive = leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV;
  return (
    <RowFullWidth>
      <PersonKortVirksomhetLederColumn
        size="medium"
        text={capitalizeAllWords(leder.narmesteLederNavn)}
        isActive={isActive}
      />
      <EpostButton epost={leder.narmesteLederEpost} />
      <PersonKortVirksomhetLederColumn
        size="small"
        text={leder.narmesteLederTelefonnummer}
        isActive={isActive}
      />
      {leder.aktivFom && (
        <PersonKortVirksomhetLederColumn
          size="small"
          text={restdatoTildato(leder.aktivFom)}
          isActive={isActive}
        />
      )}
      {leder.status && (
        <PersonKortVirksomhetLederColumn
          size="small"
          text={getNarmesteLederRelasjonStatusText(leder.status)}
          isActive={isActive}
        />
      )}
    </RowFullWidth>
  );
};

interface PersonKortVirksomhetLedereProps {
  sykmeldinger: SykmeldingOldFormat[];
  virksomhetLederMap: Map<string, NarmesteLederRelasjonDTO>;
  virksomhetsnummer: string;
}

const PersonKortVirksomhetLedere = (
  personKortVirksomhetLedereProps: PersonKortVirksomhetLedereProps
) => {
  const { sykmeldinger, virksomhetLederMap, virksomhetsnummer } =
    personKortVirksomhetLedereProps;
  const currentLeder: NarmesteLederRelasjonDTO =
    virksomhetLederMap[virksomhetsnummer][0];

  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);

  return (
    <PersonKortVirksomhetHeader
      arbeidsgiverForskutterer={currentLeder.arbeidsgiverForskutterer}
      virksomhetsnavn={virksomhetsnavn || ""}
      virksomhetsnummer={currentLeder.virksomhetsnummer}
      sykmeldinger={sykmeldinger}
    >
      <PersonKortVirksomhetLederIngressRow />
      {virksomhetLederMap[virksomhetsnummer].map(
        (leder: NarmesteLederRelasjonDTO, idx: number) => {
          return <PersonKortVirksomhetLederRow key={idx} leder={leder} />;
        }
      )}
    </PersonKortVirksomhetHeader>
  );
};

export default PersonKortVirksomhetLedere;
