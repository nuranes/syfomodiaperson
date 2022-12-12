import { FlexRow, PaddingSize } from "@/components/Layout";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
  vurderAktivitetskravBeskrivelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
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
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import {
  vurderAktivitetskravArsakFieldName,
  VurderAktivitetskravArsakRadioGruppe,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import { validerTekst } from "@/utils/valideringUtils";

const texts = {
  title: "Aktivitetskravet er oppfylt",
  missingArsak: "Vennligst angi årsak",
};

interface OppfyltAktivitetskravSkjemaValues {
  beskrivelse: string;
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
      beskrivelse: values.beskrivelse,
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
      [vurderAktivitetskravBeskrivelseFieldName]: validerTekst({
        value: values.beskrivelse || "",
        maxLength: vurderAktivitetskravBeskrivelseMaxLength,
      }),
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
            <VurderAktivitetskravBeskrivelse />
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
