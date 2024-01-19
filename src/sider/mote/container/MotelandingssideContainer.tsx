import React from "react";
import Side from "../../Side";
import Motelandingsside from "../components/Motelandingsside";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  pageTitle: "Møtelandingsside",
};

const MotelandingssideContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <Motelandingsside />
    </Side>
  );
};

export default MotelandingssideContainer;
