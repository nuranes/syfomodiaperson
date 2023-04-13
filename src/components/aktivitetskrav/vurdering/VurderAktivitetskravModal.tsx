import ModalWrapper from "nav-frontend-modal";
import React, { ReactElement } from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import styled from "styled-components";
import { UnntakAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { AvventAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";
import { IkkeOppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeOppfyltAktivitetskravSkjema";
import { IkkeAktuellAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeAktuellAktivitetskravSkjema";

const texts = {
  modalContentLabel: "Vurder aktivitetskrav",
};

export type ModalType = `${
  | AktivitetskravStatus.AVVENT
  | AktivitetskravStatus.UNNTAK
  | AktivitetskravStatus.OPPFYLT
  | AktivitetskravStatus.IKKE_AKTUELL
  | AktivitetskravStatus.IKKE_OPPFYLT}`;

interface VurderAktivitetskravModalProps {
  isOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType | undefined;
  aktivitetskravUuid: string | undefined;
}

export const VurderAktivitetskravModal = ({
  isOpen,
  setModalOpen,
  modalType,
  aktivitetskravUuid,
}: VurderAktivitetskravModalProps) => {
  return (
    <ModalWrapper
      onRequestClose={() => setModalOpen(false)}
      isOpen={isOpen}
      contentLabel={texts.modalContentLabel}
      ariaHideApp={false}
    >
      {modalType && (
        <ModalContent>
          <VurderAktivitetskravModalContent
            setModalOpen={setModalOpen}
            modalType={modalType}
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </ModalContent>
      )}
    </ModalWrapper>
  );
};

interface VurderAktivitetskravModalContentProps {
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType;
  aktivitetskravUuid: string | undefined;
}

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  min-width: 600px;
`;

const VurderAktivitetskravModalContent = ({
  modalType,
  ...rest
}: VurderAktivitetskravModalContentProps): ReactElement => {
  switch (modalType) {
    case "OPPFYLT": {
      return <OppfyltAktivitetskravSkjema {...rest} />;
    }
    case "UNNTAK": {
      return <UnntakAktivitetskravSkjema {...rest} />;
    }
    case "AVVENT": {
      return <AvventAktivitetskravSkjema {...rest} />;
    }
    case "IKKE_OPPFYLT": {
      return <IkkeOppfyltAktivitetskravSkjema {...rest} />;
    }
    case "IKKE_AKTUELL": {
      return <IkkeAktuellAktivitetskravSkjema {...rest} />;
    }
  }
};
