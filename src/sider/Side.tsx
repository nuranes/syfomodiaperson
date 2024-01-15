import React, { ReactNode, useEffect } from "react";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";
import { GlobalNavigasjon } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isDecember, isEaster, isPride } from "@/utils/festiveUtils";
import { Easter } from "@/components/festive/Easter";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { OversiktLenker } from "@/components/personkort/OversiktLenker";
import SnowButton from "@/components/festive/SnowButton";
import { Pride } from "@/components/festive/Pride";
import { Flexjar } from "@/components/flexjar/Flexjar";
import { Oppfolgingsoppgave } from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";

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
      data: { url: window.location.href, sidetittel: tittel },
    });
  }, [tittel]);
  const { toggles } = useFeatureToggles();
  const showFlexjar =
    toggles.isFlexjarEnabled && aktivtMenypunkt === Menypunkter.AKTIVITETSKRAV;

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
        <div className={"flex -md:flex-wrap"}>
          <nav className="-md:w-full min-w-[15rem] w-[15rem] md:mr-2">
            <GlobalNavigasjon aktivtMenypunkt={aktivtMenypunkt} />
            {isEaster() && <Easter />}
            <Oppfolgingsoppgave />
          </nav>
          <div className="w-full flex flex-col">{children}</div>
        </div>
        {showFlexjar && <Flexjar side={tittel} />}
      </div>
    </DocumentTitle>
  );
};

export default Side;
