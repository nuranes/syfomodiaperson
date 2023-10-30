import React from "react";
import { Select } from "@navikt/ds-react";
import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";

const text = {
  label: "Hvilken meldingstype ønsker du å sende?",
  defaultOption: "Velg meldingstype",
  missingMeldingsType: "Vennligst angi meldingstype",
};

const field = "type";

const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
  <option value={type}>{meldingTypeTexts[type]}</option>
);

export const SelectMeldingType = (isMeldingsTypeError: boolean) => {
  return (
    <>
      <Select
        id={field}
        label={text.label}
        {...register("gender")}
        defaultValue={""}
        error={isMeldingsTypeError && text.missingMeldingsType}
      >
        <option value="">{text.defaultOption}</option>
        <MeldingTypeOption
          type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
        />
        <MeldingTypeOption
          type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
        />
        <MeldingTypeOption type={MeldingType.HENVENDELSE_MELDING_FRA_NAV} />
      </Select>
    </>
  );
};
