import React from "react";
import styled from "styled-components";
import {
  formaterFnr,
  hentBrukersAlderFraFnr,
  hentBrukersKjoennFraFnr,
} from "@/utils/fnrUtils";
import { KJOENN } from "@/konstanter";
import CopyButton from "../../kopierknapp/CopyButton";
import { getKvinneImage, getMannImage } from "@/utils/festiveUtils";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { SyketilfelleSummary } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";
import { Refresh } from "@navikt/ds-icons";
import { Tooltip } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { MaksdatoSummary } from "@/components/personkort/PersonkortHeader/MaksdatoSummary";
import { PersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/PersonkortHeaderTags";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";

const texts = {
  copied: "Kopiert!",
};

const StyledFnr = styled.div`
  display: flex;

  img {
    padding-left: 0.5em;
    width: auto;
    height: 1.2em;
  }
`;

const PersonkortH3 = styled.h3`
  display: flex;
  align-items: center;
`;

const GjentagendeSykefravarRefresh = styled(Refresh)`
  margin-left: 0.5em;
`;

const PersonkortHeader = () => {
  const navbruker = useNavBrukerData();
  const personident = useValgtPersonident();
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();
  const { data: maksDato } = useMaksdatoQuery();

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
          <PersonkortH3>
            {`${navbruker.navn} (${hentBrukersAlderFraFnr(personident)} år)`}
            {hasGjentakendeSykefravar && (
              <Tooltip content={"Gjentatt sykefravær"}>
                <GjentagendeSykefravarRefresh />
              </Tooltip>
            )}
          </PersonkortH3>

          <StyledFnr>
            {formaterFnr(personident)}
            <CopyButton message={texts.copied} value={personident} />
          </StyledFnr>
          <SyketilfelleSummary />
          {maksDato?.maxDate && <MaksdatoSummary maxDate={maksDato.maxDate} />}
        </div>
      </div>
      <PersonkortHeaderTags />
    </div>
  );
};

export default PersonkortHeader;
