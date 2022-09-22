import React, { ReactElement } from "react";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import DialogmoteInnkallingSkjemaSeksjon from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjemaSeksjon";
import AppSpinner from "@/components/AppSpinner";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import BehandlerRadioGruppe from "@/components/dialogmote/innkalling/BehandlerRadioGruppe";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";

const BehandlerTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

export const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
  // TODO: Fjerne denne når vi skur på behandlersøk
  noBehandlerFound:
    "Det er ikke registrert noen behandler som bruker dialogmelding.",
};

interface DialogmoteInnkallingBehandlerProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
}

const DialogmoteInnkallingBehandler = ({
  setSelectedBehandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  const { data: behandlere, isLoading } = useBehandlereQuery();

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <BehandlerTittel>{texts.title}</BehandlerTittel>
      {isLoading ? (
        <AppSpinner />
      ) : behandlere.length > 0 ? (
        <BehandlerRadioGruppe
          behandlere={behandlere}
          setSelectedBehandler={setSelectedBehandler}
        />
      ) : (
        <AlertstripeFullbredde type="advarsel">
          {texts.noBehandlerFound}
        </AlertstripeFullbredde>
      )}
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingBehandler;
