import React, { useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { HelpText, Radio, RadioGroup } from "@navikt/ds-react";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { useController, useFormContext } from "react-hook-form";

const texts = {
  sokEtterBehandlerHelpText:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til kontoret. Søk gjerne med flere av disse samtidig. Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
  sokEtterBehandlerHelpTextTitle: "Hva kan jeg søke etter her?",
  behandlerSearchOptionText: "Søk etter behandler",
  behandlerMissing: "Vennligst velg behandler",
};

interface VelgBehandlerProps {
  legend: string;
  onBehandlerSelected: (behandler: BehandlerDTO) => void;
}

export const VelgBehandler = ({
  legend,
  onBehandlerSelected,
}: VelgBehandlerProps) => {
  const { data: behandlere, isLoading } = useBehandlereQuery();
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);
  const { setValue } = useFormContext();
  const { field, fieldState } = useController({
    name: "behandlerRef",
    rules: {
      required: texts.behandlerMissing,
    },
  });

  const handleSetSelectedBehandler = (behandler: BehandlerDTO | undefined) => {
    if (behandler) {
      setValue("behandlerRef", behandler?.behandlerRef, {
        shouldValidate: true,
      });
      onBehandlerSelected(behandler);
    }
  };

  return isLoading ? (
    <AppSpinner />
  ) : (
    <RadioGroup
      legend={legend}
      name="behandlerRef"
      error={fieldState.error?.message}
    >
      {behandlere.map((behandler, index) => (
        <Radio
          key={index}
          value={behandler.behandlerRef}
          onChange={(event) => {
            setShowBehandlerSearch(false);
            handleSetSelectedBehandler(behandler);
            field.onChange(event);
          }}
        >
          {behandlerDisplayText(behandler)}
        </Radio>
      ))}
      <Radio
        value={undefined}
        onChange={(event) => {
          setShowBehandlerSearch(true);
          field.onChange(event);
        }}
      >
        {texts.behandlerSearchOptionText}
      </Radio>
      {showBehandlerSearch && (
        <div className="flex flex-row items-center">
          <BehandlerSearch setSelectedBehandler={handleSetSelectedBehandler} />
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
