import React, { useState } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import styled from "styled-components";
import { useChangeEnhet } from "@/components/personkort/useChangeEnhet";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const texts = {
  endre: "Endre til",
  contentModal1:
    "Hvis du ikke har tilgang til NAV utland, vil du miste tilgangen til denne personen når enheten endres.",
  contentModal2:
    "Veiledere med tilgang til NAV utland kan senere flytte personen tilbake til geografisk enhet.",
};

const NAV_UTLAND = "0393";

const StyledModal = styled(Modal)`
  max-width: 638px;
`;

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
      <StyledModal
        open={open}
        aria-label="Modal endre enhet"
        onClose={() => setOpen(false)}
        closeButton={false}
        aria-labelledby="modal-heading"
      >
        <Modal.Content>
          <Heading spacing level="1" size="large" id="modal-heading">
            {heading}
          </Heading>
          <BodyLong as={"div"} spacing={true}>
            <p>{texts.contentModal1}</p>
            <p>{texts.contentModal2}</p>
          </BodyLong>
          <ButtonGroup>
            <Button variant="danger" onClick={updateEnhet}>
              {heading}
            </Button>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
          </ButtonGroup>
        </Modal.Content>
      </StyledModal>
    </>
  );
};

export default PersonkortChangeEnhet;
