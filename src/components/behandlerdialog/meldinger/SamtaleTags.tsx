import { Tag } from "@navikt/ds-react";
import React, { ComponentProps } from "react";
import styled from "styled-components";
import {
  MeldingDTO,
  MeldingStatusType,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { PaminnelseWarningIcon } from "@/components/behandlerdialog/paminnelse/PaminnelseWarningIcon";

const texts = {
  ny: "Ny",
  manglerSvar: "Venter på svar",
  avvist: "Melding ikke levert",
  paminnelseSendt: "Påminnelse sendt",
  vurderPaminnelse: "Vurder påminnelse",
};

const StyledWrapper = styled.div`
  display: flex;
  margin-left: 1em;
`;

interface SamtaleTagsProps {
  meldinger: MeldingDTO[];
}

const SamtaleTag = (props: ComponentProps<typeof Tag>) => (
  <StyledWrapper>
    <Tag {...props} size="small">
      {props.children}
    </Tag>
  </StyledWrapper>
);

type SamtaleTagStatus =
  | "NY"
  | "AVVIST"
  | "PAMINNELSE_SENDT"
  | "VURDER_PAMINNELSE"
  | "UBESVART"
  | "INGEN";

const getSamtaleTagStatus = (
  meldinger: MeldingDTO[],
  oppgaver: PersonOppgave[]
): SamtaleTagStatus => {
  const ubehandledeBehandlerDialogSvarOppgaver =
    getAllUbehandledePersonOppgaver(
      oppgaver,
      PersonOppgaveType.BEHANDLERDIALOG_SVAR
    );
  const hasMeldingMedUbehandletSvarOppgave = meldinger.some((melding) =>
    ubehandledeBehandlerDialogSvarOppgaver.some(
      (oppgave) => oppgave.referanseUuid === melding.uuid
    )
  );
  const ubehandledePaminnelseOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  );
  const hasMeldingMedUbehandletPaminnelseOppgave = meldinger.some((melding) =>
    ubehandledePaminnelseOppgaver.some(
      (oppgave) => oppgave.referanseUuid === melding.uuid
    )
  );
  const harAvvistMelding = meldinger.some(
    (melding) => melding.status?.type === MeldingStatusType.AVVIST
  );
  const manglerSvarFraBehandler = !meldinger.some(
    (melding) => melding.innkommende
  );
  const harPaminnelseMelding = meldinger.some(
    (melding) => melding.type === MeldingType.FORESPORSEL_PASIENT_PAMINNELSE
  );

  if (harAvvistMelding) {
    return "AVVIST";
  } else if (hasMeldingMedUbehandletSvarOppgave) {
    return "NY";
  } else if (hasMeldingMedUbehandletPaminnelseOppgave) {
    return "VURDER_PAMINNELSE";
  } else if (manglerSvarFraBehandler) {
    return harPaminnelseMelding ? "PAMINNELSE_SENDT" : "UBESVART";
  } else {
    return "INGEN";
  }
};

export const SamtaleTags = ({ meldinger }: SamtaleTagsProps) => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const samtaleTagStatus = getSamtaleTagStatus(meldinger, oppgaver);

  switch (samtaleTagStatus) {
    case "NY": {
      return <SamtaleTag variant="info">{texts.ny}</SamtaleTag>;
    }
    case "AVVIST": {
      return <SamtaleTag variant="error">{texts.avvist}</SamtaleTag>;
    }
    case "VURDER_PAMINNELSE": {
      return <SamtaleTag variant={"info"}>{texts.vurderPaminnelse}</SamtaleTag>;
    }
    case "PAMINNELSE_SENDT": {
      return (
        <SamtaleTag variant="warning">
          <PaminnelseWarningIcon />
          {texts.paminnelseSendt}
        </SamtaleTag>
      );
    }
    case "UBESVART": {
      return <SamtaleTag variant="warning">{texts.manglerSvar}</SamtaleTag>;
    }
    case "INGEN": {
      return <></>;
    }
  }
};
