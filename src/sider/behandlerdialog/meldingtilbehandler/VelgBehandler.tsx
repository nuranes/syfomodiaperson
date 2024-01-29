import React, { useEffect, useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { HelpText, Radio, RadioGroup } from "@navikt/ds-react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { MeldingTilBehandlerSkjemaValues } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { behandlerDisplayText } from "@/utils/behandlerUtils";

const texts = {
  behandlerLegend: "Velg behandler som skal motta meldingen",
  behandlersokTekst: "Søk etter behandler",
  sokEtterBehandlerHelpText:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til kontoret. Søk gjerne med flere av disse samtidig. Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
  sokEtterBehandlerHelpTextTitle: "Hva kan jeg søke etter her?",
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

export const VelgBehandler = ({
  selectedBehandler,
  setSelectedBehandler,
  register,
  setError,
  watch,
  trigger,
  errors,
}: VelgBehandlerProps) => {
  const { data: behandlere, isLoading } = useBehandlereQuery();
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

  return isLoading ? (
    <AppSpinner />
  ) : (
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
          {behandlerDisplayText(behandler)}
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
        <div className="flex flex-row items-center">
          <BehandlerSearch setSelectedBehandler={setSelectedBehandler} />
          <HelpText
            title={texts.sokEtterBehandlerHelpTextTitle}
            className="ml-1"
          >
            {texts.sokEtterBehandlerHelpText}
          </HelpText>
        </div>
      )}
    </RadioGroup>
  );
};
