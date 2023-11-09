import amplitude from "amplitude-js";
import { erProd } from "@/utils/miljoUtil";

/**
 See documentation for naming guidelines: https://github.com/navikt/analytics-taxonomy
 Other documentation on Aksel: https://aksel.nav.no/god-praksis/artikler/mal-brukeratferd-med-amplitude
 */
export enum EventType {
  PageView = "besøk",
  ButtonClick = "knapp trykket",
  Navigation = "navigere",
  AccordionOpen = "accordion åpnet",
}

type EventPageView = {
  type: EventType.PageView;
  data: {
    url: string;
    sideTittel: string;
  };
};

type EventButtonClick = {
  type: EventType.ButtonClick;
  data: {
    url: string;
    tekst: string;
  };
};

type Navigation = {
  type: EventType.Navigation;
  data: {
    lenketekst: string;
    destinasjon: string;
  };
};

type EventAccordionOpen = {
  type: EventType.AccordionOpen;
  data: {
    url: string;
    tekst: string;
  };
};

type Event = EventPageView | EventButtonClick | Navigation | EventAccordionOpen;

export const logEvent = (event: Event) => {
  switch (event.type) {
    case EventType.ButtonClick:
      client.logEvent(EventType.ButtonClick, {
        url: event.data.url,
        tekst: event.data.tekst,
      });
      break;
    case EventType.PageView:
      client.logEvent(EventType.PageView, {
        url: event.data.url,
        sidetittel: event.data.sideTittel,
      });
      break;
    case EventType.Navigation:
      client.logEvent(EventType.Navigation, {
        destinasjon: event.data.destinasjon,
        lenketekst: event.data.lenketekst,
      });
      break;
    case EventType.AccordionOpen:
      client.logEvent(EventType.AccordionOpen, {
        url: event.data.url,
        tekst: event.data.tekst,
      });
  }
};

const getApiKey = () => {
  return erProd()
    ? "e4b68538f8d185f0ee2d913d8e51bd39"
    : "c7bcaaf5d0fddda592412234dd3da1ba";
};

const client = amplitude.getInstance();
client.init(getApiKey(), "", {
  apiEndpoint: "amplitude.nav.no/collect",
  saveEvents: false,
  includeUtm: true,
  batchEvents: false,
  includeReferrer: true,
});
