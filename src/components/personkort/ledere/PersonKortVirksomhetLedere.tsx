import React from "react";
import styled from "styled-components";
import { Column, Row } from "nav-frontend-grid";
import { Undertekst } from "nav-frontend-typografi";
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

const UndertekstUppercase = styled(Undertekst)`
  text-transform: uppercase;
`;

export const PersonKortVirksomhetLederIngressRow = () => {
  return (
    <RowFullWidth>
      <Column className="col-sm-4">
        <Undertekst>{texts.name}</Undertekst>
      </Column>
      <Column className="col-sm-2">
        <UndertekstUppercase>{texts.email}</UndertekstUppercase>
      </Column>
      <Column className="col-sm-2">
        <UndertekstUppercase>{texts.phone}</UndertekstUppercase>
      </Column>
      <Column className="col-sm-2">
        <UndertekstUppercase>{texts.startDate}</UndertekstUppercase>
      </Column>
    </RowFullWidth>
  );
};

interface PersonKortVirksomhetLederColumnProps {
  colSize: number;
  text?: string;
  isActive: boolean;
}

export const PersonKortVirksomhetLederColumn = (
  personKortVirksomhetLederColumnProps: PersonKortVirksomhetLederColumnProps
) => {
  const { colSize, text, isActive } = personKortVirksomhetLederColumnProps;
  return (
    <Column className={`col-sm-${colSize}`}>
      <p>{isActive ? <b>{text}</b> : text}</p>
    </Column>
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
        colSize={4}
        text={capitalizeAllWords(leder.narmesteLederNavn)}
        isActive={isActive}
      />
      <EpostButton epost={leder.narmesteLederEpost} />
      <PersonKortVirksomhetLederColumn
        colSize={2}
        text={leder.narmesteLederTelefonnummer}
        isActive={isActive}
      />
      {leder.aktivFom && (
        <PersonKortVirksomhetLederColumn
          colSize={2}
          text={restdatoTildato(leder.aktivFom)}
          isActive={isActive}
        />
      )}
      {leder.status && (
        <PersonKortVirksomhetLederColumn
          colSize={2}
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
