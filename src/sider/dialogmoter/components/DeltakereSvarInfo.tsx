import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import React from "react";
import { ArbeidsgiverSvar } from "@/sider/dialogmoter/components/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/sider/dialogmoter/components/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/sider/dialogmoter/components/svar/BehandlerSvar";

interface DeltakereSvarInfoProps {
  dialogmote: DialogmoteDTO;
}

export const DeltakereSvarInfo = ({ dialogmote }: DeltakereSvarInfoProps) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <ArbeidsgiverSvar
        varsel={dialogmote.arbeidsgiver.varselList[0]}
        virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
      />
      <ArbeidstakerSvar varsel={dialogmote.arbeidstaker.varselList[0]} />
      {dialogmote.behandler && (
        <BehandlerSvar
          varsel={dialogmote.behandler.varselList[0]}
          behandlerNavn={dialogmote.behandler.behandlerNavn}
        />
      )}
    </div>
  );
};
