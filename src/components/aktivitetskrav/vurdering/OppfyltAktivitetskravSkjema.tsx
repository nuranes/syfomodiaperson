import { FlexRow, PaddingSize } from "@/components/Layout";
import { VurderAktivitetskravBegrunnelse } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBegrunnelse";
import React from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Innholdstittel } from "nav-frontend-typografi";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { Form } from "react-final-form";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  VurderAktivitetskravArsakRadioGruppe,
  vurderAktivitetskravArsakFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

const texts = {
  title: "Aktivitetskravet er oppfylt",
  missingArsak: "Vennligst angi årsak",
};

interface OppfyltAktivitetskravSkjemaValues {
  begrunnelse: string;
  arsak: OppfyltVurderingArsak;
}

interface OppfyltAktivitetskravSkjemaProps {
  setModalOpen: (modalOpen: boolean) => void;
  aktivitetskravUuid: string;
}

export const OppfyltAktivitetskravSkjema = ({
  setModalOpen,
  aktivitetskravUuid,
}: OppfyltAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.OPPFYLT,
      beskrivelse: values.begrunnelse,
      arsaker: [values.arsak],
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  const validate = (values: Partial<OppfyltAktivitetskravSkjemaValues>) => {
    return {
      [vurderAktivitetskravArsakFieldName]: !values.arsak
        ? texts.missingArsak
        : undefined,
    };
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <Innholdstittel>{texts.title}</Innholdstittel>
          </FlexRow>
          <FlexRow bottomPadding={PaddingSize.SM}>
            <VurderAktivitetskravArsakRadioGruppe
              arsakTexts={oppfyltVurderingArsakTexts}
            />
          </FlexRow>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <VurderAktivitetskravBegrunnelse />
          </FlexRow>
          {vurderAktivitetskrav.isError && (
            <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
          )}
          <VurderAktivitetskravSkjemaButtons
            onAvbrytClick={() => setModalOpen(false)}
            showLagreSpinner={vurderAktivitetskrav.isLoading}
          />
        </form>
      )}
    </Form>
  );
};
