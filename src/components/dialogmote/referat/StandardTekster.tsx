import { Field } from "react-final-form";
import React, { ReactElement } from "react";
import { referatTexts, StandardTekst } from "@/data/dialogmote/dialogmoteTexts";
import { ReferatInfoColumn } from "./ReferatInfoColumn";
import { BodyShort, Checkbox, Label } from "@navikt/ds-react";

const texts = {
  header: "Dette informerte NAV om i møtet",
  subHeader: "Velg bare de alternativene du faktisk informerte om i møtet.",
  info: "Det blir hentet opp standardtekster i referatet avhengig av hva du velger.",
};

export const StandardTekster = (): ReactElement => (
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
              {standardtekst.label}
            </Checkbox>
          )}
        </Field>
      ))}
    </div>
    <ReferatInfoColumn>{texts.info}</ReferatInfoColumn>
  </div>
);
