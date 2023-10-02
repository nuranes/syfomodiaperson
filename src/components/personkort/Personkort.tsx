import React, { useState } from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import PersonkortHeader from "./PersonkortHeader/PersonkortHeader";
import PersonkortVisning from "./PersonkortVisning";
import SnowButton from "@/components/festive/SnowButton";
import { isDecember, isHalloween, isPride } from "@/utils/festiveUtils";
import { FlexRow, PaddingSize } from "../Layout";
import { OversiktLenker } from "@/components/personkort/OversiktLenker";
import styled from "styled-components";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { SpiderButton } from "@/components/festive/spider/SpiderButton";

const texts = {
  buttons: {
    sykmeldt: "Kontaktinformasjon",
    leder: "Nærmeste leder",
    fastlege: "Fastlege",
    enhet: "Behandlende enhet",
  },
};

const PrideFlexRow = styled(FlexRow)`
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
`;

const Personkort = () => {
  const [visning, setVisning] = useState(PERSONKORTVISNING_TYPE.SYKMELDT);

  return (
    <div className="personkort">
      <FlexRow topPadding={PaddingSize.SM} bottomPadding={PaddingSize.SM}>
        <OversiktLenker />
        {isHalloween() && <SpiderButton />}
        {isDecember() && <SnowButton />}
      </FlexRow>
      {isPride() && <PrideFlexRow>&nbsp;</PrideFlexRow>}
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
