import { Button } from "@navikt/ds-react";
import React, { useState } from "react";
import styled from "styled-components";
import { HuskelappModal } from "@/components/huskelapp/HuskelappModal";

const texts = {
  openModal: "Åpne huskelapp",
};

const StyledButton = styled(Button)`
  margin-bottom: 0.5em;
`;

export const OpenHuskelappModalButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <StyledButton
        variant="secondary"
        onClick={() => setModalIsOpen(!modalIsOpen)}
      >
        {texts.openModal}
      </StyledButton>
      {modalIsOpen && (
        <HuskelappModal isOpen={modalIsOpen} toggleOpen={setModalIsOpen} />
      )}
    </div>
  );
};
