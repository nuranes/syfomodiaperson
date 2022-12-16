import ModalWrapper from "nav-frontend-modal";
import React from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import styled from "styled-components";
import { UnntakAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { AvventAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";

const texts = {
  modalContentLabel: "Vurder aktivitetskrav",
};

export type ModalType = `${
  | AktivitetskravStatus.AVVENT
  | AktivitetskravStatus.UNNTAK
  | AktivitetskravStatus.OPPFYLT}`;

interface VurderAktivitetskravModalProps {
  isOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType | undefined;
  aktivitetskravUuid: string;
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
  aktivitetskravUuid: string;
}

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  min-width: 600px;
`;

const VurderAktivitetskravModalContent = ({
  setModalOpen,
  modalType,
  aktivitetskravUuid,
}: VurderAktivitetskravModalContentProps) => {
  switch (modalType) {
    case "OPPFYLT": {
      return (
        <OppfyltAktivitetskravSkjema
          setModalOpen={setModalOpen}
          aktivitetskravUuid={aktivitetskravUuid}
        />
      );
    }
    case "UNNTAK": {
      return (
        <UnntakAktivitetskravSkjema
          setModalOpen={setModalOpen}
          aktivitetskravUuid={aktivitetskravUuid}
        />
      );
    }
    case "AVVENT": {
      return (
        <AvventAktivitetskravSkjema
          setModalOpen={setModalOpen}
          aktivitetskravUuid={aktivitetskravUuid}
        />
      );
    }
    default: {
      return <></>;
    }
  }
};
