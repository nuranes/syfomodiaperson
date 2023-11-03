import React, { useEffect, useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { Radio, RadioGroup } from "@navikt/ds-react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { MeldingTilBehandlerSkjemaValues } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { capitalizeWord } from "@/utils/stringUtils";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";

const texts = {
  behandlerLegend: "Velg behandler som skal motta meldingen",
  behandlersokTekst: "Søk etter behandler",
  missingBehandler: "Vennligst velg behandler",
};

interface VelgBehandlerProps {
  selectedBehandler: BehandlerDTO | undefined;
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  register: UseFormRegister<MeldingTilBehandlerSkjemaValues>;
  setError: UseFormSetError<MeldingTilBehandlerSkjemaValues>;
  watch: UseFormWatch<MeldingTilBehandlerSkjemaValues>;
  trigger: UseFormTrigger<MeldingTilBehandlerSkjemaValues>;
  errors: FieldErrors<MeldingTilBehandlerSkjemaValues>;
}

const behandlerRadioButtonText = (behandler: BehandlerDTO): string => {
  const name = [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
  const type = !!behandler.type ? `${capitalizeWord(behandler.type)}:` : "";
  const typeAndName = `${type} ${name}`;
  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  return [typeAndName, office, phone].filter(Boolean).join(", ");
};

export const VelgBehandler = ({
  selectedBehandler,
  setSelectedBehandler,
  register,
  setError,
  watch,
  trigger,
  errors,
}: VelgBehandlerProps) => {
  const { data: behandlere, isInitialLoading } = useBehandlereQuery();
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  const sokEtterBehandlerRadioButtonChoice = "sokEtterBehandler";
  const behandlerRefField = register("behandlerRef", {
    required: true,
    validate: (value) => {
      if (
        value === sokEtterBehandlerRadioButtonChoice &&
        selectedBehandler === undefined
      ) {
        setError("behandlerRef", { type: "custom" });
        return false;
      }
      return true;
    },
  });

  const behandlerRefValue = watch("behandlerRef");
  useEffect(() => {
    if (
      behandlerRefValue === sokEtterBehandlerRadioButtonChoice &&
      selectedBehandler !== undefined
    ) {
      trigger("behandlerRef");
    }
  }, [behandlerRefValue, selectedBehandler, trigger]);

  return (
    <>
      {isInitialLoading ? (
        <AppSpinner />
      ) : (
        <>
          <RadioGroup
            legend={texts.behandlerLegend}
            name="behandlerRef"
            error={errors.behandlerRef && texts.missingBehandler}
          >
            {behandlere.map((behandler, index) => (
              <Radio
                key={index}
                value={behandler.behandlerRef}
                {...behandlerRefField}
                onChange={(event) => {
                  setShowBehandlerSearch(false);
                  setSelectedBehandler(behandler);
                  behandlerRefField.onChange(event);
                }}
              >
                {behandlerRadioButtonText(behandler)}
              </Radio>
            ))}
            <Radio
              value={sokEtterBehandlerRadioButtonChoice}
              {...behandlerRefField}
              onChange={(event) => {
                setShowBehandlerSearch(true);
                setSelectedBehandler(undefined);
                behandlerRefField.onChange(event);
              }}
            >
              {texts.behandlersokTekst}
            </Radio>
            {showBehandlerSearch && (
              <BehandlerSearch setSelectedBehandler={setSelectedBehandler} />
            )}
          </RadioGroup>
        </>
      )}
    </>
  );
};
