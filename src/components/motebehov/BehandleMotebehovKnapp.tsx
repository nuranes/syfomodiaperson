import React, { useState } from "react";
import { Checkbox } from "nav-frontend-skjema";
import {
  erMotebehovBehandlet,
  fjernBehandledeMotebehov,
  fjerneDuplikatInnsendereMotebehov,
  harUbehandletMotebehov,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
  toMotebehovTilbakemeldingDTO,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useBehandleMotebehov } from "@/data/motebehov/useBehandleMotebehov";
import navFarger from "nav-frontend-core";
import { Button, Panel, Radio, RadioGroup, ReadMore } from "@navikt/ds-react";
import styled from "styled-components";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { useBehandleMotebehovAndSendTilbakemelding } from "@/data/motebehov/useBehandleMotebehovAndSendTilbakemelding";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
  radioLegend: "Vurder møtebehov og fjern oppgaven",
  vurdertUtenTilbakemelding: "Jeg har vurdert møtebehovet",
  vurdertMedTilbakemelding:
    "Jeg har vurdert møtebehovet og vil gi tilbakemelding til innmelder(e)",
  tilbakemeldingHeader:
    "Vi sender en automatisk tilbakemelding til innmelder. Klikk her om du vil se hele teksten.",
  tilbakemelding:
    "Vi har mottatt ditt ønske om dialogmøte med NAV. Vi vurderer at det på nåværende tidspunkt ikke er aktuelt at NAV kaller inn til et dialogmøte. Du kan når som helst melde inn et nytt behov i sykefraværsperioden.",
};

const CheckboxPanel = styled(Panel)`
  border: 1px solid ${navFarger.navGra20};
`;

const behandleMotebehovKnappLabel = (
  erBehandlet: boolean,
  sistBehandletMotebehov?: MotebehovVeilederDTO
): string => {
  return erBehandlet
    ? `Ferdigbehandlet av ${
        sistBehandletMotebehov?.behandletVeilederIdent
      } ${toDatePrettyPrint(sistBehandletMotebehov?.behandletTidspunkt)}`
    : texts.fjernOppgave;
};

interface BehandleMotebehovKnappProps {
  motebehovData: MotebehovVeilederDTO[];
}

const BehandleMotebehovKnapp = ({
  motebehovData,
}: BehandleMotebehovKnappProps) => {
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const ubehandledeMotebehov = fjernBehandledeMotebehov(motebehovListe);
  const unikeInnsendereUbehandledeMotebehov =
    fjerneDuplikatInnsendereMotebehov(ubehandledeMotebehov);
  const erBehandlet = erMotebehovBehandlet(motebehovListe);
  const behandleMotebehov = useBehandleMotebehov();
  const behandleMotebehovAndSendTilbakemelding =
    useBehandleMotebehovAndSendTilbakemelding();
  const [isTilbakemelding, setIsTilbakemelding] = useState(false);

  const tilbakemeldinger = unikeInnsendereUbehandledeMotebehov.map(
    (motebehov) => toMotebehovTilbakemeldingDTO(motebehov, texts.tilbakemelding)
  );

  if (!erBehandlet) {
    return (
      <>
        <FlexRow bottomPadding={PaddingSize.SM}>
          <RadioGroup
            defaultValue={false}
            size="small"
            legend={texts.radioLegend}
            onChange={(value) => setIsTilbakemelding(value)}
          >
            <Radio value={false}>{texts.vurdertUtenTilbakemelding}</Radio>
            <Radio value={true}>{texts.vurdertMedTilbakemelding}</Radio>
          </RadioGroup>
        </FlexRow>
        {isTilbakemelding && (
          <FlexRow bottomPadding={PaddingSize.SM}>
            <ReadMore size="small" header={texts.tilbakemeldingHeader}>
              {texts.tilbakemelding}
            </ReadMore>
          </FlexRow>
        )}
        <FlexRow>
          {(behandleMotebehov.isError ||
            behandleMotebehovAndSendTilbakemelding.isError) && (
            <SkjemaInnsendingFeil
              error={
                behandleMotebehov.error ||
                behandleMotebehovAndSendTilbakemelding.isError
              }
            />
          )}
          <Button
            loading={
              behandleMotebehovAndSendTilbakemelding.isLoading ||
              behandleMotebehov.isLoading
            }
            onClick={() => {
              if (isTilbakemelding) {
                behandleMotebehovAndSendTilbakemelding.mutate(tilbakemeldinger);
              } else {
                behandleMotebehov.mutate();
              }
            }}
          >
            Send
          </Button>
        </FlexRow>
      </>
    );
  }

  return motebehovListe.length > 0 ? (
    <CheckboxPanel>
      <Checkbox
        label={behandleMotebehovKnappLabel(erBehandlet, sistBehandletMotebehov)}
        onClick={() => {
          if (harUbehandletMotebehov(motebehovListe)) {
            behandleMotebehov.mutate();
          }
        }}
        id="marker__utfoert"
        disabled={erBehandlet || behandleMotebehov.isLoading}
        defaultChecked={erBehandlet}
      />
    </CheckboxPanel>
  ) : null;
};

export default BehandleMotebehovKnapp;
