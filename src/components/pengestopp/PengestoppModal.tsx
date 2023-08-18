import * as React from "react";
import { ChangeEvent, useState } from "react";
import { Knapp } from "nav-frontend-knapper";
import { Feilmelding, Systemtittel } from "nav-frontend-typografi";
import { Checkbox, CheckboxGruppe } from "nav-frontend-skjema";
import styled from "styled-components";
import {
  Arbeidsgiver,
  StoppAutomatikk,
  SykepengestoppArsak,
  SykepengestoppArsakType,
  VirksomhetNr,
} from "@/data/pengestopp/types/FlaggPerson";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useFlaggPerson } from "@/data/pengestopp/useFlaggPerson";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import { Modal } from "@navikt/ds-react";

const texts = {
  notStoppedTittel:
    "Send beskjed til NAV Arbeid og ytelser om mulig stans av sykepenger",
  stoppedTittel: "Beskjeden din er sendt",
  stoppedInfo:
    "Nå har du sendt beskjed til NAV Arbeid og ytelser. Du må også lage et notat i Gosys hvor du begrunner hvorfor du mener sykepengene bør stanses.",
  seServicerutinen: "Se servicerutinen hvis du er i tvil.",
  arbeidsgiver: "Velg arbeidsgiver",
  stansSykepenger: "Stans sykepenger",
  send: "Send",
  avbryt: "Avbryt",
  submitError: "Du må velge minst én arbeidsgiver",
  serverError:
    "Det er ikke mulig å stoppe automatisk utbetaling av sykepenger akkurat nå. Prøv igjen senere.",
  arsak: {
    title: "Du må velge minst en årsak",
    submitError: "Du må velge minst en årsak",
  },
};

interface IPengestoppModal {
  isOpen: boolean;
  arbeidsgivere: Arbeidsgiver[];

  toggle(): void;
}

interface SykepengestoppArsakTekst {
  type: SykepengestoppArsakType;
  text: string;
}

export const sykepengestoppArsakTekstListe: SykepengestoppArsakTekst[] = [
  {
    type: SykepengestoppArsakType.BESTRIDELSE_SYKMELDING,
    text: "Bestridelse av sykmelding (§ 8-4 første ledd)",
  },
  {
    type: SykepengestoppArsakType.MEDISINSK_VILKAR,
    text: "Medisinsk vilkår (§ 8-4 første ledd)",
  },
  {
    type: SykepengestoppArsakType.TILBAKEDATERT_SYKMELDING,
    text: "Tilbakedatert sykmelding (§ 8-7)",
  },
  {
    type: SykepengestoppArsakType.MANGLENDE_MEDVIRKING,
    text: "Manglende medvirkning (§ 8-8 første ledd)",
  },
  {
    type: SykepengestoppArsakType.AKTIVITETSKRAV,
    text: "Aktivitetskravet (§ 8-8 andre ledd)",
  },
];

const StyledModal = styled(Modal)`
  padding: 2em 2.5em;
  max-width: 50em;
  width: 100%;
`;

const Group = styled.div`
  margin: 1rem 0;
`;

const BottomGroup = styled.div`
  margin-top: 1em;
`;

const tittel = (stopped: boolean) => {
  return stopped ? texts.stoppedTittel : texts.notStoppedTittel;
};

