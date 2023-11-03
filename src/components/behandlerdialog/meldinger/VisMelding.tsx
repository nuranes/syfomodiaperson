import { Button } from "@navikt/ds-react";
import { EyeWithPupilIcon } from "@navikt/aksel-icons";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import React, { useState } from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import styled from "styled-components";

const texts = {
  visButton: "Se hele meldingen",
  visContentLabel: "Vis melding",
};

interface VisMeldingProps {
  melding: MeldingDTO;
}

const VisMeldingButton = styled(Button)`
  margin-left: auto;
`;

export const VisMelding = ({ melding }: VisMeldingProps) => {
  const [visMelding, setVisMelding] = useState(false);
  return (
    <>
      <VisMeldingButton
        onClick={() => setVisMelding(true)}
        variant="secondary"
        size="small"
        icon={<EyeWithPupilIcon aria-hidden />}
      >
        {texts.visButton}
      </VisMeldingButton>
      <ForhandsvisningModal
        contentLabel={texts.visContentLabel}
        isOpen={visMelding}
        handleClose={() => setVisMelding(false)}
        getDocumentComponents={() => melding.document}
      />
    </>
  );
};
