import React, { ReactElement, useState } from "react";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import styled from "styled-components";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import BehandlerSearch from "@/components/dialogmote/innkalling/BehandlerSearch";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

const texts = {
  behandlerLegend: "Velg behandler som inviteres til dialogmøtet",
  behandlerInfo: "Behandleren vil få en dialogmelding med invitasjon.",
  noBehandler: "Ingen behandler",
  leggTilBehandler: "Legg til en behandler",
};

const behandlerOneliner = (behandler: BehandlerDTO): string => {
  const name = [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
  const type = !!behandler.type ? `${capitalizeWord(behandler.type)}:` : "";
  const typeAndName = `${type} ${name}`;
  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  return [typeAndName, office, phone].filter(Boolean).join(", ");
};

export const StyledRadioGruppe = styled(RadioGruppe)`
  margin-bottom: 1em;
`;

const RadioWrapper = styled.div`
  margin-top: 1.25em;
`;

interface BehandlerRadioGruppeProps {
  behandlere: BehandlerDTO[];
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
}

const BehandlerRadioGruppe = ({
  behandlere,
  setSelectedBehandler,
}: BehandlerRadioGruppeProps): ReactElement => {
  const { isFeatureEnabled } = useFeatureToggles();
  const isBehandlerSearchEnabled = isFeatureEnabled(ToggleNames.behandlersok);
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  const updateBehandlerAndHideSearch = (behandler?: BehandlerDTO) => {
    setShowBehandlerSearch(false);
    setSelectedBehandler(behandler);
  };

  return (
    <>
      <StyledRadioGruppe
        id={"behandlerId"}
        legend={texts.behandlerLegend}
        description={texts.behandlerInfo}
      >
        <RadioWrapper>
          <Radio
            label={texts.noBehandler}
            name="behandler"
            key="ingenBehandler"
            onChange={() => updateBehandlerAndHideSearch(undefined)}
          />
          {behandlere.map((behandler, index) => (
            <Radio
              label={behandlerOneliner(behandler)}
              name="behandler"
              key={index}
              onChange={() => updateBehandlerAndHideSearch(behandler)}
            />
          ))}
          {isBehandlerSearchEnabled && (
            <Radio
              label={texts.leggTilBehandler}
              name="behandler"
              key="-1"
              onChange={() => setShowBehandlerSearch(true)}
            />
          )}
        </RadioWrapper>
      </StyledRadioGruppe>
      {isBehandlerSearchEnabled && showBehandlerSearch && (
        <BehandlerSearch setSelectedBehandler={setSelectedBehandler} />
      )}
    </>
  );
};

export default BehandlerRadioGruppe;
