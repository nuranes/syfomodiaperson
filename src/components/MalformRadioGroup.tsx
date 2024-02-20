import React from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { Malform, useMalform } from "@/context/malform/MalformContext";

const texts = {
  husk: "Husk å skrive nynorsk i alle fritekstfelt",
};

export const MalformRadioGroup = () => {
  const { malform, setMalform } = useMalform();
  return (
    <RadioGroup
      legend="Velg målform"
      onChange={(value) => setMalform(value as Malform)}
      size="small"
      defaultValue={malform}
      className="mb-4"
    >
      <Radio value={Malform.BOKMAL}>Bokmål</Radio>
      <Radio
        value={Malform.NYNORSK}
        description={malform === Malform.NYNORSK ? texts.husk : undefined}
      >
        Nynorsk
      </Radio>
    </RadioGroup>
  );
};
