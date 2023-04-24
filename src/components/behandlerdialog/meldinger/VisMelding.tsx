import { Button } from "@navikt/ds-react";
import { EyeWithPupilIcon } from "@navikt/aksel-icons";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import React, { useState } from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import styled from "styled-components";

const texts = {
  visButton: "Se utfyllende melding",
  visContentLabel: "Vis melding",
};

interface VisMeldingProps {
  melding: Melding;
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
      <Forhandsvisning
        contentLabel={texts.visContentLabel}
        isOpen={visMelding}
        handleClose={() => setVisMelding(false)}
        getDocumentComponents={() => melding.document}
      />
    </>
  );
};
