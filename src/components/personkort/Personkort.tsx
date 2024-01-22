import React, { useState } from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import PersonkortHeader from "./PersonkortHeader/PersonkortHeader";
import PersonkortVisning from "./PersonkortVisning";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

const texts = {
  buttons: {
    sykmeldt: "Kontaktinformasjon",
    leder: "Nærmeste leder",
    fastlege: "Fastlege",
    enhet: "Behandlende enhet",
    sikkerhetstiltak: "Sikkerhetstiltak",
  },
};

const Personkort = () => {
  const [visning, setVisning] = useState(PERSONKORTVISNING_TYPE.SYKMELDT);
  const { hasSikkerhetstiltak } = useNavBrukerData();

  return (
    <div className="personkort">
      <Ekspanderbartpanel tittel={<PersonkortHeader />}>
        <div>
          <ul>
            <li>
              <button
                className={`${
                  visning === PERSONKORTVISNING_TYPE.SYKMELDT &&
                  "personkort__knapp--aktiv"
                }`}
                aria-pressed={visning === PERSONKORTVISNING_TYPE.SYKMELDT}
                onClick={() => {
                  setVisning(PERSONKORTVISNING_TYPE.SYKMELDT);
                }}
              >
                {texts.buttons.sykmeldt}
              </button>
            </li>
            <li>
              <button
                className={`${
                  visning === PERSONKORTVISNING_TYPE.LEDER &&
                  "personkort__knapp--aktiv"
                }`}
                aria-pressed={visning === PERSONKORTVISNING_TYPE.LEDER}
                onClick={() => {
                  setVisning(PERSONKORTVISNING_TYPE.LEDER);
                }}
              >
                {texts.buttons.leder}
              </button>
            </li>
            <li>
              <button
                className={`${
                  visning === PERSONKORTVISNING_TYPE.LEGE &&
                  "personkort__knapp--aktiv"
                }`}
                aria-pressed={visning === PERSONKORTVISNING_TYPE.LEGE}
                onClick={() => {
                  setVisning(PERSONKORTVISNING_TYPE.LEGE);
                }}
              >
                {texts.buttons.fastlege}
              </button>
            </li>
            <li>
              <button
                className={`${
                  visning === PERSONKORTVISNING_TYPE.ENHET &&
                  "personkort__knapp--aktiv"
                }`}
                aria-pressed={visning === PERSONKORTVISNING_TYPE.ENHET}
                onClick={() => {
                  setVisning(PERSONKORTVISNING_TYPE.ENHET);
                }}
              >
                {texts.buttons.enhet}
              </button>
            </li>
            {hasSikkerhetstiltak && (
              <li>
                <button
                  className={`${
                    visning === PERSONKORTVISNING_TYPE.SIKKERHETSTILTAK &&
                    "personkort__knapp--aktiv"
                  }`}
                  aria-pressed={
                    visning === PERSONKORTVISNING_TYPE.SIKKERHETSTILTAK
                  }
                  onClick={() => {
                    setVisning(PERSONKORTVISNING_TYPE.SIKKERHETSTILTAK);
                  }}
                >
                  {texts.buttons.sikkerhetstiltak}
                </button>
              </li>
            )}
          </ul>
          <div aria-live="polite">
            <PersonkortVisning visning={visning} />
          </div>
        </div>
      </Ekspanderbartpanel>
    </div>
  );
};

export default Personkort;
