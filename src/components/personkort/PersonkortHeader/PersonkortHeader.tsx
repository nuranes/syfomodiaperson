import React from "react";
import styled from "styled-components";
import EtikettBase from "nav-frontend-etiketter";
import {
  formaterFnr,
  hentBrukersAlderFraFnr,
  hentBrukersKjoennFraFnr,
} from "@/utils/fnrUtils";
import { KJOENN } from "@/konstanter";
import CopyButton from "../../kopierknapp/CopyButton";
import ErrorBoundary from "../../ErrorBoundary";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { ApiErrorException } from "@/api/errors";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { SyketilfelleSummary } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  copied: "Kopiert!",
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
};

const StyledFnr = styled.div`
  display: flex;

  img {
    padding-left: 0.5em;
    width: auto;
    height: 1.2em;
  }
`;

const PersonkortHeader = () => {
  const { data: isEgenAnsatt } = useEgenansattQuery();
  const navbruker = useNavBrukerData();
  const { error, data: diskresjonskode } = useDiskresjonskodeQuery();

  const visEtiketter =
    diskresjonskode === "6" || diskresjonskode === "7" || isEgenAnsatt;

  const personident = useValgtPersonident();

  return (
    <div className="personkortHeader">
      <div className="personkortHeader__info">
        <img
          src={
            hentBrukersKjoennFraFnr(personident) === KJOENN.KVINNE
              ? getKvinneImage()
              : getMannImage()
          }
          alt="person"
        />
        <div>
          <h3>{`${navbruker.navn} (${hentBrukersAlderFraFnr(
            personident
          )} år)`}</h3>
          <StyledFnr>
            {formaterFnr(personident)}
            <CopyButton message={texts.copied} value={personident} />
          </StyledFnr>
          <SyketilfelleSummary />
        </div>
      </div>
      {visEtiketter && (
        <ErrorBoundary
          apiError={
            error instanceof ApiErrorException ? error.error : undefined
          }
          errorMessage={texts.fetchDiskresjonskodeFailed}
        >
          <div className="personkortHeader__etikker">
            {diskresjonskode === "6" && (
              <EtikettBase mini type="fokus">
                Kode 6
              </EtikettBase>
            )}
            {diskresjonskode === "7" && (
              <EtikettBase mini type="fokus">
                Kode 7
              </EtikettBase>
            )}
            {isEgenAnsatt && (
              <EtikettBase mini type="fokus">
                Egenansatt
              </EtikettBase>
            )}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default PersonkortHeader;
