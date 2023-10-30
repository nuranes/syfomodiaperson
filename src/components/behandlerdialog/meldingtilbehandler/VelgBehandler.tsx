import React, { useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { capitalizeWord } from "@/utils/stringUtils";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";

const texts = {
  behandlerLegend: "Velg behandler som skal motta meldingen",
  noBehandler: "Ingen behandler",
  behandlersokTekst: "Søk etter behandler",
  missingBehandler: "Vennligst velg behandler",
};

interface VelgBehandlerProps {
  selectedBehandler: BehandlerDTO | undefined;
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  register: UseFormRegister<MeldingTilBehandlerSkjemaValues>;
  errors: FieldErrors<MeldingTilBehandlerSkjemaValues>;
}

export const VelgBehandler = ({
  selectedBehandler,
  setSelectedBehandler,
  register,
  errors,
}: VelgBehandlerProps) => {
  const { data: behandlere, isInitialLoading } = useBehandlereQuery();
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  // useEffect(() => {
  //   if (!showBehandlerSearch) {
  //     input.onChange(selectedBehandler?.behandlerRef ?? "NONE");
  //   } else {
  //     input.onChange(selectedBehandler?.behandlerRef);
  //   }
  // }, [input, selectedBehandler?.behandlerRef, showBehandlerSearch]);

  const updateBehandlerAndHideSearch = (behandler?: BehandlerDTO) => {
    setShowBehandlerSearch(false);
    setSelectedBehandler(behandler);
  };

  const handleAddBehandlerRadioClick = () => {
    setShowBehandlerSearch(true);
    setSelectedBehandler(undefined);
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

  return (
    <>
      {isInitialLoading ? (
        <AppSpinner />
      ) : (
        <>
          <RadioGroup
            legend={texts.behandlerLegend}
            name="behandlerRef"
            size="small"
            error={errors.behandlerRef && texts.missingBehandler}
          >
            <Radio
              key="ingenBehandler"
              value="ingenBehandler"
              {...register("behandlerRef", { required: true })}
              onChange={() => updateBehandlerAndHideSearch(undefined)}
            >
              {texts.noBehandler}
            </Radio>
            {behandlere.map((behandler, index) => (
              <Radio
                key={index}
                value={index}
                {...register("behandlerRef", { required: true })}
                onChange={() => updateBehandlerAndHideSearch(behandler)}
              >
                {behandlerOneliner(behandler)}
              </Radio>
            ))}
            <Radio
              key="-1"
              value="-1"
              {...register("behandlerRef", { required: true })}
              onChange={handleAddBehandlerRadioClick}
            >
              {texts.behandlersokTekst}
            </Radio>
          </RadioGroup>
          {showBehandlerSearch && (
            <BehandlerSearch
              setSelectedBehandler={setSelectedBehandler}
              label={texts.behandlersokTekst}
            />
          )}
        </>
      )}
    </>
  );
};
