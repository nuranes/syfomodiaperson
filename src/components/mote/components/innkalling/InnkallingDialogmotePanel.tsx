import React, { ReactElement } from "react";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { NyttDialogMote } from "./NyttDialogMote";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import { DialogmoteMoteStatusPanel } from "./DialogmoteMoteStatusPanel";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { DialogmoteunntakSkjemaLenke } from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaLenke";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { ArbeidstakerHarIkkeAktivSykmeldingAdvarsel } from "@/components/dialogmote/ArbeidstakerHarIkkeAktivSykmelding";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

export const texts = {
  bekreftetMote: "Bekreftet møte",
  seMotestatus: "Se møtestatus",
  planleggNyttMote: "Planlegg nytt dialogmøte",
  kandidatDialogmote: "Kandidat til dialogmøte",
  ingenMoterPlanlagt: "Ingen møter planlagt",
  dialogMote: "Dialogmøte",
  moteforesporselSendt: "Møteforespørsel sendt",
};

const dialogmotePanelHeaderText = (isKandidat: boolean): string => {
  return isKandidat ? texts.kandidatDialogmote : texts.planleggNyttMote;
};

interface InnkallingDialogmotePanelProps {
  aktivtDialogmote: DialogmoteDTO | undefined;
}

export const InnkallingDialogmotePanel = ({
  aktivtDialogmote,
}: InnkallingDialogmotePanelProps): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  if (aktivtDialogmote) {
    return <DialogmoteMoteStatusPanel dialogmote={aktivtDialogmote} />;
  } else {
    return (
      <DialogmotePanel
        icon={MoteIkonBlaaImage}
        header={dialogmotePanelHeaderText(isKandidat)}
        subtitle={texts.ingenMoterPlanlagt}
      >
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {!hasActiveOppfolgingstilfelle && (
          <ArbeidstakerHarIkkeAktivSykmeldingAdvarsel />
        )}

        <FlexRow columnGap={FlexGapSize.MD}>
          <NyttDialogMote />
          {isKandidat && <DialogmoteunntakSkjemaLenke />}
        </FlexRow>
      </DialogmotePanel>
    );
  }
};
