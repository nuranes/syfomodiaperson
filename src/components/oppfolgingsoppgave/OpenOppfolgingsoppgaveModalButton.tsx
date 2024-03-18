import { Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { OppfolgingsoppgaveModal } from "@/components/oppfolgingsoppgave/OppfolgingsoppgaveModal";
import { PlusCircleIcon } from "@navikt/aksel-icons";

const texts = {
  openModal: "Oppfølgingsoppgave",
};

export const OpenOppfolgingsoppgaveModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="mb-2"
        icon={<PlusCircleIcon aria-hidden />}
      >
        {texts.openModal}
      </Button>
      {isModalOpen && (
        <OppfolgingsoppgaveModal
          isOpen={isModalOpen}
          toggleOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};
