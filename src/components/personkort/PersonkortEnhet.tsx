import React from "react";
import PersonkortElement from "./PersonkortElement";
import PersonkortInformasjon from "./PersonkortInformasjon";
import { KontorByggImage } from "../../../img/ImageComponents";
import ErrorBoundary from "../ErrorBoundary";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { ApiErrorException } from "@/api/errors";
import AppSpinner from "@/components/AppSpinner";
import PersonkortFeilmelding from "@/components/personkort/PersonkortFeilmelding";
import PersonkortChangeEnhet from "@/components/personkort/PersonkortChangeEnhet";
import styled from "styled-components";

const texts = {
  enhet: "Enhet",
  notFound: "Fant ikke behandlende enhet for person, prøv igjen senere.",
};

const StyledPersonkortElement = styled.div`
  flex-direction: column;
  width: fit-content;
`;

const PersonkortEnhet = () => {
  const {
    error,
    data: behandlendeenhet,
    isLoading,
    isFetching,
  } = useBehandlendeEnhetQuery();
  const informasjonNokkelTekster = new Map([["enhetId", texts.enhet]]);
  const apiError = error instanceof ApiErrorException ? error.error : undefined;
  return (
    <ErrorBoundary apiError={apiError}>
      {isLoading || isFetching ? (
        <AppSpinner />
      ) : behandlendeenhet ? (
        <PersonkortElement
          tittel={behandlendeenhet.navn}
          icon={<img src={KontorByggImage} alt={"Kontorbygg"} />}
        >
          <StyledPersonkortElement>
            <PersonkortInformasjon
              informasjonNokkelTekster={informasjonNokkelTekster}
              informasjon={{ enhetId: behandlendeenhet.enhetId }}
            />
            <PersonkortChangeEnhet behandlendeEnhet={behandlendeenhet} />
          </StyledPersonkortElement>
        </PersonkortElement>
      ) : (
        <PersonkortFeilmelding>{texts.notFound}</PersonkortFeilmelding>
      )}
    </ErrorBoundary>
  );
};

export default PersonkortEnhet;
