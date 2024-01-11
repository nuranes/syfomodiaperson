import React, { ReactElement } from "react";
import PersonkortHeader from "./PersonkortHeader/PersonkortHeader";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { Tabs } from "@navikt/ds-react";
import PersonkortSykmeldt from "@/components/personkort/PersonkortSykmeldt";
import PersonkortLedere from "@/components/personkort/ledere/PersonkortLedere";
import PersonkortLege from "@/components/personkort/PersonkortLege";
import PersonkortEnhet from "@/components/personkort/PersonkortEnhet";
import { PersonkortSikkerhetstiltak } from "@/components/personkort/PersonkortSikkerhetstiltak";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

enum Tab {
  SYKMELDT = "SYKMELDT",
  LEDER = "LEDER",
  LEGE = "LEGE",
  ENHET = "ENHET",
  SIKKERHETSTILTAK = "SIKKERHETSTILTAK",
}

interface TabProps {
  label: string;
}

const tabs: Record<Tab, TabProps> = {
  SYKMELDT: {
    label: "Kontaktinformasjon",
  },
  LEDER: {
    label: "Nærmeste leder",
  },
  LEGE: {
    label: "Fastlege",
  },
  ENHET: {
    label: "Behandlende enhet",
  },
  SIKKERHETSTILTAK: {
    label: "Sikkerhetstiltak",
  },
};

interface PersonkortVisningProps {
  tab: Tab;
}

const PersonkortVisning = ({ tab }: PersonkortVisningProps): ReactElement => {
  switch (tab) {
    case Tab.SYKMELDT:
      return <PersonkortSykmeldt />;
    case Tab.ENHET:
      return <PersonkortEnhet />;
    case Tab.LEDER:
      return <PersonkortLedere />;
    case Tab.LEGE:
      return <PersonkortLege />;
    case Tab.SIKKERHETSTILTAK:
      return <PersonkortSikkerhetstiltak />;
  }
};

const Personkort = () => {
  const { hasSikkerhetstiltak } = useNavBrukerData();
  const isVisible = (tab: Tab): boolean => {
    switch (tab) {
      case Tab.SYKMELDT:
      case Tab.ENHET:
      case Tab.LEDER:
      case Tab.LEGE:
        return true;
      case Tab.SIKKERHETSTILTAK:
        return hasSikkerhetstiltak;
    }
  };
  const visibleTabs = Object.entries(tabs).filter(([key]) =>
    isVisible(key as Tab)
  );

  return (
    <Ekspanderbartpanel tittel={<PersonkortHeader />} className="mb-2">
      <Tabs size="small" defaultValue={Tab.SYKMELDT}>
        <Tabs.List className="mt-4">
          {visibleTabs.map(([key, { label }], index) => (
            <Tabs.Tab value={key} label={label} key={index} />
          ))}
        </Tabs.List>
        {visibleTabs.map(([key], index) => (
          <Tabs.Panel key={index} value={key} className="mt-8">
            <PersonkortVisning tab={key as Tab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Ekspanderbartpanel>
  );
};

export default Personkort;
