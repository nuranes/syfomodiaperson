import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import AlertStripe from "nav-frontend-alertstriper";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { getTidligsteSendtDato } from "@/utils/sykepengesoknadUtils";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";

const texts = {
  korrigert: "Du sendte inn en endring av denne søknaden den ",
  lenketekst: "Se siste versjon av søknaden",
};

const textKorrigert = (dato?: string) => {
  return `${texts.korrigert} ${dato}.`;
};

interface KorrigertAvProps {
  soknadId: string;
}

export const KorrigertAv = ({ soknadId }: KorrigertAvProps): ReactElement => {
  const { data: sykepengesoknader } = useSykepengesoknaderQuery();
  const korrigertAvSoknad = sykepengesoknader.find(
    (s) => s.korrigerer === soknadId
  );
  return (
    <AlertStripe type="info" className="blokk">
      <p className="sist">
        {textKorrigert(
          tilLesbarDatoMedArstall(getTidligsteSendtDato(korrigertAvSoknad))
        )}
      </p>
      <p className="sist">
        <Link
          className="lenke"
          to={`/sykefravaer/sykepengesoknader/${korrigertAvSoknad?.id}`}
        >
          {texts.lenketekst}
        </Link>
      </p>
    </AlertStripe>
  );
};
