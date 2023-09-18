import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import React, { ReactNode } from "react";
import { CreateAktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import { Form } from "react-final-form";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { ValidationErrors } from "final-form";
import styled from "styled-components";
import { BodyShort, Heading } from "@navikt/ds-react";

export interface VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
  aktivitetskravUuid: string | undefined;
}

interface Props<SkjemaValues> extends VurderAktivitetskravSkjemaProps {
  title: string;
  subtitles?: string[];
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
  subtitles,
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
            <Heading level="2" size="large">
              {title}
            </Heading>
          </FlexRow>
          {subtitles && (
            <FlexRow bottomPadding={PaddingSize.MD}>
              <FlexColumn>
                {subtitles.map((subtitle, index) => (
                  <BodyShort key={index} size="small">
                    {subtitle}
                  </BodyShort>
                ))}
              </FlexColumn>
            </FlexRow>
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
