import React, { ReactElement, useEffect, useState } from "react";
import { useField } from "react-final-form";
import AppSpinner from "@/components/AppSpinner";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { ErrorMessage, Radio, RadioGroup } from "@navikt/ds-react";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";

export const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
  noBehandler: "Ingen behandler",
};

const behandlerRadioGruppeTexts = {
  behandlerLegend: "Behandler",
  behandlerDescription: "Behandleren vil få en dialogmelding med invitasjon.",
  behandlersokTekst: "Legg til en behandler",
};

interface DialogmoteInnkallingBehandlerProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  selectedbehandler?: BehandlerDTO;
}

const DialogmoteInnkallingBehandler = ({
  setSelectedBehandler,
  selectedbehandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  const field = "behandlerRef";
  const { input, meta } = useField<string>(field);
  const { data: behandlere, isLoading } = useBehandlereQuery();

  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  useEffect(() => {
    if (!showBehandlerSearch) {
      input.onChange(selectedbehandler?.behandlerRef ?? "NONE");
    } else {
      input.onChange(selectedbehandler?.behandlerRef);
    }
  }, [input, selectedbehandler?.behandlerRef, showBehandlerSearch]);

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
      {isLoading ? (
        <AppSpinner />
      ) : (
        <>
          <RadioGroup
            id={field}
            legend={behandlerRadioGruppeTexts.behandlerLegend}
            description={behandlerRadioGruppeTexts.behandlerDescription}
            size="small"
          >
            <>
              <Radio
                name="behandler"
                key="ingenBehandler"
                value={undefined}
                onChange={() => updateBehandlerAndHideSearch(undefined)}
              >
                {texts.noBehandler}
              </Radio>
              {behandlere.map((behandler, index) => (
                <Radio
                  name="behandler"
                  key={index}
                  value={behandler}
                  onChange={() => updateBehandlerAndHideSearch(behandler)}
                >
                  {behandlerDisplayText(behandler)}
                </Radio>
              ))}
              <Radio
                name="behandler"
                key="-1"
                value={undefined}
                onChange={handleAddBehandlerRadioClick}
              >
                {behandlerRadioGruppeTexts.behandlersokTekst}
              </Radio>
            </>
          </RadioGroup>
          {showBehandlerSearch && (
            <BehandlerSearch
              setSelectedBehandler={setSelectedBehandler}
              label={behandlerRadioGruppeTexts.behandlersokTekst}
            />
          )}
        </>
      )}
      <ErrorMessage size="small">
        {meta.submitFailed && meta.error}
      </ErrorMessage>
    </>
  );
};

export default DialogmoteInnkallingBehandler;
