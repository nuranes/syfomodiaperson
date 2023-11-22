import { BellIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import React, { useState } from "react";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import {
  useBehandlePaminnelseOppgave,
  usePaminnelseTilBehandler,
} from "@/data/behandlerdialog/usePaminnelseTilBehandler";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { MeldingActionButton } from "@/components/behandlerdialog/MeldingActionButton";
import { CloseButton } from "@/components/CloseButton";

const texts = {
  button: "Vurder påminnelse til behandler",
  send: "Send påminnelse",
  fjernOppgave: "Fjern oppgave uten å sende påminnelse",
};

interface VisOgSendPaminnelseProps {
  melding: MeldingDTO;
  oppgave: PersonOppgave;
}

export const PaminnelseMelding = ({
  melding,
  oppgave,
}: VisOgSendPaminnelseProps) => {
  const [visPaminnelseModal, setVisPaminnelseModal] = useState(false);

  const { getPaminnelseDocument } = useMeldingTilBehandlerDocument();
  const paminnelseTilBehandler = usePaminnelseTilBehandler(
    melding.uuid,
    oppgave.uuid
  );
  const behandleOppgave = useBehandlePaminnelseOppgave();
  const paminnelseDocument = getPaminnelseDocument(melding);

  const handleSendPaminnelseClick = () => {
    const paminnelseDTO: PaminnelseDTO = {
      document: paminnelseDocument,
    };
    paminnelseTilBehandler.mutate(paminnelseDTO, {
      onSuccess: () => setVisPaminnelseModal(false),
    });
  };
  const handleFjernOppgaveClick = () => {
    behandleOppgave.mutate(oppgave.uuid, {
      onSuccess: () => setVisPaminnelseModal(false),
    });
  };
  const handleClose = () => setVisPaminnelseModal(false);

  return (
    <>
      <MeldingActionButton
        icon={<BellIcon aria-hidden />}
        onClick={() => {
          setVisPaminnelseModal(true);
          paminnelseTilBehandler.reset();
          behandleOppgave.reset();
        }}
      >
        {texts.button}
      </MeldingActionButton>
      <Modal
        closeOnBackdropClick
        open={visPaminnelseModal}
        onClose={handleClose}
        aria-labelledby="modal-heading"
        header={{ heading: "" }}
      >
        <Modal.Body className={"p-8"}>
          {paminnelseDocument.map((component, index) => (
            <DocumentComponentVisning
              documentComponent={component}
              key={index}
            />
          ))}
          {(paminnelseTilBehandler.isError || behandleOppgave.isError) && (
            <SkjemaInnsendingFeil
              error={paminnelseTilBehandler.error || behandleOppgave.error}
            />
          )}
          <ButtonRow topPadding={PaddingSize.SM} bottomPadding={PaddingSize.SM}>
            <Button
              disabled={behandleOppgave.isLoading}
              loading={paminnelseTilBehandler.isLoading}
              onClick={handleSendPaminnelseClick}
            >
              {texts.send}
            </Button>
            <Button
              variant="secondary"
              disabled={paminnelseTilBehandler.isLoading}
              loading={behandleOppgave.isLoading}
              onClick={handleFjernOppgaveClick}
            >
              {texts.fjernOppgave}
            </Button>
            <CloseButton
              onClick={handleClose}
              disabled={
                paminnelseTilBehandler.isLoading || behandleOppgave.isLoading
              }
            />
          </ButtonRow>
        </Modal.Body>
      </Modal>
    </>
  );
};
