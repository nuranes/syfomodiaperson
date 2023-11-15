import React from "react";
import { VerktoyKnapp, Verktoylinje } from "../../Verktoylinje";

const texts = {
  gjenapne: "Gjenåpne søknad",
};

const VerktoylinjeGjenapneSoknad = () => {
  return (
    <Verktoylinje>
      <VerktoyKnapp>{texts.gjenapne}</VerktoyKnapp>
    </Verktoylinje>
  );
};

export default VerktoylinjeGjenapneSoknad;
