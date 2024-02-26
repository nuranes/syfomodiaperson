import { getWebInstrumentations, initializeFaro } from "@grafana/faro-react";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { erLokal, erPreProd } from "@/utils/miljoUtil";

const getUrl = () => {
  if (erLokal()) {
    return "/collect";
  } else if (erPreProd()) {
    return "https://telemetry.ekstern.dev.nav.no/collect";
  } else {
    return "https://telemetry.nav.no/collect";
  }
};

export const initFaro = () =>
  initializeFaro({
    url: getUrl(),
    app: { name: "syfomodiaperson" },
    paused: erLokal(),
    instrumentations: [
      ...getWebInstrumentations({ captureConsole: false }),
      new TracingInstrumentation(),
    ],
  });
