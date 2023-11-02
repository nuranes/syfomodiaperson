import React, { useState } from "react";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Button } from "@navikt/ds-react";
import { HourglassTopFilledIcon, XMarkIcon } from "@navikt/aksel-icons";
import { ButtonRow } from "@/components/Layout";
import {
  ModalType,
  VurderAktivitetskravModal,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";

const texts = {
  avvent: "Avvent",
  ikkeAktuell: "Ikke aktuell",
};

interface StatusKnapperadProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
}

export const VurderAktivitetskravButtons = ({
  aktivitetskrav,
}: StatusKnapperadProps) => {
  const [visVurderAktivitetskravModal, setVisVurderAktivitetskravModal] =
    useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const visVurderingAktivitetskravModalForType = (modalType: ModalType) => {
    setModalType(modalType);
    setVisVurderAktivitetskravModal(true);
  };
  return (
    <>
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
      <VurderAktivitetskravModal
        isOpen={visVurderAktivitetskravModal}
        setModalOpen={setVisVurderAktivitetskravModal}
        modalType={modalType}
        aktivitetskravUuid={aktivitetskrav?.uuid}
      />
    </>
  );
};
