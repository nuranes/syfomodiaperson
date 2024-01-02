import React, { ReactElement } from "react";
import { Field } from "react-final-form";
import AppSpinner from "@/components/AppSpinner";
import BehandlerRadioGruppe, {
  BehandlerRadioGruppeTexts,
} from "@/components/behandler/BehandlerRadioGruppe";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { SkjemaelementFeilmelding } from "nav-frontend-skjema";

export const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
};

const behandlerRadioGruppeTexts: BehandlerRadioGruppeTexts = {
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
  const { data: behandlere, isLoading } = useBehandlereQuery();
  const field = "behandlerRef";

  return (
    <Field<string> name={field}>
      {({ input, meta }) => {
        return (
          <>
            {isLoading ? (
              <AppSpinner />
            ) : (
              <BehandlerRadioGruppe
                id={field}
                input={input}
                selectedBehandler={selectedbehandler}
                behandlere={behandlere}
                setSelectedBehandler={setSelectedBehandler}
                behandlerRadioGruppeTexts={behandlerRadioGruppeTexts}
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

export default DialogmoteInnkallingBehandler;
