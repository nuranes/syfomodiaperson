import React, { useState } from "react";
import { Innholdstittel, Normaltekst } from "nav-frontend-typografi";
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
import Hjelpetekst from "nav-frontend-hjelpetekst";
import styled from "styled-components";
import { PopoverOrientering } from "nav-frontend-popover";

export const texts = {
  header: "Vurdere aktivitetskravet",
  helptext1:
    "Vurderingen (Avventer, sett unntak, er i aktivitet, ikke oppfylt, ikke aktuell) gjøres i to trinn.",
  helptext2: "Ved klikk legger du inn informasjon rundt vurderingen.",
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
        <Innholdstittel>{texts.header}</Innholdstittel>
        <HjelpetekstColumn justifyContent={JustifyContentType.CENTER}>
          <Hjelpetekst type={PopoverOrientering.Hoyre}>
            <Normaltekst>{texts.helptext1}</Normaltekst>
            <Normaltekst>{texts.helptext2}</Normaltekst>
          </Hjelpetekst>
        </HjelpetekstColumn>
      </FlexRow>
      {oppfolgingstilfelle && (
        <FlexRow>
          <Normaltekst>{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
            oppfolgingstilfelle.start,
            oppfolgingstilfelle.end
          )}`}</Normaltekst>
        </FlexRow>
      )}
      <VurderAktivitetskravButtons
        onButtonClick={visVurderingAktivitetskravModalForType}
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
