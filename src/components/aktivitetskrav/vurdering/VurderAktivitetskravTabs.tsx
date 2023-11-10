import React from "react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { hasUbehandletPersonoppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Tabs } from "@navikt/ds-react";
import { UnntakAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { OppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import { SendForhandsvarselSkjema } from "@/components/aktivitetskrav/vurdering/SendForhandsvarselSkjema";
import { IkkeOppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeOppfyltAktivitetskravSkjema";
import styled from "styled-components";

const texts = {
  unntak: "Sett unntak",
  oppfylt: "Er i aktivitet",
  forhandsvarsel: "Send forhåndsvarsel",
  ikkeOppfylt: "Ikke oppfylt",
};

const StyledTabs = styled(Tabs)`
  margin-top: 1rem;
  width: 100%;

  .navds-tabs__tablist-wrapper {
    width: max-content;
  }
`;

enum Tab {
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  FORHANDSVARSEL = "FORHANDSVARSEL",
  IKKE_OPPFYLT = "IKKE_OPPFYLT",
}

interface VurderAktivitetskravTabsProps {
  aktivitetskrav: AktivitetskravDTO;
}

export const VurderAktivitetskravTabs = ({
  aktivitetskrav,
}: VurderAktivitetskravTabsProps) => {
  const { toggles } = useFeatureToggles();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const hasUbehandletVurderStansOppgave = hasUbehandletPersonoppgave(
    oppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );
  const isIkkeOppfyltTabVisible =
    hasUbehandletVurderStansOppgave ||
    !toggles.isSendingAvForhandsvarselEnabled;

  const aktivitetskravUuid = aktivitetskrav.uuid;

  return (
    <StyledTabs defaultValue={Tab.UNNTAK}>
      <Tabs.List>
        <Tabs.Tab value={Tab.UNNTAK} label={texts.unntak} />
        <Tabs.Tab value={Tab.OPPFYLT} label={texts.oppfylt} />
        {toggles.isSendingAvForhandsvarselEnabled && (
          <Tabs.Tab value={Tab.FORHANDSVARSEL} label={texts.forhandsvarsel} />
        )}
        {isIkkeOppfyltTabVisible && (
          <Tabs.Tab value={Tab.IKKE_OPPFYLT} label={texts.ikkeOppfylt} />
        )}
      </Tabs.List>
      <Tabs.Panel value={Tab.UNNTAK}>
        <UnntakAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={Tab.OPPFYLT}>
        <OppfyltAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={Tab.FORHANDSVARSEL}>
        <SendForhandsvarselSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      {isIkkeOppfyltTabVisible && (
        <Tabs.Panel value={Tab.IKKE_OPPFYLT}>
          <IkkeOppfyltAktivitetskravSkjema
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </Tabs.Panel>
      )}
    </StyledTabs>
  );
};
