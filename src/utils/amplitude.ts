import * as amplitude from "@amplitude/analytics-browser";
import { erProd } from "@/utils/miljoUtil";
import { Oppfolgingsgrunn } from "@/data/huskelapp/huskelappTypes";
import { IkkeAktuellArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";

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
  IkkeAktuellVurderingArsak = "Ikke aktuell vurdering arsak",
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

type IkkeAktuellVurderingArsak = {
  type: EventType.IkkeAktuellVurderingArsak;
  data: {
    arsak: IkkeAktuellArsak;
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
  | IkkeAktuellVurderingArsak
  | OptionSelected;

export const logEvent = (event: Event) =>
  amplitude.track(event.type, { ...event.data });

export function logViewportAndScreenSize() {
  amplitude.track(EventType.ViewPortAndScreenResolution, {
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

amplitude.init(getApiKey(), undefined, {
  serverUrl: "https://amplitude.nav.no/collect",
});
