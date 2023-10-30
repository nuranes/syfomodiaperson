export interface VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
  aktivitetskravUuid: string | undefined;
}

export interface AktivitetskravSkjemaValues {
  beskrivelse: string;
}
