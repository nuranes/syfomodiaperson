import React, { useState } from "react";
import {
  MeldingDTO,
  ReturLegeerklaringDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import { MeldingActionButton } from "@/components/behandlerdialog/MeldingActionButton";
import { Button, Modal, Textarea } from "@navikt/ds-react";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { CloseButton } from "@/components/CloseButton";
import { useReturLegeerklaring } from "@/data/behandlerdialog/useReturLegeerklaring";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { useForm } from "react-hook-form";

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

  const submit = (values: ReturLegeerklaringSkjemaValues) => {
    const returLegeerklaringDTO: ReturLegeerklaringDTO = {
      document: getReturLegeerklaringDocument(values.begrunnelse),
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
      <Modal
        open={visReturModal}
        onClose={handleClose}
        aria-labelledby="modal-heading"
      >
        <Modal.Content className="p-8">
          <form onSubmit={handleSubmit(submit)}>
            {getReturLegeerklaringDocument(watch("begrunnelse")).map(
              (component, index) => (
                <DocumentComponentVisning
                  documentComponent={component}
                  key={index}
                />
              )
            )}
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
            {returLegeerklaring.isError && (
              <SkjemaInnsendingFeil error={returLegeerklaring.error} />
            )}
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
        </Modal.Content>
      </Modal>
    </>
  );
};
