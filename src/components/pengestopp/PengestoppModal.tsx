import * as React from "react";
import { useState } from "react";
import {
  Arbeidsgiver,
  StoppAutomatikk,
  SykepengestoppArsak,
  SykepengestoppArsakType,
  VirksomhetNr,
} from "@/data/pengestopp/types/FlaggPerson";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useFlaggPerson } from "@/data/pengestopp/useFlaggPerson";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  ErrorMessage,
  Heading,
  Modal,
} from "@navikt/ds-react";

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
  onModalClose(): void;
}

interface SykepengestoppArsakTekst {
  type: SykepengestoppArsakType;
  text: string;
  selectable: boolean;
}

export const sykepengestoppArsakTekstListe: SykepengestoppArsakTekst[] = [
  {
    type: SykepengestoppArsakType.BESTRIDELSE_SYKMELDING,
    text: "Bestridelse av sykmelding (§ 8-4 første ledd)",
    selectable: false,
  },
  {
    type: SykepengestoppArsakType.MEDISINSK_VILKAR,
    text: "Medisinsk vilkår (§ 8-4 første ledd)",
    selectable: true,
  },
  {
    type: SykepengestoppArsakType.TILBAKEDATERT_SYKMELDING,
    text: "Tilbakedatert sykmelding (§ 8-7)",
    selectable: false,
  },
  {
    type: SykepengestoppArsakType.MANGLENDE_MEDVIRKING,
    text: "Manglende medvirkning (§ 8-8 første ledd)",
    selectable: true,
  },
  {
    type: SykepengestoppArsakType.AKTIVITETSKRAV,
    text: "Aktivitetskravet (§ 8-8 andre ledd)",
    selectable: true,
  },
];

const tittel = (stopped: boolean) => {
  return stopped ? texts.stoppedTittel : texts.notStoppedTittel;
};

const PengestoppModal = ({
  isOpen,
  arbeidsgivere,
  onModalClose,
}: IPengestoppModal) => {
  const { valgtEnhet } = useValgtEnhet();
  const fnr = useValgtPersonident();
  const { isPending, isError, isSuccess, mutate } = useFlaggPerson();

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

  const handleChangeVirksomheter = (values: string[]) => {
    setEmployerError(values.length === 0);
    updateVirksomhetNr(values.map((value) => ({ value })));
  };

  const handleChangeArsaker = (values: SykepengestoppArsakType[]) => {
    setAarsakError(values.length === 0);
    updateAarsakList(values.map((value) => ({ type: value })));
  };

  const handleCloseModal = () => {
    setStoppAutomatikk({ ...stoppAutomatikkInitialState });
    setEmployerError(false);
    setAarsakError(false);

    onModalClose();
  };

  return (
    <Modal
      closeOnBackdropClick
      className="p-8 max-w-4xl w-full"
      aria-label={texts.stansSykepenger}
      open={isOpen}
      onClose={handleCloseModal}
    >
      <Modal.Header>
        <Heading size="medium">{tittel(isSuccess)}</Heading>
      </Modal.Header>
      <Modal.Body>
        {!isSuccess ? (
          <>
            <CheckboxGroup
              className="my-4"
              legend={texts.arbeidsgiver}
              onChange={handleChangeVirksomheter}
              error={employerError && texts.submitError}
            >
              {arbeidsgivere.map(
                (arbeidsgiver: Arbeidsgiver, index: number) => (
                  <Checkbox key={index} value={arbeidsgiver.orgnummer}>
                    {arbeidsgiver.navn}
                  </Checkbox>
                )
              )}
            </CheckboxGroup>
            <CheckboxGroup
              className="my-4"
              legend={texts.arsak.title}
              onChange={handleChangeArsaker}
              error={aarsakError && texts.arsak.submitError}
            >
              {sykepengestoppArsakTekstListe
                .filter(({ selectable }) => selectable)
                .map((arsak, index: number) => (
                  <Checkbox key={index} value={arsak.type}>
                    {arsak.text}
                  </Checkbox>
                ))}
            </CheckboxGroup>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleCloseModal}>
                {texts.avbryt}
              </Button>
              <Button variant="primary" onClick={submit} loading={isPending}>
                {texts.send}
              </Button>
            </div>
          </>
        ) : (
          <Alert variant="info" className="my-4">
            <p>{texts.stoppedInfo}</p>
            <p>{texts.seServicerutinen}</p>
          </Alert>
        )}
        {isError && (
          <ErrorMessage className="mt-4">{texts.serverError}</ErrorMessage>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PengestoppModal;
