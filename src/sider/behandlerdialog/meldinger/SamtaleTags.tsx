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
import { PaminnelseWarningIcon } from "@/sider/behandlerdialog/paminnelse/PaminnelseWarningIcon";
import { ReturLegeerklaringWarningIcon } from "@/sider/behandlerdialog/legeerklaring/ReturLegeerklaringWarningIcon";
import {
  antallOfType,
  hasMeldingOfType,
} from "../../../../test/utils/behandlerdialogUtils";

const texts = {
  nyMelding: "Ny melding",
  venterSvar: "Venter på svar",
  avvist: "Melding ikke levert",
  paminnelseSendt: "Påminnelse sendt",
  returSendt: "Retur sendt",
  vurderPaminnelse: "Vurder påminnelse",
};

const StyledWrapper = styled.div`
  display: flex;
  margin-left: 1em;
`;

const StyledTag = styled(Tag)`
  gap: 0.2em;
`;

interface SamtaleTagsProps {
  meldinger: MeldingDTO[];
}

const SamtaleTag = (props: ComponentProps<typeof Tag>) => (
  <StyledWrapper>
    <StyledTag {...props} size="small">
      {props.children}
    </StyledTag>
  </StyledWrapper>
);

type SamtaleTagStatus =
  | "NY_MELDING"
  | "AVVIST"
  | "PAMINNELSE_SENDT"
  | "RETUR_SENDT"
  | "VURDER_PAMINNELSE"
  | "VENTER_SVAR"
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
  const harMeldingMedUbehandletSvarOppgave = meldinger.some((melding) =>
    ubehandledeBehandlerDialogSvarOppgaver.some(
      (oppgave) => oppgave.referanseUuid === melding.uuid
    )
  );
  const ubehandledePaminnelseOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  );
  const harMeldingMedUbehandletPaminnelseOppgave = meldinger.some((melding) =>
    ubehandledePaminnelseOppgaver.some(
      (oppgave) => oppgave.referanseUuid === melding.uuid
    )
  );
  const harIngenMeldingMedPaminnelseOppgave = !meldinger.some((melding) =>
    oppgaver.some(
      (oppgave) =>
        oppgave.type === PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART &&
        oppgave.referanseUuid === melding.uuid
    )
  );

  const innkommende = meldinger.filter((melding) => melding.innkommende);
  const antallReturLegeerklaring = antallOfType(
    meldinger,
    MeldingType.HENVENDELSE_RETUR_LEGEERKLARING
  );
  const antallInnkommendeLegeerklaringer = antallOfType(
    innkommende,
    MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING
  );

  const harReturLegeerklaringMelding = antallReturLegeerklaring > 0;
  const manglerSvarPaaRetur =
    harReturLegeerklaringMelding &&
    antallReturLegeerklaring >= antallInnkommendeLegeerklaringer;
  const manglerSvarFraBehandler =
    innkommende.length === 0 || manglerSvarPaaRetur;
  const utgaendeMeldingForventerSvar = meldinger.some(
    (melding) =>
      !melding.innkommende &&
      melding.type !== MeldingType.HENVENDELSE_MELDING_FRA_NAV
  );
  const harPaminnelseMelding = hasMeldingOfType(
    meldinger,
    MeldingType.FORESPORSEL_PASIENT_PAMINNELSE
  );
  const harAvvistMelding = meldinger.some(
    (melding) => melding.status?.type === MeldingStatusType.AVVIST
  );

  if (harAvvistMelding) {
    return "AVVIST";
  } else if (harMeldingMedUbehandletSvarOppgave) {
    return "NY_MELDING";
  } else if (harMeldingMedUbehandletPaminnelseOppgave) {
    return "VURDER_PAMINNELSE";
  } else if (manglerSvarFraBehandler && harPaminnelseMelding) {
    return "PAMINNELSE_SENDT";
  } else if (manglerSvarPaaRetur && harReturLegeerklaringMelding) {
    return "RETUR_SENDT";
  } else if (
    manglerSvarFraBehandler &&
    harIngenMeldingMedPaminnelseOppgave &&
    utgaendeMeldingForventerSvar
  ) {
    return "VENTER_SVAR";
  } else {
    return "INGEN";
  }
};

export const SamtaleTags = ({
  meldinger,
}: SamtaleTagsProps): React.ReactElement | null => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const samtaleTagStatus = getSamtaleTagStatus(meldinger, oppgaver);

  switch (samtaleTagStatus) {
    case "NY_MELDING": {
      return <SamtaleTag variant="info">{texts.nyMelding}</SamtaleTag>;
    }
    case "AVVIST": {
      return <SamtaleTag variant="error">{texts.avvist}</SamtaleTag>;
    }
    case "VURDER_PAMINNELSE": {
      return <SamtaleTag variant="info">{texts.vurderPaminnelse}</SamtaleTag>;
    }
    case "PAMINNELSE_SENDT": {
      return (
        <SamtaleTag variant="warning">
          <PaminnelseWarningIcon />
          {texts.paminnelseSendt}
        </SamtaleTag>
      );
    }
    case "RETUR_SENDT": {
      return (
        <SamtaleTag variant="warning">
          <ReturLegeerklaringWarningIcon />
          {texts.returSendt}
        </SamtaleTag>
      );
    }
    case "VENTER_SVAR": {
      return <SamtaleTag variant="warning">{texts.venterSvar}</SamtaleTag>;
    }
    case "INGEN": {
      return null;
    }
  }
};
