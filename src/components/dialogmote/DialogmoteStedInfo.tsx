import { BodyShort } from "@navikt/ds-react";
import React from "react";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

const texts = {
  moteSted: "Sted",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export const DialogmoteStedInfo = ({ dialogmote }: Props) => (
  <BodyShort size="small">{`${texts.moteSted}: ${dialogmote.sted}`}</BodyShort>
);
