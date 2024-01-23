import React, { ReactElement } from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { DialogmotePanel } from "@/sider/mote/components/DialogmotePanel";
import { BlueDocumentImage } from "../../../../img/ImageComponents";
import dayjs from "dayjs";
import {
  tilDatoMedManedNavnOgKlokkeslett,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
  tilLesbarDatoMedArstall,
} from "@/utils/datoUtils";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { Link } from "react-router-dom";
import { Button } from "@navikt/ds-react";

interface FerdigstilteReferatListProps {
  mote: DialogmoteDTO;
}

const FerdigstilteReferatList = ({ mote }: FerdigstilteReferatListProps) => {
  const { ferdigstilteReferat } = useDialogmoteReferat(mote);
  return (
    <ul>
      {ferdigstilteReferat.map((referat, index) => {
        const referatTekst = referat.endring ? "Endret referat" : "Referat";
        return (
          <li key={index}>
            {`${referatTekst}, sendt ${tilLesbarDatoMedArstall(
              referat.updatedAt
            )}`}
          </li>
        );
      })}
    </ul>
  );
};

interface EndreReferatPanelProps {
  mote: DialogmoteDTO;
}

const EndreReferatPanel = ({ mote }: EndreReferatPanelProps): ReactElement => {
  const endreReferatFrist = getEndreReferatFrist(mote);
  const { latestReferat } = useDialogmoteReferat(mote);
  return (
    <>
      <FerdigstilteReferatList mote={mote} />
      {`${texts.sisteFrist} ${tilDatoMedManedNavnOgKlokkeslett(
        endreReferatFrist
      )}`}
      <Button
        className="mt-8 w-fit"
        variant={latestReferat.ferdigstilt ? "secondary" : "primary"}
        as={Link}
        to={`${dialogmoteRoutePath}/${mote.uuid}/referat/endre`}
      >
        {latestReferat.ferdigstilt ? texts.buttonEndre : texts.buttonFullfor}
      </Button>
    </>
  );
};

const texts = {
  header: "Referatet er sendt",
  sisteFrist: "Siste frist for å sende ut en endring av dette referatet er",
  buttonEndre: "Endre referatet",
  buttonFullfor: "Fullfør endringen",
};

const ENDRE_REFERAT_FRIST_DAYS = 30;

const getEndreReferatFrist = (mote: DialogmoteDTO): Date =>
  dayjs(mote.tid).add(ENDRE_REFERAT_FRIST_DAYS, "days").toDate();

const kanEndreReferat =
  () =>
  (mote: DialogmoteDTO): boolean => {
    const endreReferatFrist = getEndreReferatFrist(mote);
    const now = dayjs();
    return now.isBefore(endreReferatFrist);
  };

interface DialogmoteReferatPanelProps {
  ferdigstilteMoter: DialogmoteDTO[];
}

export const DialogmoteFerdigstilteReferatPanel = ({
  ferdigstilteMoter,
}: DialogmoteReferatPanelProps): ReactElement => (
  <>
    {ferdigstilteMoter.filter(kanEndreReferat()).map((mote, index) => {
      const moteDatoTid = tilDatoMedUkedagOgManedNavnOgKlokkeslett(mote.tid);
      const subtitle = `Møtetidspunkt: ${moteDatoTid} - ${mote.sted}`;
      return (
        <DialogmotePanel
          key={index}
          icon={BlueDocumentImage}
          header={texts.header}
          subtitle={subtitle}
        >
          <EndreReferatPanel key={index} mote={mote} />
        </DialogmotePanel>
      );
    })}
  </>
);
