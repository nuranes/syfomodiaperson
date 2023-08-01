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
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
        return <></>; // Not supported
    }
  };

  return (
    <InfoPanel>
      <Info />
    </InfoPanel>
  );
};
