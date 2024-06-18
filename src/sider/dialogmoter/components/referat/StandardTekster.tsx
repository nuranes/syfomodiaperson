import { Field } from "react-final-form";
import React, { ReactElement } from "react";
import {
  getReferatTexts,
  StandardTekst,
} from "@/data/dialogmote/dialogmoteTexts";
import { BodyShort, Box, Checkbox, Label } from "@navikt/ds-react";
import { Malform, useMalform } from "@/context/malform/MalformContext";

const texts = {
  header: "Dette informerte NAV om i møtet",
  subHeader: "Velg bare de alternativene du faktisk informerte om i møtet.",
  info: "Det blir hentet opp standardtekster i referatet avhengig av hva du velger.",
};

export const StandardTekster = (): ReactElement => {
  const { malform } = useMalform();
  const referatTexts = getReferatTexts(malform);
  const referatTextsForVisning = getReferatTexts(Malform.BOKMAL);
  return (
    <div className="flex mb-8">
      <div className="flex-1">
        <Label size="small" spacing>
          {texts.header}
        </Label>
        <BodyShort size="small" className="mb-4">
          {texts.subHeader}
        </BodyShort>
        {referatTexts.standardTekster.map((standardtekst, index) => (
          <Field<StandardTekst>
            key={index}
            name="standardtekster"
            type="checkbox"
            value={standardtekst}
          >
            {({ input }) => (
              <Checkbox size="small" {...input} value={standardtekst.text}>
                {referatTextsForVisning.standardTekster[index].label}
              </Checkbox>
            )}
          </Field>
        ))}
      </div>
      <div className="flex-[0.5]">
        <Box
          borderRadius="medium"
          background="surface-subtle"
          borderColor="border-default"
          padding="4"
          borderWidth="1"
        >
          {texts.info}
        </Box>
      </div>
    </div>
  );
};
