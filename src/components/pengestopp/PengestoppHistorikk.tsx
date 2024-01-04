import * as React from "react";
import { StatusEndring } from "@/data/pengestopp/types/FlaggPerson";
import {
  displayArbeidsgiverNavn,
  displayArsakText,
  sykmeldingerToArbeidsgiver,
  uniqueArbeidsgivere,
} from "@/utils/pengestoppUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { texts } from "./Pengestopp";
import { Box, Heading, Label } from "@navikt/ds-react";

interface IPengestoppDropdown {
  statusEndringList: StatusEndring[];
  sykmeldinger: SykmeldingOldFormat[];
}

const PengestoppHistorikk = ({
  statusEndringList,
  sykmeldinger,
}: IPengestoppDropdown) => {
  const allArbeidsgivere = uniqueArbeidsgivere(
    sykmeldingerToArbeidsgiver(sykmeldinger)
  );

  return (
    <>
      <Heading size="small">{texts.beskjeder}</Heading>
      {statusEndringList.map((statusEndring: StatusEndring, index: number) => {
        const opprettet = new Date(statusEndring.opprettet);
        return (
          <Box
            key={index}
            background="surface-info-subtle"
            borderColor="border-info"
            padding="4"
            borderWidth="1"
            className="my-2"
          >
            <Label size="small">{`${opprettet.getDate()}.${
              opprettet.getMonth() + 1
            }.${opprettet.getFullYear()} · Gjelder for:
            
            ${displayArbeidsgiverNavn(allArbeidsgivere, statusEndring)}
           `}</Label>
            <p>
              {statusEndring.arsakList?.length > 0 &&
                displayArsakText(statusEndring.arsakList)}
            </p>
          </Box>
        );
      })}
    </>
  );
};

export default PengestoppHistorikk;
