import React, { useState } from "react";
import { Innholdstittel, Normaltekst } from "nav-frontend-typografi";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import { FlexRow } from "@/components/Layout";
import {
  ModalType,
  VurderAktivitetskravModal,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO;
  oppfolgingstilfelle: OppfolgingstilfelleDTO;
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
    <AktivitetskravPanel>
      <FlexRow>
        <Innholdstittel>{texts.header}</Innholdstittel>
      </FlexRow>
      <FlexRow>
        <Normaltekst>{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
          oppfolgingstilfelle.start,
          oppfolgingstilfelle.end
        )}`}</Normaltekst>
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
