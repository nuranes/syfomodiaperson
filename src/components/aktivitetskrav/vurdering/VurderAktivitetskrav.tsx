import React, { useState } from "react";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import {
  ButtonRow,
  FlexColumn,
  FlexRow,
  JustifyContentType,
} from "@/components/Layout";
import {
  ModalType,
  VurderAktivitetskravModal,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { BodyShort, Button, Heading, HelpText, Panel } from "@navikt/ds-react";
import { HourglassTopFilledIcon, XMarkIcon } from "@navikt/aksel-icons";

export const texts = {
  header: "Vurdere aktivitetskravet",
  avvent: "Avvent",
  ikkeAktuell: "Ikke aktuell",
  helptext:
    "Vurderingen (Avvent, sett unntak, er i aktivitet, ikke oppfylt, ikke aktuell) gjøres i to trinn. Ved klikk legger du inn informasjon rundt vurderingen.",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
  oppfolgingstilfelle,
}: VurderAktivitetskravProps) => {
  const [visVurderAktivitetskravModal, setVisVurderAktivitetskravModal] =
    useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const visVurderingAktivitetskravModalForType = (modalType: ModalType) => {
    setModalType(modalType);
    setVisVurderAktivitetskravModal(true);
  };

  return (
    <Panel className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8">
      <ButtonRow className="ml-auto">
        {aktivitetskrav?.status !== AktivitetskravStatus.FORHANDSVARSEL && (
          <Button
            icon={<HourglassTopFilledIcon aria-hidden />}
            variant="secondary"
            size="small"
            onClick={() => visVurderingAktivitetskravModalForType("AVVENT")}
          >
            {texts.avvent}
          </Button>
        )}
        <Button
          icon={<XMarkIcon aria-hidden />}
          variant="secondary"
          size="small"
          onClick={() => visVurderingAktivitetskravModalForType("IKKE_AKTUELL")}
        >
          {texts.ikkeAktuell}
        </Button>
      </ButtonRow>
      <FlexRow>
        <Heading level="2" size="large">
          {texts.header}
        </Heading>
        <FlexColumn className="ml-2" justifyContent={JustifyContentType.CENTER}>
          <HelpText placement="right">
            <BodyShort size="small">{texts.helptext}</BodyShort>
          </HelpText>
        </FlexColumn>
      </FlexRow>
      {oppfolgingstilfelle && (
        <FlexRow>
          <BodyShort size="small">{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
            oppfolgingstilfelle.start,
            oppfolgingstilfelle.end
          )}`}</BodyShort>
        </FlexRow>
      )}
      <VurderAktivitetskravButtons
        onButtonClick={visVurderingAktivitetskravModalForType}
        aktivitetskrav={aktivitetskrav}
      />
      <VurderAktivitetskravModal
        isOpen={visVurderAktivitetskravModal}
        setModalOpen={setVisVurderAktivitetskravModal}
        modalType={modalType}
        aktivitetskravUuid={aktivitetskrav?.uuid}
      />
    </Panel>
  );
};
