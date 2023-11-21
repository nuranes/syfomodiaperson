import { Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { HuskelappModal } from "@/components/huskelapp/HuskelappModal";
import { PlusCircleIcon } from "@navikt/aksel-icons";

const texts = {
  openModal: "Åpne huskelapp",
};

export const OpenHuskelappModalButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setModalIsOpen(!modalIsOpen)}
        className="mb-2"
        icon={<PlusCircleIcon aria-hidden />}
      >
        {texts.openModal}
      </Button>
      {modalIsOpen && (
        <HuskelappModal isOpen={modalIsOpen} toggleOpen={setModalIsOpen} />
      )}
    </div>
  );
};
