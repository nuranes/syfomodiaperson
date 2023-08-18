import React from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import { MeldingActionButton } from "@/components/behandlerdialog/MeldingActionButton";

const texts = {
  button: "Vurder retur av legeerklæring",
};

interface ReturLegeerklaringProps {
  melding: MeldingDTO;
}

export const ReturLegeerklaring = ({ melding }: ReturLegeerklaringProps) => {
  return (
    <MeldingActionButton
      icon={<ArrowUndoIcon aria-hidden />}
      onClick={() => {
        console.log("Retur clicked for melding!", melding);
      }}
    >
      {texts.button}
    </MeldingActionButton>
  );
};
