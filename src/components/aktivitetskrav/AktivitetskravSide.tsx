import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { StartNyVurdering } from "./vurdering/StartNyVurdering";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";
import { TREDELING_BREAKING_POINT } from "@/sider/TredeltSide";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";

const texts = {
  noTilfelle:
    "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

interface AktivitetskravSideProps {
  heightStyling: string;
  screenWidth: number;
}

export const AktivitetskravSide = ({
  heightStyling,
  screenWidth,
}: AktivitetskravSideProps) => {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskrav = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
      aktivitetskrav.status !== AktivitetskravStatus.LUKKET
  );
  const showStartNyVurdering = !aktivitetskrav || aktivitetskrav.inFinalState;

  return (
    <div
      className="w-full"
      style={
        screenWidth > TREDELING_BREAKING_POINT
          ? {
              height: heightStyling,
              overflowY: "scroll",
            }
          : { overflowY: "unset" }
      }
    >
      {!hasActiveOppfolgingstilfelle && (
        <AktivitetskravAlertstripe variant="warning" size="small">
          {texts.noTilfelle}
        </AktivitetskravAlertstripe>
      )}
      {showStartNyVurdering ? (
        <StartNyVurdering aktivitetskrav={aktivitetskrav} />
      ) : (
        <VurderAktivitetskrav aktivitetskrav={aktivitetskrav} />
      )}
      <AktivitetskravHistorikk />
    </div>
  );
};
