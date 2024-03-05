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
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { MeldingActionButton } from "@/sider/behandlerdialog/MeldingActionButton";
import { CloseButton } from "@/components/CloseButton";
import { DocumentComponentHeaderH1 } from "@/components/document/DocumentComponentHeaderH1";

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
  const { documentHeader, documentBody, document } =
    getPaminnelseDocument(melding);

  const handleSendPaminnelseClick = () => {
    const paminnelseDTO: PaminnelseDTO = {
      document,
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
        width="medium"
        closeOnBackdropClick
        open={visPaminnelseModal}
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
        </Modal.Body>
        <Modal.Footer>
          {(paminnelseTilBehandler.isError || behandleOppgave.isError) && (
            <SkjemaInnsendingFeil
              error={paminnelseTilBehandler.error || behandleOppgave.error}
            />
          )}
          <Button
            disabled={behandleOppgave.isPending}
            loading={paminnelseTilBehandler.isPending}
            onClick={handleSendPaminnelseClick}
          >
            {texts.send}
          </Button>
          <Button
            variant="secondary"
            disabled={paminnelseTilBehandler.isPending}
            loading={behandleOppgave.isPending}
            onClick={handleFjernOppgaveClick}
          >
            {texts.fjernOppgave}
          </Button>
          <CloseButton
            onClick={handleClose}
            disabled={
              paminnelseTilBehandler.isPending || behandleOppgave.isPending
            }
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
