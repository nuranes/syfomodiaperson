import {
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";

export interface VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
  aktivitetskravUuid: string | undefined;
}

export interface AktivitetskravSkjemaValues {
  beskrivelse: string;
}

export interface AvventAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsaker: AvventVurderingArsak[];
  fristDato?: string;
}

export interface OppfyltAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: OppfyltVurderingArsak;
}

export interface UnntakAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: UnntakVurderingArsak;
}
