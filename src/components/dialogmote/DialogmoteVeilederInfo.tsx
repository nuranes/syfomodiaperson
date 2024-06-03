import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

const texts = {
  veilederInnkalt: "Innkalt av",
  veilederTildelt: "Tildelt",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteVeilederInfo = ({ dialogmote }: Props) => {
  const { data: innkaltVeileder } = useVeilederInfoQuery(
    dialogmote.opprettetAv
  );
  const { data: tildeltVeileder } = useVeilederInfoQuery(
    dialogmote.tildeltVeilederIdent
  );

  const veilederTekst = () => {
    const innkaltNavn = innkaltVeileder?.fulltNavn();
    const tildeltNavn = tildeltVeileder?.fulltNavn();

    return innkaltNavn === tildeltNavn
      ? `${texts.veilederInnkalt}: ${innkaltNavn}`
      : `${texts.veilederInnkalt}: ${innkaltNavn} (${texts.veilederTildelt}: ${tildeltNavn})`;
  };

  return <BodyShort size="small">{veilederTekst()}</BodyShort>;
};
