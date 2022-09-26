import React, { ReactElement } from "react";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import DialogmoteInnkallingSkjemaSeksjon from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjemaSeksjon";
import AppSpinner from "@/components/AppSpinner";
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
      ) : (
        <BehandlerRadioGruppe
          behandlere={behandlere}
          setSelectedBehandler={setSelectedBehandler}
        />
      )}
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingBehandler;
