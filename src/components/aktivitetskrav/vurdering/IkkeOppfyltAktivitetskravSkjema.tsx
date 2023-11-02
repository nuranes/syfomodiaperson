import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { Button } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
  title: "Ikke oppfylt",
  subtitle1:
    "Innstilling må skrives og sendes til NAY i Gosys. Ved å lagre fjerner du hendelsen fra oversikten.",
};

export const IkkeOppfyltAktivitetskravSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const submit = () => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.IKKE_OPPFYLT,
      arsaker: [],
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO);
  };

  return (
    <>
      <SkjemaHeading title={texts.title} subtitles={[texts.subtitle1]} />
      {vurderAktivitetskrav.isError && (
        <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
      )}
      <ButtonRow>
        <Button loading={vurderAktivitetskrav.isLoading} onClick={submit}>
          {texts.lagre}
        </Button>
      </ButtonRow>
    </>
  );
};
