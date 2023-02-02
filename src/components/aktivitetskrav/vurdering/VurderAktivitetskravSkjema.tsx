import { FlexRow, PaddingSize } from "@/components/Layout";
import React, { ReactElement } from "react";
import { CreateAktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Innholdstittel } from "nav-frontend-typografi";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { Form } from "react-final-form";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { ValidationErrors } from "final-form";

export interface VurderAktivitetskravSkjemaProps {
  setModalOpen: (modalOpen: boolean) => void;
  aktivitetskravUuid: string | undefined;
}

interface Props<SkjemaValues> extends VurderAktivitetskravSkjemaProps {
  title: string;
  subtitle?: ReactElement;
  beskrivelse?: ReactElement;
  arsakVelger?: ReactElement;

  toDto(values: SkjemaValues): CreateAktivitetskravVurderingDTO;

  validate?: (values: Partial<SkjemaValues>) => ValidationErrors;
}

export const VurderAktivitetskravSkjema = <SkjemaValues extends object>({
  title,
  subtitle,
  beskrivelse,
  arsakVelger,
  setModalOpen,
  aktivitetskravUuid,
  toDto,
  validate,
}: Props<SkjemaValues>) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);

  const submit = (values: SkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO =
      toDto(values);
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <Innholdstittel>{title}</Innholdstittel>
          </FlexRow>
          {subtitle && (
            <FlexRow bottomPadding={PaddingSize.MD}>{subtitle}</FlexRow>
          )}
          <FlexRow bottomPadding={PaddingSize.SM}>{arsakVelger}</FlexRow>
          {beskrivelse && (
            <FlexRow bottomPadding={PaddingSize.MD}>{beskrivelse}</FlexRow>
          )}
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
