import React from "react";
import Tilbakelenke from "../../../components/Tilbakelenke";

const texts = {
  tilbake: "Gå til dine sykmeldinger\n",
};

const LenkeTilDineSykmeldinger = () => {
  return (
    <Tilbakelenke to={`/sykefravaer/sykmeldinger`} tekst={texts.tilbake} />
  );
};

export default LenkeTilDineSykmeldinger;