const PengestoppModal = ({
  isOpen,
  arbeidsgivere,
  toggle,
}: IPengestoppModal) => {
  const { valgtEnhet } = useValgtEnhet();
  const fnr = useValgtPersonident();
  const { isLoading, isError, isSuccess, mutate } = useFlaggPerson();

  const stoppAutomatikkInitialState = {
    sykmeldtFnr: { value: fnr },
    arsakList: [],
    virksomhetNr: [],
    enhetNr: { value: valgtEnhet },
  };

  const [employerError, setEmployerError] = useState<boolean>(false);
  const [aarsakError, setAarsakError] = useState<boolean>(false);
  const [stoppAutomatikk, setStoppAutomatikk] = useState<StoppAutomatikk>({
    ...stoppAutomatikkInitialState,
  });

  const submit = () => {
    if (stoppAutomatikk.virksomhetNr.length <= 0) {
      setEmployerError(true);
    } else if (stoppAutomatikk.arsakList.length <= 0) {
      setAarsakError(true);
    } else {
      mutate(stoppAutomatikk);
    }
  };

  const updateVirksomhetNr = (virksomhetNrList: VirksomhetNr[]) => {
    setStoppAutomatikk({
      ...stoppAutomatikk,
      virksomhetNr: virksomhetNrList,
      enhetNr: { value: valgtEnhet },
    });
  };

  const updateAarsakList = (arsakList: SykepengestoppArsak[]) => {
    setStoppAutomatikk({
      ...stoppAutomatikk,
      arsakList: arsakList,
    });
  };

  const handleChangeVirksomhet = (e: ChangeEvent<HTMLInputElement>) => {
    const orgnr: VirksomhetNr = {
      value: e.target.name,
    };

    if (e.target.checked) {
      setEmployerError(false);
      updateVirksomhetNr([...stoppAutomatikk.virksomhetNr, orgnr]);
    } else {
      const virksomhetListWithoutSelection =
        stoppAutomatikk.virksomhetNr.filter((virksomhetNr: VirksomhetNr) => {
          return virksomhetNr.value !== orgnr.value;
        });
      updateVirksomhetNr(virksomhetListWithoutSelection);
    }
  };

  const handleChangeArsak = (e: ChangeEvent<HTMLInputElement>) => {
    const newArsakType: SykepengestoppArsakType =
      SykepengestoppArsakType[e.target.name];
    const newArsak = { type: newArsakType };

    if (e.target.checked) {
      setAarsakError(false);
      updateAarsakList([...stoppAutomatikk.arsakList, newArsak]);
    } else {
      const aarsakListWithoutSelection = stoppAutomatikk.arsakList.filter(
        (arsak: SykepengestoppArsak) => {
          return newArsak.type !== arsak.type;
        }
      );
      updateAarsakList(aarsakListWithoutSelection);
    }
  };

  const handleCloseModal = () => {
    setStoppAutomatikk({ ...stoppAutomatikkInitialState });
    setEmployerError(false);
    setAarsakError(false);

    toggle();
  };

  return (
    <StyledModal
      aria-label={texts.stansSykepenger}
      open={isOpen}
      onClose={handleCloseModal}
    >
      <Modal.Content>
        <Systemtittel>{tittel(isSuccess)}</Systemtittel>

        {!isSuccess ? (
          <>
            <Group>
              <CheckboxGruppe
                legend={texts.arbeidsgiver}
                feil={employerError && texts.submitError}
              >
                {arbeidsgivere.map(
                  (arbeidsgiver: Arbeidsgiver, index: number) => {
                    return (
                      <Checkbox
                        key={index}
                        label={arbeidsgiver.navn}
                        onChange={handleChangeVirksomhet}
                        name={arbeidsgiver.orgnummer}
                      />
                    );
                  }
                )}
              </CheckboxGruppe>
            </Group>
            <Group>
              <CheckboxGruppe
                legend={texts.arsak.title}
                feil={aarsakError && texts.arsak.submitError}
              >
                {sykepengestoppArsakTekstListe.map((arsak, index: number) => {
                  return (
                    <Checkbox
                      key={index}
                      label={arsak.text}
                      onChange={handleChangeArsak}
                      name={arsak.type}
                    />
                  );
                })}
              </CheckboxGruppe>
            </Group>
            <Knapp type="flat" onClick={handleCloseModal}>
              {texts.avbryt}
            </Knapp>
            <Knapp
              type="hoved"
              mini
              spinner={isLoading}
              autoDisableVedSpinner
              onClick={submit}
            >
              {texts.send}
            </Knapp>
          </>
        ) : (
          <>
            <Group>
              <AlertStripeInfo>
                <p>{texts.stoppedInfo}</p>
                <p>{texts.seServicerutinen}</p>
              </AlertStripeInfo>
            </Group>
          </>
        )}
        {isError && (
          <BottomGroup>
            <Feilmelding>{texts.serverError}</Feilmelding>
          </BottomGroup>
        )}
      </Modal.Content>
    </StyledModal>
  );
};

export default PengestoppModal;
