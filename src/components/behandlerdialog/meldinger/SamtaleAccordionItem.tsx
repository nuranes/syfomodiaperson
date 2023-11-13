import React from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Accordion } from "@navikt/ds-react";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import { StetoskopIkon } from "../../../../img/ImageComponents";
import { useBehandlerNavn } from "@/hooks/behandler/useBehandlerNavn";
import { SamtaleTags } from "@/components/behandlerdialog/meldinger/SamtaleTags";
import { FlexRow } from "@/components/Layout";

interface SamtaleAccordionItemProps {
  meldinger: MeldingDTO[];
}

interface BehandlerNavnProps {
  behandlerRef: string;
}

const BehandlerNavn = ({ behandlerRef }: BehandlerNavnProps) => {
  const navn = useBehandlerNavn(behandlerRef);
  return <>{navn}</>;
};

export const SamtaleAccordionItem = ({
  meldinger,
}: SamtaleAccordionItemProps) => {
  const firstMelding = meldinger[0];
  const behandlerRef = firstMelding.behandlerRef;
  const newestMelding = meldinger.slice(-1)[0];
  const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
    newestMelding.tidspunkt
  )}`;

  return (
    <Accordion.Item>
      <Accordion.Header>
        <FlexRow>
          <img
            className={"mr-2"}
            src={StetoskopIkon}
            alt="Stetoskopikon for behandler"
          />
          <>
            {behandlerRef ? (
              <BehandlerNavn behandlerRef={behandlerRef} />
            ) : (
              firstMelding.behandlerNavn
            )}
            {` ${dateAndTimeForNewestMelding}`}
          </>
          <SamtaleTags meldinger={meldinger} />
        </FlexRow>
      </Accordion.Header>
      <Accordion.Content>
        <MeldingerISamtale meldinger={meldinger} />
      </Accordion.Content>
    </Accordion.Item>
  );
};
