import React, { ReactElement, ReactNode } from "react";
import Speilingvarsel from "../../../components/speiling/Speilingvarsel";
import Brodsmuler, { Brodsmule } from "../../../components/speiling/Brodsmuler";
import SidetoppSpeilet from "../../../components/SidetoppSpeilet";
import TilbakeTilSoknader from "./TilbakeTilSoknader";

interface SoknadSpeilingProps {
  brukernavn: string;
  children: ReactNode;
  brodsmuler: Brodsmule[];
  tittel?: string;
}

const SoknadSpeiling = ({
  brukernavn,
  children,
  brodsmuler,
  tittel = "Søknad om sykepenger",
}: SoknadSpeilingProps): ReactElement => {
  return (
    <>
      <Speilingvarsel brukernavn={brukernavn} />
      <div className="speiling">
        <Brodsmuler brodsmuler={brodsmuler} />
        <SidetoppSpeilet tittel={tittel} />
        <div className="blokk">{children}</div>
        <TilbakeTilSoknader />
      </div>
    </>
  );
};

export default SoknadSpeiling;
