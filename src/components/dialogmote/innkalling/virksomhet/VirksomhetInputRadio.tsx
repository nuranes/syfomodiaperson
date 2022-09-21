import React, { ReactElement } from "react";
import { Radio } from "nav-frontend-skjema";

const texts = {
  fritekstRadio: "Oppgi virksomhetsnummer",
};

interface VirksomhetFritekstRadioProps {
  setShowFritekst: (value: boolean) => void;
  name: string;
}

export const VirksomhetInputRadio = ({
  setShowFritekst,
  name,
}: VirksomhetFritekstRadioProps): ReactElement => (
  <Radio
    label={texts.fritekstRadio}
    name={name}
    value="fritekst"
    onChange={() => setShowFritekst(true)}
  />
);
