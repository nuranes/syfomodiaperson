import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import styled from "styled-components";
import React, { ReactElement } from "react";
import {
  BlueDocumentImage,
  BlyantImage,
} from "../../../../img/ImageComponents";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  tilleggsopplysinger:
    "Tilleggsopplysninger vedrørende pasienten. Behandleren honoreres med takst L8.",
  legeerklaring:
    "Legeerklæring vedrørende pasienten. Behandleren honoreres med takst L40.",
  meldingFraNAV: "Melding fra NAV til behandler som ikke utløser takst.",
};

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: row;
`;

interface Props {
  meldingType: MeldingType;
}

export const MeldingsTypeInfo = ({ meldingType }: Props): ReactElement => {
  const Info = () => {
    switch (meldingType) {
      case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
        return (
          <>
            <Icon src={BlyantImage} />
            <BodyShort size={"small"}>{texts.tilleggsopplysinger}</BodyShort>
          </>
        );
      case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
        return (
          <>
            <Icon src={BlueDocumentImage} />
            <BodyShort size={"small"}>{texts.legeerklaring}</BodyShort>
          </>
        );
      case MeldingType.HENVENDELSE_MELDING_FRA_NAV:
        return (
          <>
            <Icon src={BlyantImage} />
            <BodyShort size={"small"}>{texts.meldingFraNAV}</BodyShort>
          </>
        );
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
      case MeldingType.HENVENDELSE_RETUR_LEGEERKLARING:
      case MeldingType.HENVENDELSE_MELDING_TIL_NAV:
        return <></>; // Not supported
    }
  };

  return (
    <InfoPanel>
      <Info />
    </InfoPanel>
  );
};
