import React, { useState } from "react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { Button } from "@navikt/ds-react";
import { EyeWithPupilIcon } from "@navikt/aksel-icons";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

const texts = {
  visBrev: "Se hele brevet",
  visBrevLabel: "Vis brevet",
};

interface VarselBrevProps {
  document: DocumentComponentDto[];
  buttonText?: string;
}

export const VisBrev = ({
  document,
  buttonText = texts.visBrev,
}: VarselBrevProps) => {
  const [visBrev, setVisBrev] = useState(false);

  const handleButtonClick = () => {
    setVisBrev(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: buttonText, url: window.location.href },
    });
  };

  return (
    <>
      <Button
        className="max-w-max"
        onClick={handleButtonClick}
        variant="secondary"
        size="small"
        icon={<EyeWithPupilIcon aria-hidden />}
      >
        {buttonText}
      </Button>
      <ForhandsvisningModal
        contentLabel={texts.visBrevLabel}
        isOpen={visBrev}
        handleClose={() => setVisBrev(false)}
        getDocumentComponents={() => document}
      />
    </>
  );
};
