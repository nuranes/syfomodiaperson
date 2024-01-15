import { AktivitetskravVarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import React, { useState } from "react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { Button } from "@navikt/ds-react";
import { EyeWithPupilIcon } from "@navikt/aksel-icons";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";

const texts = {
  visBrev: "Se hele brevet",
  visBrevLabel: "Vis brevet",
};

interface VarselBrevProps {
  varsel: AktivitetskravVarselDTO;
}

export const VarselBrev = ({ varsel }: VarselBrevProps) => {
  const [visBrev, setVisBrev] = useState(false);

  const handleButtonClick = () => {
    setVisBrev(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.visBrev, url: window.location.href },
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
        {texts.visBrev}
      </Button>
      <ForhandsvisningModal
        contentLabel={texts.visBrevLabel}
        isOpen={visBrev}
        handleClose={() => setVisBrev(false)}
        getDocumentComponents={() => varsel.document}
      />
    </>
  );
};
