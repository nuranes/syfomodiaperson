import React, { ReactElement } from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import PersonkortFeilmelding from "./PersonkortFeilmelding";
import { Adresse, Fastlege } from "@/data/fastlege/types/Fastlege";
import { useFastlegerQuery } from "@/data/fastlege/fastlegerQueryHooks";
import { Column, Row } from "nav-frontend-grid";
import styled from "styled-components";
import PersonkortInformasjon from "@/components/personkort/PersonkortInformasjon";
import { FlexColumn, FlexRow } from "@/components/Layout";
import { Detail, Heading } from "@navikt/ds-react";

const texts = {
  name: "Legekontor",
  phone: "Telefon",
  visitingAdress: "Besøksadresse",
  postalAddress: "Postadresse",
  vikar: "Vikar",
  error:
    "Det kan hende brukeren ikke har en fastlege. Ta kontakt med brukeren for å få behandlers kontaktopplysninger.",
};

export const hentTekstFastlegePeriode = (fastlege: Fastlege) => {
  return `Fastlege: ${restdatoTilLesbarDato(fastlege.pasientforhold.fom)} - nå`;
};
export const hentTekstFastlegeNavn = (fastlege?: Fastlege) => {
  return fastlege ? `${fastlege.fornavn} ${fastlege.etternavn}` : "";
};

export const hentTekstFastlegeBesoeksadresse = (besoeksadresse: Adresse) => {
  return besoeksadresse
    ? `${besoeksadresse.adresse}, ${besoeksadresse.postnummer} ${besoeksadresse.poststed}`
    : "";
};

export const hentTekstFastlegePostadresse = (postadresse: Adresse) => {
  return postadresse
    ? `${postadresse.adresse}, ${postadresse.postnummer} ${postadresse.poststed}`
    : "";
};

const FastlegeVikarTekst = styled(FlexColumn)`
  margin-right: 1.5em;
`;

const fastlegeVikarTekst = (fastlegeVikar: Fastlege) => {
  const vikarlegeNavn = hentTekstFastlegeNavn(fastlegeVikar);
  const periodeTekst = `${restdatoTilLesbarDato(
    fastlegeVikar.gyldighet.fom
  )} - ${restdatoTilLesbarDato(fastlegeVikar.gyldighet.tom)}`;
  const stillingsprosentTekst =
    fastlegeVikar.stillingsprosent && `${fastlegeVikar.stillingsprosent}%`;
  return (
    <>
      <FastlegeVikarTekst>
        <b>{vikarlegeNavn}</b>
      </FastlegeVikarTekst>
      <FastlegeVikarTekst>{periodeTekst}</FastlegeVikarTekst>
      {stillingsprosentTekst && (
        <FastlegeVikarTekst>{stillingsprosentTekst}</FastlegeVikarTekst>
      )}
    </>
  );
};

interface FastlegeVikarProps {
  fastlegeVikarer: Fastlege[];
}

export const FastlegeVikar = ({
  fastlegeVikarer,
}: FastlegeVikarProps): ReactElement => {
  return (
    <PersonKortLegeRow>
      <Column>
        <Heading size="medium">{texts.vikar}</Heading>
      </Column>
      <>
        {fastlegeVikarer.map((lege, idx) => {
          return <FlexRow key={idx}>{fastlegeVikarTekst(lege)}</FlexRow>;
        })}
      </>
    </PersonKortLegeRow>
  );
};

const PersonKortLegeRow = styled(Row)`
  margin-left: 0;
  margin-right: 0;
  &:not(:last-child) {
    margin-bottom: 1em;
  }
  ul li {
    display: block;
  }
`;

const PersonKortElementLege = styled.div`
  @media (min-width: 48em) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0;
    .personkortElement__informasjon {
      width: calc(25% - 1em);
    }
  }
`;

const PersonkortLege = () => {
  const { fastlege, fastlegeVikarer, ikkeFunnet } = useFastlegerQuery();
  const fastlegekontor = fastlege?.fastlegekontor;

  const informasjonNokkelTekster = new Map([
    ["navn", texts.name],
    ["telefon", texts.phone],
    ["besoeksadresse", texts.visitingAdress],
    ["postadresse", texts.postalAddress],
  ]);

  const valgteElementerBesoksadresse =
    fastlege?.fastlegekontor?.besoeksadresse &&
    (({ besoeksadresse }) => {
      return { besoeksadresse };
    })({
      besoeksadresse: hentTekstFastlegeBesoeksadresse(
        fastlege.fastlegekontor.besoeksadresse
      ),
    });

  const valgteElementerPostadresse =
    fastlege?.fastlegekontor?.postadresse &&
    (({ postadresse }) => {
      return { postadresse };
    })({
      postadresse: hentTekstFastlegePostadresse(
        fastlege.fastlegekontor.postadresse
      ),
    });

  const valgteElementerKontor =
    fastlege?.fastlegekontor &&
    (({ navn, telefon }) => {
      return { navn, telefon };
    })(fastlege.fastlegekontor);

  const valgteElementer = {
    ...valgteElementerKontor,
    ...valgteElementerBesoksadresse,
    ...valgteElementerPostadresse,
  };

  return ikkeFunnet ? (
    <PersonkortFeilmelding>{texts.error}</PersonkortFeilmelding>
  ) : (
    <>
      {fastlege && (
        <PersonKortLegeRow className="no-gutter">
          <Column>
            <Heading size="medium">{hentTekstFastlegeNavn(fastlege)}</Heading>
            <Detail>{hentTekstFastlegePeriode(fastlege)}</Detail>
          </Column>
        </PersonKortLegeRow>
      )}
      {fastlegekontor && (
        <PersonKortElementLege>
          <PersonkortInformasjon
            informasjonNokkelTekster={informasjonNokkelTekster}
            informasjon={valgteElementer}
          />
        </PersonKortElementLege>
      )}
      {fastlegeVikarer.length > 0 && (
        <FastlegeVikar fastlegeVikarer={fastlegeVikarer} />
      )}
    </>
  );
};

export default PersonkortLege;
