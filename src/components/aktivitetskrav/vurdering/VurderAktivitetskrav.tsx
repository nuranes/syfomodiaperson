import React, { useState } from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import { FlexRow, PaddingSize } from "@/components/Layout";
import {
  ModalType,
  VurderAktivitetskravModal,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
}: VurderAktivitetskravProps) => {
  const [visVurderAktivitetskravModal, setVisVurderAktivitetskravModal] =
    useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const visVurderingAktivitetskravModalForType = (modalType: ModalType) => {
    setModalType(modalType);
    setVisVurderAktivitetskravModal(true);
  };

  return (
    <AktivitetskravPanel>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <Innholdstittel>{texts.header}</Innholdstittel>
      </FlexRow>
      <VurderAktivitetskravButtons
        onButtonClick={visVurderingAktivitetskravModalForType}
      />
      <VurderAktivitetskravModal
        isOpen={visVurderAktivitetskravModal}
        setModalOpen={setVisVurderAktivitetskravModal}
        modalType={modalType}
        aktivitetskravUuid={aktivitetskrav.uuid}
      />
    </AktivitetskravPanel>
  );
};
