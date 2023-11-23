import React, { ReactNode, useEffect } from "react";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isDecember, isEaster, isPride } from "@/utils/festiveUtils";
import { Easter } from "@/components/festive/Easter";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import * as Amplitude from "@/utils/amplitude";
import { OpenHuskelappModalButton } from "@/components/huskelapp/OpenHuskelappModalButton";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { EventType } from "@/utils/amplitude";
import { OversiktLenker } from "@/components/personkort/OversiktLenker";
import SnowButton from "@/components/festive/SnowButton";
import { Pride } from "@/components/festive/Pride";
import styled from "styled-components";

const AdaptableRow = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const MODIA_HEADER_ID = "modia-header";

interface SideProps {
  tittel: string;
  aktivtMenypunkt: Menypunkter;
  children?: ReactNode;
}

const Side = ({ tittel, aktivtMenypunkt, children }: SideProps) => {
  useEffect(() => {
    Amplitude.logEvent({
      type: EventType.PageView,
      data: { url: window.location.href, sideTittel: tittel },
    });
  }, [tittel]);
  const { toggles } = useFeatureToggles();

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <div className="mx-6">
        <div className="flex flex-col" id={MODIA_HEADER_ID}>
          <div className="flex flex-row mt-4 mb-2 w-full">
            <OversiktLenker />
            {isDecember() && <SnowButton />}
          </div>
          {isPride() && <Pride>&nbsp;</Pride>}
          <Personkort />
        </div>
        <AdaptableRow>
          <nav className="min-w-[15rem] mr-4">
            <GlobalNavigasjon aktivtMenypunkt={aktivtMenypunkt} />
            {isEaster() && <Easter />}
            {toggles.isHuskelappEnabled && <OpenHuskelappModalButton />}
          </nav>
          <div className="w-full flex flex-col">{children}</div>
        </AdaptableRow>
      </div>
    </DocumentTitle>
  );
};

export default Side;
