import React from "react";
import {
  AktivitetskravStatus,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { Form } from "react-final-form";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Alert, Heading, Label, Panel } from "@navikt/ds-react";
import { VurderAktivitetskravSkjemaButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjemaButtons";
import styled from "styled-components";
import { useSendForhandsvarsel } from "@/data/aktivitetskrav/useSendForhandsvarsel";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Beskrivelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  warning:
    "Husk å utrede saken tilstrekkelig før du sender forhåndsvarsel om stans av sykepengene.",
};

const VarselbrevContent = styled.div`
  > * {
    margin-bottom: ${PaddingSize.SM};

    &:last-child {
      margin-bottom: ${PaddingSize.MD};
    }
  }
`;

const StyledForm = styled.form`
  max-width: 50em;
`;
export const getFristForForhandsvarsel = (isFysiskUtsending = true) => {
  return isFysiskUtsending ? addWeeks(new Date(), 3) : addWeeks(new Date(), 2);
};

interface SendForhandsvarselSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
}

export const SendForhandsvarselSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const sendForhandsvarsel = useSendForhandsvarsel(props.aktivitetskravUuid);
  const { validateBeskrivelseField } = useAktivitetskravVurderingSkjema(
    AktivitetskravStatus.FORHANDSVARSEL
  );
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();
  const frist = getFristForForhandsvarsel();

  const validate = (values: Partial<SendForhandsvarselSkjemaValues>) => ({
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  const submit = (values: SendForhandsvarselSkjemaValues) => {
    const forhandsvarselDTO: SendForhandsvarselDTO = {
      fritekst: values.beskrivelse,
      document: getForhandsvarselDocument(values.beskrivelse, frist),
    };
    if (props.aktivitetskravUuid) {
      sendForhandsvarsel.mutate(forhandsvarselDTO, {
        onSuccess: () => props.setModalOpen(false),
      });
    }
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit, values }) => (
        <StyledForm onSubmit={handleSubmit}>
          <FlexRow bottomPadding={PaddingSize.MD}>
            <Heading level="2" size="large">
              {texts.title}
            </Heading>
          </FlexRow>
          <VarselbrevContent>
            <Alert variant={"warning"}>{texts.warning}</Alert>
            <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
            <Label size="small">{texts.forhandsvisning}</Label>
            <Panel border>
              {getForhandsvarselDocument(values.beskrivelse, frist).map(
                (component, index) => (
                  <DocumentComponentVisning
                    documentComponent={component}
                    key={index}
                  />
                )
              )}
            </Panel>
          </VarselbrevContent>
          {sendForhandsvarsel.isError && (
            <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
          )}
          <VurderAktivitetskravSkjemaButtons
            onAvbrytClick={() => props.setModalOpen(false)}
            showLagreSpinner={sendForhandsvarsel.isLoading}
          />
        </StyledForm>
      )}
    </Form>
  );
};
