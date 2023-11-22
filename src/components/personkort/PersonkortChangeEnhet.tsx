import React, { useState } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import styled from "styled-components";
import { useChangeEnhet } from "@/components/personkort/useChangeEnhet";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const texts = {
  endre: "Endre til",
  toUtland: {
    contentModal1:
      "Hvis du ikke har tilgang til NAV utland, vil du miste tilgangen til denne personen når enheten endres.",
    contentModal2:
      "Veiledere med tilgang til NAV utland kan senere flytte personen tilbake til geografisk enhet.",
  },
  toGeografisk: {
    contentModal1:
      "Hvis du ikke har tilgang til den geografiske enheten, vil du miste tilgangen til denne personen når enheten endres.",
    contentModal2:
      "Veiledere med tilgang til geografisk enhet kan senere flytte personen tilbake til NAV Utland.",
  },
};

const NAV_UTLAND = "0393";

const ButtonGroup = styled.div`
  > * {
    margin-right: 1em;
  }
`;

interface PersonkortChangeEnhetProps {
  behandlendeEnhet: BehandlendeEnhet;
}

const PersonkortChangeEnhet = ({
  behandlendeEnhet,
}: PersonkortChangeEnhetProps) => {
  const [open, setOpen] = useState(false);
  const fnr = useValgtPersonident();
  const changeEnhet = useChangeEnhet(fnr);

  const isCurrentlyNavUtland = behandlendeEnhet.enhetId === NAV_UTLAND;
  const heading = `${texts.endre} ${
    isCurrentlyNavUtland ? "geografisk enhet" : "NAV utland"
  }`;

  const modalText1 = isCurrentlyNavUtland
    ? texts.toGeografisk.contentModal1
    : texts.toUtland.contentModal1;
  const modalText2 = isCurrentlyNavUtland
    ? texts.toGeografisk.contentModal2
    : texts.toUtland.contentModal2;

  const updateEnhet = () => {
    changeEnhet.mutate({
      personident: fnr,
      isNavUtland: !isCurrentlyNavUtland,
    });
    setOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {heading}
      </Button>
      <Modal
        closeOnBackdropClick
        className="max-w-2xl"
        open={open}
        aria-label="Modal endre enhet"
        onClose={() => setOpen(false)}
        aria-labelledby="modal-heading"
      >
        <Modal.Header>
          <Heading spacing level="1" size="large" id="modal-heading">
            {heading}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <BodyLong as={"div"} spacing={true}>
            <p>{modalText1}</p>
            <p>{modalText2}</p>
          </BodyLong>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="danger" onClick={updateEnhet}>
              {heading}
            </Button>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PersonkortChangeEnhet;
