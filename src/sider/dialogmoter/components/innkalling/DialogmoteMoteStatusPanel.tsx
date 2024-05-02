import React, { ReactNode } from "react";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Link } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import dayjs from "dayjs";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { NoNarmesteLederAlert } from "@/sider/dialogmoter/components/innkalling/NoNarmestLederAlert";
import VurderOppgaveForDialogmotesvarKnapp from "@/sider/dialogmoter/components/innkalling/VurderOppgaveForDialogmotesvarKnapp";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import {
  isAktivtDialogmote,
  isPersonoppgaveCompletedAfterLastMoteEndring,
} from "@/utils/dialogmoteUtils";
import { BodyShort, Button } from "@navikt/ds-react";

const texts = {
  innkallingSendtTrackingContext: "Møtelandingsside: Sendt innkalling",
  headerInnkalling: "Innkallingen er sendt",
  headerEndring: "Endringen er sendt",
  headerMotedatoPassert: "Møtedato er passert",
  endreMote: "Endre møtet",
  avlysMote: "Avlys møtet",
  skrivReferat: "Skriv referat",
  fortsettReferat: "Fortsett på referatet",
  moteTid: "Møtetidspunkt",
  moteSted: "Sted",
};

const Subtitle = (dialogmote: DialogmoteDTO): ReactNode => {
  const moteDatoTid = tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid);

  return (
    <>
      <BodyShort size="small">{`${texts.moteTid}: ${moteDatoTid}`}</BodyShort>
      <BodyShort size="small">{`${texts.moteSted}: ${dialogmote.sted}`}</BodyShort>
    </>
  );
};

const headerText = (dialogmote: DialogmoteDTO): string => {
  const moteDatoTid = dayjs(dialogmote.tid);
  const today = dayjs(new Date());
  if (moteDatoTid.isBefore(today, "date")) {
    return texts.headerMotedatoPassert;
  }

  return dialogmote.status === DialogmoteStatus.NYTT_TID_STED
    ? texts.headerEndring
    : texts.headerInnkalling;
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteMoteStatusPanel = ({ dialogmote }: Props) => {
  const { arbeidsgiver } = dialogmote;
  const { currentLedere } = useLedereQuery();

  const virksomhetsnummer = arbeidsgiver.virksomhetsnummer;
  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    virksomhetsnummer
  );
  const noNarmesteLeder = !narmesteLeder;

  const { latestReferat } = useDialogmoteReferat(dialogmote);
  const referatKnappText = !!latestReferat
    ? texts.fortsettReferat
    : texts.skrivReferat;

  const { data: personOppgaver } = usePersonoppgaverQuery();
  const personOppgaveForMote = personOppgaver.find(
    (oppgave: PersonOppgave) => oppgave.referanseUuid === dialogmote.uuid
  );

  const skalVurderes =
    isAktivtDialogmote(dialogmote) &&
    !!personOppgaveForMote &&
    (personOppgaveForMote.behandletTidspunkt === null ||
      isPersonoppgaveCompletedAfterLastMoteEndring(
        personOppgaveForMote,
        dialogmote
      ));

  return (
    <DialogmotePanel
      icon={MoteIkonBlaaImage}
      subtitle={Subtitle(dialogmote)}
      header={headerText(dialogmote)}
    >
      {noNarmesteLeder && <NoNarmesteLederAlert />}
      <DeltakereSvarInfo dialogmote={dialogmote} />
      {skalVurderes && (
        <VurderOppgaveForDialogmotesvarKnapp
          personOppgave={personOppgaveForMote}
        />
      )}
      <div className="flex gap-6">
        <Button
          as={Link}
          to={`${dialogmoteRoutePath}/${dialogmote.uuid}/referat`}
          variant="primary"
        >
          {referatKnappText}
        </Button>
        <Button
          as={Link}
          to={`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`}
          variant="secondary"
        >
          {texts.endreMote}
        </Button>
        <Button
          as={Link}
          to={`${dialogmoteRoutePath}/${dialogmote.uuid}/avlys`}
          variant="secondary"
        >
          {texts.avlysMote}
        </Button>
      </div>
    </DialogmotePanel>
  );
};
