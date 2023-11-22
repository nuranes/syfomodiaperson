import React, { ReactElement } from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AvventAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";
import { IkkeAktuellAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeAktuellAktivitetskravSkjema";
import { Modal } from "@navikt/ds-react";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";

const texts = {
  modalContentLabel: "Vurder aktivitetskrav",
};

export type ModalType = `${Extract<
  AktivitetskravStatus,
  AktivitetskravStatus.AVVENT | AktivitetskravStatus.IKKE_AKTUELL
>}`;

interface VurderAktivitetskravModalProps
  extends VurderAktivitetskravSkjemaProps {
  isOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType | undefined;
}

export const VurderAktivitetskravModal = ({
  isOpen,
  setModalOpen,
  modalType,
  aktivitetskravUuid,
}: VurderAktivitetskravModalProps) => {
  return (
    <Modal
      closeOnBackdropClick
      onClose={() => setModalOpen(false)}
      open={isOpen}
      aria-labelledby={texts.modalContentLabel}
      header={{ heading: "" }}
    >
      {modalType && (
        <Modal.Body className={"min-w-[600px] p-8"}>
          <VurderAktivitetskravModalContent
            setModalOpen={setModalOpen}
            modalType={modalType}
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </Modal.Body>
      )}
    </Modal>
  );
};

interface VurderAktivitetskravModalContentProps
  extends Pick<
    VurderAktivitetskravModalProps,
    "setModalOpen" | "aktivitetskravUuid" | "modalType"
  > {
  modalType: ModalType;
}

const VurderAktivitetskravModalContent = ({
  modalType,
  ...rest
}: VurderAktivitetskravModalContentProps): ReactElement => {
  switch (modalType) {
    case "AVVENT": {
      return <AvventAktivitetskravSkjema {...rest} />;
    }
    case "IKKE_AKTUELL": {
      return <IkkeAktuellAktivitetskravSkjema {...rest} />;
    }
  }
};
