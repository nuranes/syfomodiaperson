import React, { ReactElement } from "react";
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
};

const behandlerOneliner = (behandler: BehandlerDTO): string => {
  const name = [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
  const typeAndName = `${capitalizeWord(behandler.type)}: ${name}`;
  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  return [typeAndName, office, phone].filter(Boolean).join(", ");
};

export const StyledRadioGruppe = styled(RadioGruppe)`
  margin-bottom: 1em;
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
  const visBehandlerSok = isFeatureEnabled(ToggleNames.behandlersok);

  return (
    <>
      <StyledRadioGruppe id={"behandlerId"} legend={texts.behandlerLegend}>
        <Radio
          label={texts.noBehandler}
          name="behandler"
          onChange={() => setSelectedBehandler(undefined)}
        />
        {behandlere.map((behandler, index) => (
          <Radio
            label={behandlerOneliner(behandler)}
            name="behandler"
            key={index}
            onChange={() => setSelectedBehandler(behandler)}
          />
        ))}
        {visBehandlerSok && (
          <Radio label="Annen behandler" name="behandler" key="-1" />
        )}
      </StyledRadioGruppe>
      {visBehandlerSok && (
        <BehandlerSearch /> // TODO: Vis denne bare hvis behandler er valgt
      )}
      <p>{texts.behandlerInfo}</p>
    </>
  );
};

export default BehandlerRadioGruppe;
