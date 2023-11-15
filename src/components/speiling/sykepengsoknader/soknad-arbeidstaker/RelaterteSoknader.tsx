import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import {
  getTidligsteSendtDato,
  sorterEtterDato,
} from "@/utils/sykepengesoknadUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";

const texts = {
  tittel: "Tidligere utgaver som du har sendt",
  sendt: "Sendt",
};

interface RelaterteSoknaderProps {
  soknad: SykepengesoknadDTO;
}

export const RelaterteSoknader = ({
  soknad,
}: RelaterteSoknaderProps): ReactElement | null => {
  const { data: sykepengesoknader } = useSykepengesoknaderQuery();
  const relaterteSoknader = sykepengesoknader
    .filter((s) => s.id === soknad.korrigerer)
    .reverse();
  if (relaterteSoknader.length === 0) {
    return null;
  }

  return (
    <div className="panel tidligereVersjoner">
      <h2 className="tidligereVersjoner__tittel">{texts.tittel}</h2>
      <ul className="tidligereVersjoner__liste">
        {relaterteSoknader.sort(sorterEtterDato).map((s, index) => (
          <li key={index}>
            <Link to={`/sykefravaer/sykepengesoknader/${s.id}`}>
              {texts.sendt} {tilLesbarDatoMedArstall(getTidligsteSendtDato(s))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
