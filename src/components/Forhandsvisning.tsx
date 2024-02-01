import React, { useState } from "react";
import {
  ForhandsvisningModal,
  ForhandsvisningModalProps,
} from "@/components/ForhandsvisningModal";
import { Button } from "@navikt/ds-react";

const texts = {
  forhandsvisning: "Forhåndsvisning",
};

export const Forhandsvisning = (
  props: Omit<ForhandsvisningModalProps, "isOpen" | "handleClose">
) => {
  const [displayForhandsvisning, setDisplayForhandsvisning] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        type="button"
        onClick={() => setDisplayForhandsvisning(true)}
      >
        {texts.forhandsvisning}
      </Button>
      <ForhandsvisningModal
        {...props}
        isOpen={displayForhandsvisning}
        handleClose={() => setDisplayForhandsvisning(false)}
      />
    </>
  );
};
