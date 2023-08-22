import React, { useState } from "react";
import {
  MeldingDTO,
  ReturLegeerklaringDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import { MeldingActionButton } from "@/components/behandlerdialog/MeldingActionButton";
import styled from "styled-components";
import { Button, Modal, Textarea } from "@navikt/ds-react";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { CloseButton } from "@/components/CloseButton";
import { useReturLegeerklaring } from "@/data/behandlerdialog/useReturLegeerklaring";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { Field, Form } from "react-final-form";
import { validerTekst } from "@/utils/valideringUtils";

const texts = {
  button: "Vurder retur av legeerklæring",
  send: "Send retur",
  begrunnelseLabel: "Begrunnelse",
  missingBegrunnelse: "Vennligst angi begrunnelse",
};

const ModalContent = styled(Modal.Content)`
  padding: 2em;
`;

const StyledTextarea = styled(Textarea)`
  width: 80%;
  padding-top: 1em;
`;

const MAX_LENGTH_BERGUNNELSE = 1000;
const begrunnelseFieldName = "begrunnelse";

interface ReturLegeerklaringSkjemaValues {
  [begrunnelseFieldName]: string;
}
type ReturLegeerklaringSkjemaFeil = {
  [K in keyof ReturLegeerklaringSkjemaValues]: string | undefined;
};

interface ReturLegeerklaringProps {
  melding: MeldingDTO;
}

export const ReturLegeerklaring = ({ melding }: ReturLegeerklaringProps) => {
  const [visReturModal, setVisReturModal] = useState(false);
  const returLegeerklaring = useReturLegeerklaring(melding.uuid);
  const { getReturLegeerklaringDocument } = useMeldingTilBehandlerDocument();

  const validate = (
    values: Partial<ReturLegeerklaringSkjemaValues>
  ): ReturLegeerklaringSkjemaFeil => {
    return {
      [begrunnelseFieldName]: validerTekst({
        maxLength: MAX_LENGTH_BERGUNNELSE,
        value: values.begrunnelse || "",
        missingRequiredMessage: texts.missingBegrunnelse,
      }),
    };
  };

  const submit = (values: ReturLegeerklaringSkjemaValues) => {
    const returLegeerklaringDTO: ReturLegeerklaringDTO = {
      document: getReturLegeerklaringDocument(values.begrunnelse),
      tekst: values.begrunnelse,
    };
    returLegeerklaring.mutate(returLegeerklaringDTO, {
      onSuccess: () => setVisReturModal(false),
    });
  };

  const handleClose = () => setVisReturModal(false);

  return (
    <>
      <MeldingActionButton
        icon={<ArrowUndoIcon aria-hidden />}
        onClick={() => {
          setVisReturModal(true);
          returLegeerklaring.reset();
        }}
      >
        {texts.button}
      </MeldingActionButton>
      <Modal
        open={visReturModal}
        onClose={handleClose}
        aria-labelledby="modal-heading"
      >
        <Form<ReturLegeerklaringSkjemaValues>
          onSubmit={submit}
          validate={validate}
        >
          {({ handleSubmit, values }) => (
            <ModalContent>
              <form onSubmit={handleSubmit}>
                {getReturLegeerklaringDocument(values.begrunnelse).map(
                  (component, index) => (
                    <DocumentComponentVisning
                      documentComponent={component}
                      key={index}
                    />
                  )
                )}
                {returLegeerklaring.isError && (
                  <SkjemaInnsendingFeil error={returLegeerklaring.error} />
                )}
                <Field<string> name={begrunnelseFieldName}>
                  {({ input, meta }) => (
                    <StyledTextarea
                      size="small"
                      label={texts.begrunnelseLabel}
                      maxLength={MAX_LENGTH_BERGUNNELSE}
                      error={meta.submitFailed && meta.error}
                      id={begrunnelseFieldName}
                      minRows={4}
                      {...input}
                    />
                  )}
                </Field>
                <ButtonRow
                  topPadding={PaddingSize.MD}
                  bottomPadding={PaddingSize.SM}
                >
                  <Button type="submit" loading={returLegeerklaring.isLoading}>
                    {texts.send}
                  </Button>
                  <CloseButton
                    onClick={handleClose}
                    disabled={returLegeerklaring.isLoading}
                  />
                </ButtonRow>
              </form>
            </ModalContent>
          )}
        </Form>
      </Modal>
    </>
  );
};
