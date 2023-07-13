import React from "react";
import { SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import BehandlerRadioGruppe, {
  BehandlerRadioGruppeTexts,
} from "@/components/behandler/BehandlerRadioGruppe";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";

const behandlerRadioGruppeTexts: BehandlerRadioGruppeTexts = {
  behandlerLegend: "Velg behandler som skal motta meldingen",
  behandlersokTekst: "Søk etter behandler",
};

interface VelgBehandlerProps {
  selectedBehandler: BehandlerDTO | undefined;
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
}

export const VelgBehandler = ({
  selectedBehandler,
  setSelectedBehandler,
}: VelgBehandlerProps) => {
  const { data: behandlere, isInitialLoading } = useBehandlereQuery();
  const field = "behandlerRef";
  return (
    <Field<string> name={field}>
      {({ input, meta }) => {
        return (
          <>
            {isInitialLoading ? (
              <AppSpinner />
            ) : (
              <BehandlerRadioGruppe
                id={field}
                input={input}
                selectedBehandler={selectedBehandler}
                behandlere={behandlere}
                setSelectedBehandler={setSelectedBehandler}
                behandlerRadioGruppeTexts={behandlerRadioGruppeTexts}
                showNoBehandlerOption={false}
              />
            )}
            <SkjemaelementFeilmelding>
              {meta.submitFailed && meta.error}
            </SkjemaelementFeilmelding>
          </>
        );
      }}
    </Field>
  );
};
