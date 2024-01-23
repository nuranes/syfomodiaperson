import React from "react";
import { ReactElement } from "react";
import Side from "../../Side";
import SykepengesoknadContainer from "./SykepengesoknadContainer";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  tittel: "Sykepengesøknader",
};

export const SykepengesoknadSide = (): ReactElement => {
  return (
    <Side tittel={texts.tittel} aktivtMenypunkt={Menypunkter.SYKEPENGESOKNADER}>
      <SykepengesoknadContainer />
    </Side>
  );
};
