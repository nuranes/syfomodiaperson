import { FlexRow, PaddingSize } from "@/components/Layout";
import React, { ReactElement, ReactNode } from "react";
import { CreateAktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Innholdstittel } from "nav-frontend-typografi";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { Form } from "react-final-form";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { ValidationErrors } from "final-form";
import styled from "styled-components";

export interface VurderAktivitetskravSkjemaProps {
  setModalOpen: (modalOpen: boolean) => void;
  aktivitetskravUuid: string | undefined;
}

interface Props<SkjemaValues> extends VurderAktivitetskravSkjemaProps {
  title: string;
  subtitle?: ReactElement;
  children?: ReactNode;

  toDto(values: SkjemaValues): CreateAktivitetskravVurderingDTO;

  validate?: (values: Partial<SkjemaValues>) => ValidationErrors;
}

const ChildrenContainer = styled.div`
  > * {
    padding-bottom: ${PaddingSize.SM};

    &:last-child {
      padding-bottom: ${PaddingSize.MD};
    }
  }
`;

export const VurderAktivitetskravSkjema = <SkjemaValues extends object>({
  title,
  subtitle,
  children,
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
          <ChildrenContainer>{children}</ChildrenContainer>
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
