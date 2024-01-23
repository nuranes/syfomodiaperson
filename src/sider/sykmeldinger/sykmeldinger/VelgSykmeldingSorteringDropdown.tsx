import { Select } from "nav-frontend-skjema";
import React, { ChangeEvent, ReactElement } from "react";
import {
  SorteringKriterium,
  SorteringsKriteriumVerdi,
} from "@/utils/sorterSykmeldingerUtils";

const texts = {
  label: "Sorter etter",
};

interface VelgSykmeldingSorteringDropdownProps {
  sorteringsKriterier: SorteringKriterium[];
  onSorteringChanged: (
    e: ChangeEvent<HTMLSelectElement> & {
      target: { value: SorteringsKriteriumVerdi };
    }
  ) => void;
}

export const VelgSykmeldingSorteringDropdown = ({
  sorteringsKriterier,
  onSorteringChanged,
}: VelgSykmeldingSorteringDropdownProps): ReactElement => (
  <Select label={texts.label} onChange={onSorteringChanged}>
    {sorteringsKriterier.map((kriterium, index) => (
      <option key={index} value={kriterium.verdi}>
        {kriterium.tekst}
      </option>
    ))}
  </Select>
);
