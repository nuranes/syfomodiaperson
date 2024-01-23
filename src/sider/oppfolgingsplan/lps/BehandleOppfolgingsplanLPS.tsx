import React from "react";
import Knapp from "nav-frontend-knapper";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { StatusKanImage } from "../../../../img/ImageComponents";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";

interface BehandleOppfolgingsplanLPSProps {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

const texts = {
  marker: "Marker som behandlet",
};

const BehandleOppfolgingsplanLPS = ({
  oppfolgingsplanLPS,
}: BehandleOppfolgingsplanLPSProps) => {
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const personoppgave = personoppgaver.find(
    (personoppgave) => personoppgave.referanseUuid === oppfolgingsplanLPS.uuid
  );
  const behandlePersonoppgave = useBehandlePersonoppgave();

  return (
    <>
      {personoppgave && !personoppgave.behandletTidspunkt && (
        <Knapp
          autoDisableVedSpinner
          onClick={() => behandlePersonoppgave.mutate(personoppgave.uuid)}
          spinner={behandlePersonoppgave.isPending}
          id="behandle_personoppgave"
          mini
        >
          {texts.marker}
        </Knapp>
      )}
      {personoppgave && personoppgave.behandletTidspunkt && (
        <p>
          <span className="ferdigbehandlet__ikon">
            <img src={StatusKanImage} alt="Ferdig behandlet" />
          </span>{" "}
          {`Ferdigbehandlet: ${toDatePrettyPrint(
            personoppgave.behandletTidspunkt
          )} av ${personoppgave.behandletVeilederIdent}`}
        </p>
      )}
    </>
  );
};

export default BehandleOppfolgingsplanLPS;
