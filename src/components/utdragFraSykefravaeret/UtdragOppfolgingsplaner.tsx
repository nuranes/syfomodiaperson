import React from "react";
import styled from "styled-components";
import Lenke from "nav-frontend-lenker";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { Undertittel } from "nav-frontend-typografi";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  header: "Oppfølgingsplan",
  ingenPlanerDelt: "Ingen planer er delt med NAV",
};

interface AktivePlanerProps {
  aktivePlaner: OppfolgingsplanDTO[];
}

const AktivPlan = styled.div`
  margin-top: 0.5em;
  margin-bottom: 1em;

  a {
    text-transform: capitalize;
  }
`;

const Gyldighetsperiode = styled.span`
  margin-left: 2em;
`;

interface AktivPlanLenkeProps {
  aktivPlan: OppfolgingsplanDTO;
}

const AktivPlanLenke = ({ aktivPlan }: AktivPlanLenkeProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(
    aktivPlan.virksomhet.virksomhetsnummer
  );
  return (
    <span>
      <Lenke
        className="lenke"
        href={`/sykefravaer/oppfoelgingsplaner/${aktivPlan.id}`}
      >
        {virksomhetsnavn && virksomhetsnavn.length > 0
          ? virksomhetsnavn.toLowerCase()
          : aktivPlan.virksomhet.virksomhetsnummer}
      </Lenke>
    </span>
  );
};

const AktivePlaner = ({ aktivePlaner }: AktivePlanerProps) => (
  <>
    {aktivePlaner.map((plan, index) => (
      <AktivPlan key={index}>
        <AktivPlanLenke aktivPlan={plan} />
        <Gyldighetsperiode>
          {tilLesbarPeriodeMedArstall(
            plan.godkjentPlan.gyldighetstidspunkt.fom,
            plan.godkjentPlan.gyldighetstidspunkt.tom
          )}
        </Gyldighetsperiode>
      </AktivPlan>
    ))}
  </>
);

interface LpsPlanLenkeProps {
  lpsPlan: OppfolgingsplanLPS;
}

const LpsPlanLenke = ({ lpsPlan }: LpsPlanLenkeProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(lpsPlan.virksomhetsnummer);
  const virksomhetsNavn = virksomhetsnavn || lpsPlan.virksomhetsnummer;
  return (
    <a
      className="lenke"
      href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${lpsPlan.uuid}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {`${virksomhetsNavn} (pdf)`}
    </a>
  );
};

interface LpsPlanerProps {
  lpsPlaner: OppfolgingsplanLPS[];
}

const LpsPlaner = ({ lpsPlaner }: LpsPlanerProps) => (
  <>
    {lpsPlaner.map((plan, index) => {
      const lesbarDato = tilLesbarDatoMedArstall(plan.opprettet);
      return (
        <div key={index}>
          <LpsPlanLenke lpsPlan={plan} />
          <span>{` innsendt ${lesbarDato} (LPS)`}</span>
        </div>
      );
    })}
  </>
);

interface OppfolgingsplanerProps {
  aktivePlaner: OppfolgingsplanDTO[];
  lpsPlaner: OppfolgingsplanLPS[];
}

const Oppfolgingsplaner = ({
  aktivePlaner,
  lpsPlaner,
}: OppfolgingsplanerProps) => {
  return (
    <div>
      <AktivePlaner aktivePlaner={aktivePlaner} />
      <LpsPlaner lpsPlaner={lpsPlaner} />
    </div>
  );
};

const UtdragOppfolgingsplanerWrapper = styled.div`
  margin-bottom: 2.5em;
`;

export const UtdragOppfolgingsplaner = () => {
  const { aktivePlaner } = useOppfolgingsplanerQuery();
  const { data: oppfolgingsplanerLPS } = useOppfolgingsplanerLPSQuery();

  const startDateNewestActiveTilfelle = useStartOfLatestOppfolgingstilfelle();

  const activeLpsPlaner = lpsPlanerWithActiveTilfelle(
    oppfolgingsplanerLPS,
    startDateNewestActiveTilfelle
  );

  const anyActivePlaner =
    aktivePlaner?.length > 0 || activeLpsPlaner.length > 0;

  return (
    <UtdragOppfolgingsplanerWrapper>
      <Undertittel tag={"h3"}>{texts.header}</Undertittel>
      {anyActivePlaner ? (
        <Oppfolgingsplaner
          aktivePlaner={aktivePlaner}
          lpsPlaner={activeLpsPlaner}
        />
      ) : (
        <p>{texts.ingenPlanerDelt}</p>
      )}
    </UtdragOppfolgingsplanerWrapper>
  );
};
