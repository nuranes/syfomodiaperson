import React from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import {
  SvarTypeDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import styled from "styled-components";

export const getKey = (tag: string, id?: string | number): string =>
  `${tag}_${id}`;

interface OppsummeringsvisningProps {
  soknad: SykepengesoknadDTO;
}

const OppsummeringsSeksjon = styled.div`
  border-bottom: 1px solid;
  margin-bottom: 2em;
  padding-bottom: 2em;
  line-height: 1.3;

  :last-child {
    border-bottom-width: 0;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const Oppsummeringsvisning = ({
  soknad: { sporsmal },
}: OppsummeringsvisningProps) => {
  return (
    <>
      {sporsmal
        .filter(
          (sporsmal) =>
            sporsmal.svar.length > 0 ||
            sporsmal.undersporsmal.length > 0 ||
            sporsmal.svartype === SvarTypeDTO.IKKE_RELEVANT
        )
        .map((sporsmal) => (
          <OppsummeringsSeksjon key={getKey(sporsmal.tag, sporsmal.id)}>
            <OppsummeringSporsmal {...sporsmal} />
          </OppsummeringsSeksjon>
        ))}
    </>
  );
};

export default Oppsummeringsvisning;
