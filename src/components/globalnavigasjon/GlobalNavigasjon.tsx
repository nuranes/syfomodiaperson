import React, { useRef, useState } from "react";
import cn from "classnames";
import UnfinishedTasks from "./UnfinishedTasks";
import { Link } from "react-router-dom";
import { numberOfTasks } from "@/utils/globalNavigasjonUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { VedtakMenypunkt } from "@/components/globalnavigasjon/VedtakMenypunkt";
import { Menypunkt, Menypunkter } from "@/navigation/menypunkterTypes";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";

const nokkelinformasjonMenypunkt = {
  navn: "Nøkkelinformasjon",
  sti: "nokkelinformasjon",
  menypunkt: Menypunkter.NOKKELINFORMASJON,
};

const aktivitetskravMenypunkt = {
  navn: "Aktivitetskrav",
  sti: "aktivitetskrav",
  menypunkt: Menypunkter.AKTIVITETSKRAV,
};

const historikkMenypunkt = {
  navn: "Logg",
  sti: "logg",
  menypunkt: Menypunkter.HISTORIKK,
};

const motemodulMenypunkt = {
  navn: "Dialogmøter",
  sti: "moteoversikt",
  menypunkt: Menypunkter.DIALOGMOTE,
};

const sykmeldingerMenypunkt = {
  navn: "Sykmeldinger",
  sti: "sykmeldinger",
  menypunkt: Menypunkter.SYKMELDINGER,
};

const sykepengesoknadMenypunkt = {
  navn: "Søknader om sykepenger",
  sti: "sykepengesoknader",
  menypunkt: Menypunkter.SYKEPENGESOKNADER,
};

const oppfoelgingsplanMenypunkt = {
  navn: "Oppfølgingsplaner",
  sti: "oppfoelgingsplaner",
  menypunkt: Menypunkter.OPPFOELGINGSPLANER,
};

const vedtakMenypunkt = {
  navn: "Vedtak",
  sti: "vedtak",
  menypunkt: Menypunkter.VEDTAK,
};
const allMenypunkter: Menypunkt[] = [
  nokkelinformasjonMenypunkt,
  aktivitetskravMenypunkt,
  historikkMenypunkt,
  sykmeldingerMenypunkt,
  sykepengesoknadMenypunkt,
  oppfoelgingsplanMenypunkt,
  motemodulMenypunkt,
  vedtakMenypunkt,
];

interface GlobalNavigasjonProps {
  aktivtMenypunkt: Menypunkter;
}

export const GlobalNavigasjon = ({
  aktivtMenypunkt,
}: GlobalNavigasjonProps) => {
  const [focusIndex, setFocusIndex] = useState(-1);
  const refs = useRef<HTMLAnchorElement[]>([]);

  const { data: personoppgaver } = usePersonoppgaverQuery();
  const { data: oppfolgingsplaner } = useOppfolgingsplanerQuery();
  const { data: oppfolgingsplanerLPS } = useOppfolgingsplanerLPSQuery();
  const { data: motebehov } = useMotebehovQuery();
  const { data: aktivitetskrav } = useAktivitetskravQuery();

  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(oppfolgingsplanLPS, personoppgaver)
  );

  const setFocus = (index: number) => {
    refs.current[index].focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const newFocusIndex = focusIndex + 1;
        if (newFocusIndex === allMenypunkter.length) {
          return;
        }
        setFocusIndex(newFocusIndex);
        setFocus(newFocusIndex);
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        const newFocusIndex = focusIndex - 1;
        if (newFocusIndex === -1) {
          return;
        }
        setFocusIndex(newFocusIndex);
        setFocus(newFocusIndex);
        break;
      }
      default:
        break;
    }
  };

  return (
    <ul aria-label="Navigasjon" className="navigasjon">
      {allMenypunkter.map(({ navn, sti, menypunkt }, index) => {
        const isAktiv = menypunkt === aktivtMenypunkt;
        const className = cn("navigasjonspanel", {
          "navigasjonspanel--aktiv": isAktiv,
        });
        const tasks = numberOfTasks(
          menypunkt,
          motebehov,
          oppfolgingsplaner,
          personoppgaver,
          oppfolgingsplanerLPSMedPersonOppgave,
          aktivitetskrav
        );

        const isVedtakMenypunkt = menypunkt === Menypunkter.VEDTAK;

        return (
          <React.Fragment key={index}>
            {isVedtakMenypunkt ? (
              <VedtakMenypunkt index={index} navn={navn} />
            ) : (
              <li className="navigasjon__element" aria-current={isAktiv}>
                <Link
                  ref={(instance) => {
                    if (instance) {
                      refs.current[index] = instance;
                    }
                  }}
                  className={className}
                  to={`/sykefravaer/${sti}`}
                  onFocus={() => {
                    setFocusIndex(index);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                  }}
                >
                  <span
                    className="navigasjon__element__tekst"
                    dangerouslySetInnerHTML={{ __html: navn }}
                  />
                  {tasks > 0 && (
                    <UnfinishedTasks tasks={tasks} menypunkt={menypunkt} />
                  )}
                </Link>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};
