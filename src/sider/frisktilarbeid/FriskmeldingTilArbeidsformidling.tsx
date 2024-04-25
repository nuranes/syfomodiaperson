import React, { ReactElement, useState } from "react";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { Box, Stepper } from "@navikt/ds-react";
import { VurderVedtak } from "@/sider/frisktilarbeid/VurderVedtak";
import dayjs from "dayjs";
import { FattVedtak } from "@/sider/frisktilarbeid/FattVedtak";
import { VedtakVenter } from "@/sider/frisktilarbeid/VedtakVenter";
import { AvsluttOppgave } from "@/sider/frisktilarbeid/AvsluttOppgave";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

enum Step {
  "FORBEREDELSER" = 1,
  "FATT_VEDTAK",
  "VENTER",
  "AVSLUTT",
}

const steps: {
  [key in Step]: string;
} = {
  [Step.FORBEREDELSER]: "Forberedelser",
  [Step.FATT_VEDTAK]: "Fatt vedtak",
  [Step.VENTER]: "Venter på dato",
  [Step.AVSLUTT]: "Avslutt oppgave",
};

export const FriskmeldingTilArbeidsformidling = (): ReactElement => {
  const { data } = useVedtakQuery();
  const [vurderVedtakStarted, setVurderVedtakStarted] = useState(false);
  const vedtak: VedtakResponseDTO | undefined = data[0];

  const calculateActiveStep = (): Step => {
    if (!vedtak) {
      return !vurderVedtakStarted ? Step.FORBEREDELSER : Step.FATT_VEDTAK;
    } else {
      const vedtakStartsAfterTomorrow = dayjs(vedtak.fom)
        .startOf("day")
        .isAfter(dayjs().add(1, "days").startOf("day"));

      return vedtakStartsAfterTomorrow ? Step.VENTER : Step.AVSLUTT;
    }
  };

  const activeStep = calculateActiveStep();

  return (
    <div className="flex flex-col gap-4">
      <Box background="surface-default" padding="6">
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          interactive={false}
        >
          {Object.keys(steps).map((step, index) => {
            const label = steps[step];
            return (
              <Stepper.Step
                aria-label={label}
                key={index}
                href="#"
                completed={activeStep > parseInt(step)}
              >
                {label}
              </Stepper.Step>
            );
          })}
        </Stepper>
      </Box>
      {(() => {
        switch (activeStep) {
          case Step.FORBEREDELSER:
            return (
              <VurderVedtak onClick={() => setVurderVedtakStarted(true)} />
            );
          case Step.FATT_VEDTAK:
            return <FattVedtak />;
          case Step.VENTER:
            return <VedtakVenter vedtak={vedtak} />;
          case Step.AVSLUTT:
            return <AvsluttOppgave />;
        }
      })()}
    </div>
  );
};
