import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Button, Heading, HelpText, Link, Panel } from "@navikt/ds-react";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import styled from "styled-components";
import { useBehandlePersonoppgaveWithoutRefetch } from "@/data/personoppgave/useBehandlePersonoppgave";
import { StatusKanImage } from "../../../../img/ImageComponents";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { Link as RouterLink } from "react-router-dom";

const texts = {
  header: "Vurder bistandsbehovet fra behandler:",
  helptext: "Informasjonen er hentet fra felt 8 i sykmeldingen.",
  link: "Gå til sykmeldingen",
  behandleOppgaveText: "Jeg har vurdert behovet, fjern oppgaven.",
};

const StyledPanel = styled(Panel)`
  margin-bottom: 1em;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledIkon = styled.span`
  margin-right: 0.5rem;
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

interface VurderBistandsbehovProps {
  oppgave: PersonOppgave;
}

const VurderBistandsbehov = ({ oppgave }: VurderBistandsbehovProps) => {
  const behandleOppgave = useBehandlePersonoppgaveWithoutRefetch();
  const { sykmeldinger } = useSykmeldingerQuery();

  const sykmelding = sykmeldinger.find(
    (sykmelding) => sykmelding.id === oppgave.referanseUuid
  );
  return (
    <>
      {sykmelding && (
        <StyledPanel>
          <StyledRow>
            <Heading size="medium" level="2">
              {texts.header}
            </Heading>
            <HelpText
              title="Informasjon fra felt 8 i sykmeldingen"
              placement="left"
            >
              {texts.helptext}
            </HelpText>
          </StyledRow>
          <blockquote>
            {sykmelding?.meldingTilNav.navBoerTaTakISakenBegrunnelse}
          </blockquote>
          <StyledRow>
            <Link
              as={RouterLink}
              to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}
            >
              {texts.link}
            </Link>
            {!behandleOppgave.isSuccess ? (
              <Button
                variant="secondary"
                size="small"
                onClick={() => behandleOppgave.mutate(oppgave.uuid)}
                loading={behandleOppgave.isLoading}
              >
                {texts.behandleOppgaveText}
              </Button>
            ) : (
              <StyledRow>
                <StyledIkon>
                  <img src={StatusKanImage} alt="Ferdig behandlet" />
                </StyledIkon>
                <p>Ferdigbehandlet</p>
              </StyledRow>
            )}
          </StyledRow>
        </StyledPanel>
      )}
    </>
  );
};
export const BistandsbehovOppgaver = () => {
  const { data: oppgaver } = usePersonoppgaverQuery();

  const ubehandletBistandsbehovOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND
  );

  return (
    <>
      {ubehandletBistandsbehovOppgaver.map((oppgave) => (
        <VurderBistandsbehov oppgave={oppgave} key={oppgave.uuid} />
      ))}
    </>
  );
};
