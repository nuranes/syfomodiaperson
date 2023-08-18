import React, { ReactElement } from "react";
import HistorikkEventItem from "./HistorikkEventItem";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import styled from "styled-components";

const texts = {
  errorMessage:
    "Det skjedde en feil! Det er ikke sikkert du får all historikken som finnes.",
  utenforTilfelleHendelserUtvidbarTitle: "Hendelser uten tilfelle",
  laterEventsTitle: "Hendelser",
  tilfellerTitle: "Sykefraværstilfeller",
};

const byTidspunkt: () => (h1: HistorikkEvent, h2: HistorikkEvent) => number =
  () => (h1: HistorikkEvent, h2: HistorikkEvent) => {
    return new Date(h2.tidspunkt).getTime() - new Date(h1.tidspunkt).getTime();
  };

const isEventInTilfelle = (
  event: HistorikkEvent,
  tilfelle: OppfolgingstilfelleDTO
): boolean => {
  return (
    new Date(tilfelle.start) < new Date(event.tidspunkt) &&
    new Date(event.tidspunkt) < new Date(tilfelle.end)
  );
};

const hentTilfelleMedEvents = (
  tilfelleliste: OppfolgingstilfelleDTO[],
  eventliste: HistorikkEvent[]
) => {
  return tilfelleliste.filter((tilfelle: OppfolgingstilfelleDTO) => {
    return eventliste.some((event: HistorikkEvent) =>
      isEventInTilfelle(event, tilfelle)
    );
  });
};

interface UtenforTilfelleHendelserProps {
  eventUtenforTilfelleList: HistorikkEvent[];
}

const hentEventUtenforTilfelleList = (
  tilfelleliste: OppfolgingstilfelleDTO[],
  historikkEvents: HistorikkEvent[]
): HistorikkEvent[] => {
  return historikkEvents.filter((event) => {
    return !tilfelleliste.some((tilfelle) =>
      isEventInTilfelle(event, tilfelle)
    );
  });
};

interface HistorikkProps {
  historikkEvents: HistorikkEvent[];
  tilfeller: OppfolgingstilfelleDTO[];
}

const UtvidbarHistorikk = styled(Ekspanderbartpanel)`
  margin-bottom: 1.25em;
`;

const Historikk = ({
  historikkEvents,
  tilfeller,
}: HistorikkProps): ReactElement => {
  const tilfellerMedEvents = hentTilfelleMedEvents(tilfeller, historikkEvents);
  const eventUtenforTilfelleList = hentEventUtenforTilfelleList(
    tilfeller,
    historikkEvents
  );

  const UtenforTilfelleHendelser = ({
    eventUtenforTilfelleList,
  }: UtenforTilfelleHendelserProps) => {
    return (
      <>
        {eventUtenforTilfelleList.length > 0 && (
          <UtvidbarHistorikk
            tittel={texts.utenforTilfelleHendelserUtvidbarTitle}
          >
            <ol className="historikkeventliste">
              {eventUtenforTilfelleList
                .sort(byTidspunkt())
                .map((event, idx) => {
                  return <HistorikkEventItem key={idx} event={event} />;
                })}
            </ol>
          </UtvidbarHistorikk>
        )}
      </>
    );
  };

  return (
    <>
      {tilfellerMedEvents.length > 0 && (
        <div className="blokk--l">
          <h2 className="panel__tittel">{texts.tilfellerTitle}</h2>
          {tilfellerMedEvents.map(
            (tilfelle: OppfolgingstilfelleDTO, index: number) => (
              <UtvidbarHistorikk
                key={index}
                tittel={tilLesbarPeriodeMedArstall(
                  tilfelle.start,
                  tilfelle.end
                )}
              >
                <ol className="historikkeventliste">
                  {historikkEvents
                    .filter((event) => isEventInTilfelle(event, tilfelle))
                    .sort(byTidspunkt())
                    .map((event, idx) => (
                      <HistorikkEventItem key={idx} event={event} />
                    ))}
                </ol>
              </UtvidbarHistorikk>
            )
          )}
        </div>
      )}
      <UtenforTilfelleHendelser
        eventUtenforTilfelleList={eventUtenforTilfelleList}
      />
    </>
  );
};

export default Historikk;
