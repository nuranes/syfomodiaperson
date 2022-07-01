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

export const texts = {
  bekreftetMote: "Bekreftet møte",
  seMotestatus: "Se møtestatus",
  planleggNyttMote: "Planlegg nytt dialogmøte",
  kandidatDialogmote: "Kandidat til dialogmøte",
  ingenMoterPlanlagt: "Ingen møter planlagt",
  dialogMote: "Dialogmøte",
  moteforesporselSendt: "Møteforespørsel sendt",
  arenaDialogmoteInnkalling:
    "Dialogmøter med denne innbyggeren må fortsatt kalles inn via Arena.",
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
        <FlexRow columnGap={FlexGapSize.MD}>
          <NyttDialogMote />
          {isKandidat && <DialogmoteunntakSkjemaLenke />}
        </FlexRow>
      </DialogmotePanel>
    );
  }
};
