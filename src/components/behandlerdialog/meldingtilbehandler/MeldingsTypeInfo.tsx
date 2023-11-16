import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
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

interface InfoElementProps {
  icon: string;
  text: string;
}

const InfoElement = ({ icon, text }: InfoElementProps) => {
  return (
    <>
      <img src={icon} className="mr-4 w-12" alt="Ikon for meldingstypen" />
      <BodyShort size={"small"}>{text}</BodyShort>
    </>
  );
};

interface MeldingsTypeInfoProps {
  meldingType: MeldingType;
}

export const MeldingsTypeInfo = ({
  meldingType,
}: MeldingsTypeInfoProps): ReactElement | null => {
  const Info = () => {
    switch (meldingType) {
      case MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER:
        return (
          <InfoElement icon={BlyantImage} text={texts.tilleggsopplysinger} />
        );
      case MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING:
        return (
          <InfoElement icon={BlueDocumentImage} text={texts.legeerklaring} />
        );
      case MeldingType.HENVENDELSE_MELDING_FRA_NAV:
        return <InfoElement icon={BlyantImage} text={texts.meldingFraNAV} />;
      case MeldingType.FORESPORSEL_PASIENT_PAMINNELSE:
      case MeldingType.HENVENDELSE_RETUR_LEGEERKLARING:
      case MeldingType.HENVENDELSE_MELDING_TIL_NAV:
        return null;
    }
  };

  return (
    <div className="flex flex-row items-center">
      <Info />
    </div>
  );
};
