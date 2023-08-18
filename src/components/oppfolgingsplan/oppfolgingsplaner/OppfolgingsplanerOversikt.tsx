import React from "react";
import dayjs from "dayjs";
import Alertstripe from "nav-frontend-alertstriper";
import Sidetopp from "../../Sidetopp";
import {
  erIdag,
  erIkkeIdag,
  restdatoTilLesbarDato,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { Heading, HeadingProps, LinkPanel } from "@navikt/ds-react";

const texts = {
  titles: {
    relevantOppfolgingsplaner: "Aktive oppfølgingsplaner",
    inactiveOppfolgingsplaner: "Tidligere oppfølgingsplaner",
    lpsOppfolgingsplaner: "Oppfølgingsplaner med bistandsbehov",
  },
  alertMessages: {
    noRelevantOppfolgingsplaner: "Det er ingen aktive oppfølgingsplaner.",
    noInactiveOppfolgingsplaner: "Det er ingen tidligere oppfølgingsplaner.",
    noLPSOppfolgingsplaner: "Det er ingen oppfølgingsplaner med bistandsbehov",
  },
  duration: "Varighet",
  shared: "Delt med NAV",
};

const durationText = (plan: OppfolgingsplanDTO) => {
  return `${texts.duration} ${tilLesbarPeriodeMedArstall(
    plan.godkjentPlan.gyldighetstidspunkt.fom,
    plan.godkjentPlan.gyldighetstidspunkt.tom
  )}`;
};

const deltMedNavText = (plan: OppfolgingsplanDTO) => {
  const sharedDate =
    plan.godkjentPlan &&
    restdatoTilLesbarDato(plan.godkjentPlan.deltMedNAVTidspunkt);
  return `${texts.shared} ${sharedDate}`;
};

interface OppfolgingsplanVirksomhetTittelProps {
  plan: OppfolgingsplanDTO;
}

const OppfolgingsplanVirksomhetTittel = ({
  plan,
}: OppfolgingsplanVirksomhetTittelProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(
    plan.virksomhet.virksomhetsnummer
  );
  return (
    <h3 className="panel__tittel navigasjonselement__tittel">
      {virksomhetsnavn}
    </h3>
  );
};

interface OppfolgingsplanerOversiktProps {
  aktivePlaner: OppfolgingsplanDTO[];
  inaktivePlaner: OppfolgingsplanDTO[];
  fnr: string;
  oppfolgingsplanerLPS: OppfolgingsplanLPS[];
}

const OppfolgingsplanerOversikt = (
  oppfolgingsplanerOversiktProps: OppfolgingsplanerOversiktProps
) => {
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const { aktivePlaner, inaktivePlaner, oppfolgingsplanerLPS } =
    oppfolgingsplanerOversiktProps;
  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(oppfolgingsplanLPS, personoppgaver)
  );

  const oppfolgingsplanerLPSUnprocessed = oppfolgingsplanerLPSMedPersonOppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        if (oppfolgingsplanLPS.personoppgave.behandletTidspunkt) {
          return (
            Date.now() <
            dayjs(oppfolgingsplanLPS.personoppgave.behandletTidspunkt)
              .add(1, "days")
              .toDate()
              .getTime()
          );
        }
        return !oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();
    });

  const oppfolgingsplanerLPSProcessed = oppfolgingsplanerLPSMedPersonOppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        return oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIkkeIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime();
    });

  aktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  inaktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  const SectionHeading = ({ children }: Pick<HeadingProps, "children">) => {
    return (
      <Heading spacing level="2" size="medium">
        {children}
      </Heading>
    );
  };

  interface LinkToOppfolgningsplanProps {
    dialog: OppfolgingsplanDTO;
  }

  const LinkToOppfolgningsplan = ({ dialog }: LinkToOppfolgningsplanProps) => {
    return (
      <LinkPanel href={`/sykefravaer/oppfoelgingsplaner/${dialog.id}`}>
        <LinkPanel.Title>
          <OppfolgingsplanVirksomhetTittel plan={dialog} />
        </LinkPanel.Title>
        <LinkPanel.Description>
          <p>{durationText(dialog)}</p>
          <p>{deltMedNavText(dialog)}</p>
        </LinkPanel.Description>
      </LinkPanel>
    );
  };

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
      <div className="blokk--l">
        <SectionHeading>
          {texts.titles.relevantOppfolgingsplaner}
        </SectionHeading>
        {aktivePlaner.length === 0 &&
          oppfolgingsplanerLPSUnprocessed.length === 0 && (
            <Alertstripe type="info">
              <p>{texts.alertMessages.noRelevantOppfolgingsplaner}</p>
            </Alertstripe>
          )}
        {oppfolgingsplanerLPSUnprocessed.map((planLPS, index) => {
          return (
            <OppfolgingsplanerOversiktLPS
              key={index}
              oppfolgingsplanLPSBistandsbehov={planLPS}
            />
          );
        })}
        {aktivePlaner.map((dialog, index) => {
          return <LinkToOppfolgningsplan key={index} dialog={dialog} />;
        })}
      </div>
      <SectionHeading>{texts.titles.inactiveOppfolgingsplaner}</SectionHeading>
      {inaktivePlaner.length === 0 &&
        oppfolgingsplanerLPSProcessed.length === 0 && (
          <Alertstripe type="info">
            <p>{texts.alertMessages.noInactiveOppfolgingsplaner}</p>
          </Alertstripe>
        )}
      {inaktivePlaner.map((dialog, index) => {
        return (
          <LinkPanel
            key={index}
            href={`/sykefravaer/oppfoelgingsplaner/${dialog.id}`}
          >
            <LinkPanel.Title>
              <OppfolgingsplanVirksomhetTittel plan={dialog} />
            </LinkPanel.Title>
            <LinkPanel.Description>
              <p>{durationText(dialog)}</p>
              <p>{deltMedNavText(dialog)}</p>
            </LinkPanel.Description>
          </LinkPanel>
        );
      })}
      {oppfolgingsplanerLPSProcessed.map((planLPS, index) => {
        return (
          <OppfolgingsplanerOversiktLPS
            key={index}
            oppfolgingsplanLPSBistandsbehov={planLPS}
          />
        );
      })}
    </div>
  );
};

export default OppfolgingsplanerOversikt;
