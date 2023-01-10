import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import React, { ReactNode } from "react";
import { FlexRow, PaddingSize } from "../../../Layout";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Link } from "react-router-dom";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Normaltekst } from "nav-frontend-typografi";
import { DeltakereSvarInfo } from "@/components/dialogmote/DeltakereSvarInfo";
import dayjs from "dayjs";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { NoNarmesteLederAlert } from "@/components/mote/NoNarmestLederAlert";
import Knapp, { Hovedknapp } from "nav-frontend-knapper";
import VurderOppgaveForDialogmotesvarKnapp from "@/components/mote/components/innkalling/VurderOppgaveForDialogmotesvarKnapp";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import {
  isAktivtDialogmote,
  oppgaveCreatedAfterLatestMoteEndring,
} from "@/utils/dialogmoteUtils";

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
      <Normaltekst>{`${texts.moteTid}: ${moteDatoTid}`}</Normaltekst>
      <Normaltekst>{`${texts.moteSted}: ${dialogmote.sted}`}</Normaltekst>
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
    oppgaveCreatedAfterLatestMoteEndring(personOppgaveForMote, dialogmote);

  return (
    <DialogmotePanel
      icon={MoteIkonBlaaImage}
      subtitle={Subtitle(dialogmote)}
      header={headerText(dialogmote)}
    >
      {noNarmesteLeder && (
        <FlexRow bottomPadding={PaddingSize.MD}>
          <NoNarmesteLederAlert />
        </FlexRow>
      )}

      <FlexRow>
        <DeltakereSvarInfo dialogmote={dialogmote} />
      </FlexRow>

      {skalVurderes && (
        <FlexRow topPadding={PaddingSize.MD}>
          <VurderOppgaveForDialogmotesvarKnapp
            personOppgave={personOppgaveForMote}
          />
        </FlexRow>
      )}

      <FlexRow topPadding={PaddingSize.MD}>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`}>
          <Knapp data-cy="endreMoteKnapp">{texts.endreMote}</Knapp>
        </Link>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/avlys`}>
          <Knapp data-cy="avlysMoteKnapp">{texts.avlysMote}</Knapp>
        </Link>
        <Link to={`${dialogmoteRoutePath}/${dialogmote.uuid}/referat`}>
          <Hovedknapp data-cy="skrivReferatKnapp">
            {referatKnappText}
          </Hovedknapp>
        </Link>
      </FlexRow>
    </DialogmotePanel>
  );
};
