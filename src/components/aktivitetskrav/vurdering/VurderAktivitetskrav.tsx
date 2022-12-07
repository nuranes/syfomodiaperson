import React from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import { FlexRow, PaddingSize } from "@/components/Layout";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

export const VurderAktivitetskrav = () => {
  return (
    <>
      <AktivitetskravPanel>
        <FlexRow bottomPadding={PaddingSize.MD}>
          <Innholdstittel>{texts.header}</Innholdstittel>
        </FlexRow>
        <VurderAktivitetskravButtons />
        {/* TODO: Implement modal and button actions */}
      </AktivitetskravPanel>
    </>
  );
};
