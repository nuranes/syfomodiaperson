import React, { useState } from "react";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import { FlexColumn, FlexRow, JustifyContentType } from "@/components/Layout";
import {
  ModalType,
  VurderAktivitetskravModal,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import styled from "styled-components";
import { BodyShort, Heading, HelpText } from "@navikt/ds-react";

export const texts = {
  header: "Vurdere aktivitetskravet",
  helptext:
    "Vurderingen (Avventer, sett unntak, er i aktivitet, ikke oppfylt, ikke aktuell) gjøres i to trinn. Ved klikk legger du inn informasjon rundt vurderingen.",
};

const HjelpetekstColumn = styled(FlexColumn)`
  margin-left: 0.5em;
`;

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
  oppfolgingstilfelle,
}: VurderAktivitetskravProps) => {
  const [visVurderAktivitetskravModal, setVisVurderAktivitetskravModal] =
    useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const visVurderingAktivitetskravModalForType = (modalType: ModalType) => {
    setModalType(modalType);
    setVisVurderAktivitetskravModal(true);
  };

  return (
    <AktivitetskravPanel>
      <FlexRow>
        <Heading level="2" size="large">
          {texts.header}
        </Heading>
        <HjelpetekstColumn justifyContent={JustifyContentType.CENTER}>
          <HelpText placement="right">
            <BodyShort size="small">{texts.helptext}</BodyShort>
          </HelpText>
        </HjelpetekstColumn>
      </FlexRow>
      {oppfolgingstilfelle && (
        <FlexRow>
          <BodyShort size="small">{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
            oppfolgingstilfelle.start,
            oppfolgingstilfelle.end
          )}`}</BodyShort>
        </FlexRow>
      )}
      <VurderAktivitetskravButtons
        onButtonClick={visVurderingAktivitetskravModalForType}
        aktivitetskrav={aktivitetskrav}
      />
      <VurderAktivitetskravModal
        isOpen={visVurderAktivitetskravModal}
        setModalOpen={setVisVurderAktivitetskravModal}
        modalType={modalType}
        aktivitetskravUuid={aktivitetskrav?.uuid}
      />
    </AktivitetskravPanel>
  );
};
