import React, { useState } from "react";
import {
  MeldingDTO,
  ReturLegeerklaringDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import { MeldingActionButton } from "@/components/behandlerdialog/MeldingActionButton";
import { Button, Modal, Textarea } from "@navikt/ds-react";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";
import { CloseButton } from "@/components/CloseButton";
import { useReturLegeerklaring } from "@/data/behandlerdialog/useReturLegeerklaring";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { useForm } from "react-hook-form";
import { DocumentComponentHeaderH1 } from "@/components/document/DocumentComponentHeaderH1";

const texts = {
  button: "Vurder retur av legeerklæring",
  send: "Send retur",
  begrunnelseLabel: "Begrunnelse",
  missingBegrunnelse: "Vennligst angi begrunnelse",
};

const MAX_LENGTH_BERGUNNELSE = 1000;

interface ReturLegeerklaringSkjemaValues {
  begrunnelse: string;
}

interface ReturLegeerklaringProps {
  melding: MeldingDTO;
}

export const ReturLegeerklaring = ({ melding }: ReturLegeerklaringProps) => {
  const [visReturModal, setVisReturModal] = useState(false);
  const returLegeerklaring = useReturLegeerklaring(melding.uuid);
  const { getReturLegeerklaringDocument } = useMeldingTilBehandlerDocument();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ReturLegeerklaringSkjemaValues>();

  const { documentHeader, documentBody, document } =
    getReturLegeerklaringDocument(watch("begrunnelse"));

  const submit = (values: ReturLegeerklaringSkjemaValues) => {
    const returLegeerklaringDTO: ReturLegeerklaringDTO = {
      document,
      tekst: values.begrunnelse,
    };
    returLegeerklaring.mutate(returLegeerklaringDTO, {
      onSuccess: () => setVisReturModal(false),
    });
  };

  const handleClose = () => {
    setVisReturModal(false);
    reset();
  };

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
      <form onSubmit={handleSubmit(submit)}>
        <Modal
          closeOnBackdropClick
          open={visReturModal}
          onClose={handleClose}
          aria-labelledby="modal-heading"
        >
          <Modal.Header>
            <DocumentComponentHeaderH1 text={documentHeader} />
          </Modal.Header>
          <Modal.Body className="p-8">
            {documentBody.map((component, index) => (
              <DocumentComponentVisning
                documentComponent={component}
                key={index}
              />
            ))}
            <Textarea
              className="pt-4 w-4/5"
              label={texts.begrunnelseLabel}
              {...register("begrunnelse", {
                maxLength: MAX_LENGTH_BERGUNNELSE,
                required: true,
              })}
              value={watch("begrunnelse")}
              error={errors.begrunnelse && texts.missingBegrunnelse}
              size="small"
              minRows={4}
              maxLength={MAX_LENGTH_BERGUNNELSE}
            />
          </Modal.Body>
          <Modal.Footer>
            {returLegeerklaring.isError && (
              <SkjemaInnsendingFeil error={returLegeerklaring.error} />
            )}
            <Button type="submit" loading={returLegeerklaring.isPending}>
              {texts.send}
            </Button>
            <CloseButton
              onClick={handleClose}
              disabled={returLegeerklaring.isPending}
            />
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
};
