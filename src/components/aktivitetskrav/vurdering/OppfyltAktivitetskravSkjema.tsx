import { FlexRow, PaddingSize } from "@/components/Layout";
import { VurderAktivitetskravBegrunnelse } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBegrunnelse";
import React from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Innholdstittel } from "nav-frontend-typografi";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { SkjemaFeiloppsummering } from "@/components/SkjemaFeiloppsummering";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { Form } from "react-final-form";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";

const texts = {
  title: "Aktivitetskravet er oppfylt",
};

interface OppfyltAktivitetskravSkjemaValues {
  begrunnelse: string;
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
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.OPPFYLT,
      beskrivelse: values.begrunnelse,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  const validate = () => {
    const feil = {};
    updateFeilUtbedret(feil);

    return feil;
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit, submitFailed, errors }) => (
        <form onSubmit={handleSubmit}>
          <FlexRow bottomPadding={PaddingSize.LG}>
            <Innholdstittel>{texts.title}</Innholdstittel>
          </FlexRow>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <VurderAktivitetskravBegrunnelse />
          </FlexRow>
          {vurderAktivitetskrav.isError && (
            <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
          )}
          {submitFailed && harIkkeUtbedretFeil && (
            <SkjemaFeiloppsummering errors={errors} />
          )}
          <VurderAktivitetskravSkjemaButtons
            onLagreClick={resetFeilUtbedret}
            onAvbrytClick={() => setModalOpen(false)}
            showLagreSpinner={vurderAktivitetskrav.isLoading}
          />
        </form>
      )}
    </Form>
  );
};
