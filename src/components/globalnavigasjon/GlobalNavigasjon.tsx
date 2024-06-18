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
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { BodyShort } from "@navikt/ds-react";
import styled from "styled-components";
import { EventType, logEvent } from "@/utils/amplitude";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";

const StyledLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  text-decoration: none;
`;

export enum Menypunkter {
  AKTIVITETSKRAV = "AKTIVITETSKRAV",
  BEHANDLERDIALOG = "BEHANDLERDIALOG",
  DIALOGMOTE = "DIALOGMOTE",
  NOKKELINFORMASJON = "NOKKELINFORMASJON",
  SYKMELDINGER = "SYKMELDINGER",
  SYKEPENGESOKNADER = "SYKEPENGESOKNADER",
  OPPFOELGINGSPLANER = "OPPFOELGINGSPLANER",
  HISTORIKK = "HISTORIKK",
  VEDTAK = "VEDTAK",
  ARBEIDSUFORHET = "ARBEIDSUFORHET",
  FRISKTILARBEID = "FRISKTILARBEID",
}

export type Menypunkt = { navn: string; sti: string };

const allMenypunkter: {
  [key in Menypunkter]: Menypunkt;
} = {
  [Menypunkter.NOKKELINFORMASJON]: {
    navn: "Nøkkelinformasjon",
    sti: "nokkelinformasjon",
  },
  [Menypunkter.AKTIVITETSKRAV]: {
    navn: "Aktivitetskrav",
    sti: "aktivitetskrav",
  },
  [Menypunkter.BEHANDLERDIALOG]: {
    navn: "Dialog med behandler",
    sti: "behandlerdialog",
  },
  [Menypunkter.HISTORIKK]: {
    navn: "Logg",
    sti: "logg",
  },
  [Menypunkter.SYKMELDINGER]: {
    navn: "Sykmeldinger",
    sti: "sykmeldinger",
  },
  [Menypunkter.SYKEPENGESOKNADER]: {
    navn: "Søknader om sykepenger",
    sti: "sykepengesoknader",
  },
  [Menypunkter.OPPFOELGINGSPLANER]: {
    navn: "Oppfølgingsplaner",
    sti: "oppfoelgingsplaner",
  },
  [Menypunkter.DIALOGMOTE]: {
    navn: "Dialogmøter",
    sti: "moteoversikt",
  },
  [Menypunkter.ARBEIDSUFORHET]: {
    navn: "Arbeidsuførhet",
    sti: "arbeidsuforhet",
  },
  [Menypunkter.FRISKTILARBEID]: {
    navn: "Friskmelding til arbeidsformidling",
    sti: "frisktilarbeid",
  },
  [Menypunkter.VEDTAK]: {
    navn: "Vedtak",
    sti: "vedtak",
  },
};

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
  const { data: arbeidsuforhetVurderinger } = useArbeidsuforhetVurderingQuery();
  const { toggles } = useFeatureToggles();

  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(oppfolgingsplanLPS, personoppgaver)
  );
  const allMenypunktEntries: [Menypunkter, Menypunkt][] = Object.entries(
    allMenypunkter
  ).map((value) => value as [Menypunkter, Menypunkt]);

  const setFocus = (index: number) => {
    refs.current[index].focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const newFocusIndex = focusIndex + 1;
        if (newFocusIndex === allMenypunktEntries.length) {
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
  const handleOnClick = (lenketekst: string, destinasjon: string) => {
    const destinationPath = window.location.href + "/sykefravaer" + destinasjon;
    logEvent({
      type: EventType.Navigation,
      data: {
        lenketekst: lenketekst,
        destinasjon: destinationPath,
      },
    });
  };

  return (
    <ul aria-label="Navigasjon" className="navigasjon">
      {allMenypunktEntries.map(([menypunkt, { navn, sti }], index) => {
        if (
          !toggles.isFrisktilarbeidEnabled &&
          menypunkt === Menypunkter.FRISKTILARBEID
        ) {
          return null;
        }

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
          aktivitetskrav,
          arbeidsuforhetVurderinger
        );

        const isVedtakMenypunkt = menypunkt === Menypunkter.VEDTAK;

        return (
          <React.Fragment key={index}>
            {isVedtakMenypunkt ? (
              <VedtakMenypunkt index={index} navn={navn} />
            ) : (
              <li aria-current={isAktiv} className="flex">
                <StyledLink
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
                  onClick={() => handleOnClick(navn, sti)}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                  }}
                >
                  <BodyShort size="small">{navn}</BodyShort>
                  {tasks > 0 && (
                    <UnfinishedTasks tasks={tasks} menypunkt={menypunkt} />
                  )}
                </StyledLink>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};
