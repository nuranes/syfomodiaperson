import React, { ReactElement, useEffect, useState } from "react";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";

const texts = {
  noBehandler: "Ingen behandler",
};

export interface BehandlerRadioGruppeTexts {
  behandlerLegend: string;
  behandlersokTekst: string;
  behandlerDescription?: string;
}

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

interface BehandlerRadioGruppeProps {
  id: string;
  input: any;
  selectedBehandler?: BehandlerDTO;
  behandlere: BehandlerDTO[];
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  behandlerRadioGruppeTexts: BehandlerRadioGruppeTexts;
  showNoBehandlerOption?: boolean;
}

const BehandlerRadioGruppe = ({
  id,
  input,
  selectedBehandler,
  behandlere,
  setSelectedBehandler,
  behandlerRadioGruppeTexts,
  showNoBehandlerOption = true,
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

  const handleAddBehandlerRadioClick = () => {
    setShowBehandlerSearch(true);
    setSelectedBehandler(undefined);
  };

  return (
    <>
      <RadioGruppe
        id={id}
        legend={behandlerRadioGruppeTexts.behandlerLegend}
        description={behandlerRadioGruppeTexts.behandlerDescription}
      >
        <>
          {showNoBehandlerOption && (
            <Radio
              label={texts.noBehandler}
              name="behandler"
              key="ingenBehandler"
              onChange={() => updateBehandlerAndHideSearch(undefined)}
            />
          )}
          {behandlere.map((behandler, index) => (
            <Radio
              label={behandlerOneliner(behandler)}
              name="behandler"
              key={index}
              onChange={() => updateBehandlerAndHideSearch(behandler)}
            />
          ))}
          <Radio
            label={behandlerRadioGruppeTexts.behandlersokTekst}
            name="behandler"
            key="-1"
            onChange={handleAddBehandlerRadioClick}
          />
        </>
      </RadioGruppe>
      {showBehandlerSearch && (
        <BehandlerSearch
          setSelectedBehandler={setSelectedBehandler}
          label={behandlerRadioGruppeTexts.behandlersokTekst}
        />
      )}
    </>
  );
};

export default BehandlerRadioGruppe;
