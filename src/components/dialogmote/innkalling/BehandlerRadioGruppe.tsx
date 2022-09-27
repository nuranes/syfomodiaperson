import React, { ReactElement, useEffect, useState } from "react";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import styled from "styled-components";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import BehandlerSearch from "@/components/dialogmote/innkalling/BehandlerSearch";

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
  id: string;
  input: any;
  selectedBehandler?: BehandlerDTO;
  behandlere: BehandlerDTO[];
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
}

const BehandlerRadioGruppe = ({
  id,
  input,
  selectedBehandler,
  behandlere,
  setSelectedBehandler,
}: BehandlerRadioGruppeProps): ReactElement => {
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  useEffect(() => {
    if (!showBehandlerSearch) {
      input.onChange(selectedBehandler?.behandlerRef ?? "NONE");
    } else {
      input.onChange(selectedBehandler?.behandlerRef);
    }
  }, [input, selectedBehandler?.behandlerRef, showBehandlerSearch]);

  const updateBehandlerAndHideSearch = (behandler?: BehandlerDTO) => {
    setShowBehandlerSearch(false);
    setSelectedBehandler(behandler);
  };

  const handleAddBhandlerRadioClick = () => {
    setShowBehandlerSearch(true);
    setSelectedBehandler(undefined);
  };

  return (
    <>
      <StyledRadioGruppe
        id={id}
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
          <Radio
            label={texts.leggTilBehandler}
            name="behandler"
            key="-1"
            onChange={handleAddBhandlerRadioClick}
          />
        </RadioWrapper>
      </StyledRadioGruppe>
      {showBehandlerSearch && (
        <BehandlerSearch setSelectedBehandler={setSelectedBehandler} />
      )}
    </>
  );
};

export default BehandlerRadioGruppe;
