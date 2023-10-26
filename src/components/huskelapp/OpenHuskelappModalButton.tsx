import { Button } from "@navikt/ds-react";
import React, { useState } from "react";
import { HuskelappModal } from "@/components/huskelapp/HuskelappModal";

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
      >
        {texts.openModal}
      </Button>
      {modalIsOpen && (
        <HuskelappModal isOpen={modalIsOpen} toggleOpen={setModalIsOpen} />
      )}
    </div>
  );
};
