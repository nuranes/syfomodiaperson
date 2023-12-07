import amplitude from "amplitude-js";
import { erProd } from "@/utils/miljoUtil";
import { Oppfolgingsgrunn } from "@/data/huskelapp/huskelappTypes";

/**
 See documentation for naming guidelines: https://github.com/navikt/analytics-taxonomy
 Other documentation on Aksel: https://aksel.nav.no/god-praksis/artikler/mal-brukeratferd-med-amplitude
 */
export enum EventType {
  PageView = "besøk",
  ButtonClick = "knapp trykket",
  Navigation = "navigere",
  AccordionOpen = "accordion åpnet",
  OppfolgingsgrunnSendt = "oppfolgingsgrunn sendt",
  ViewPortAndScreenResolution = "viewport og skjermstørrelse",
  OptionSelected = "alternativ valgt",
}

type EventPageView = {
  type: EventType.PageView;
  data: {
    url: string;
    sidetittel: string;
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

type OppfolgingsgrunnSendt = {
  type: EventType.OppfolgingsgrunnSendt;
  data: {
    url: string;
    oppfolgingsgrunn: Oppfolgingsgrunn;
  };
};

type ViewPortAndScreenResolution = {
  type: EventType.ViewPortAndScreenResolution;
  data: {
    viewport: {
      width: number;
      height: number;
    };
    screenResolution: {
      width: number;
      height: number;
    };
  };
};

type OptionSelected = {
  type: EventType.OptionSelected;
  data: {
    url: string;
    tekst: string;
    option: string;
  };
};

type Event =
  | EventPageView
  | EventButtonClick
  | Navigation
  | EventAccordionOpen
  | ViewPortAndScreenResolution
  | OppfolgingsgrunnSendt
  | OptionSelected;

export const logEvent = (event: Event) =>
  client.logEvent(event.type, { ...event.data });

export function logViewportAndScreenSize() {
  client.logEvent(EventType.ViewPortAndScreenResolution, {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screenResolution: {
      width: screen.width,
      height: screen.height,
    },
  });
}

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
