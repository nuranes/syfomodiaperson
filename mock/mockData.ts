import { motebehovMock } from "./syfomotebehov/motebehovMock";
import { brukerinfoMock } from "./syfoperson/brukerinfoMock";
import { historikkmotebehovMock } from "./syfomotebehov/historikkmotebehovMock";
import { historikkoppfolgingsplanMock } from "./syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { ledereMock } from "./isnarmesteleder/ledereMock";
import { dialogmoterMock } from "./isdialogmote/dialogmoterMock";
import { soknaderMock } from "./sykepengesoknad/soknaderMock";
import { sykmeldingerMock } from "./syfosmregister/sykmeldingerMock";
import { tilgangBrukerMock } from "./syfotilgangskontroll/tilgangtilbrukerMock";
import { virksomhetMock } from "./ereg/virksomhetMock";

export const mockData = {
  motebehovMock,
  brukerinfoMock,
  historikkmotebehovMock,
  historikkoppfolgingsplanMock,
  ledereMock,
  dialogmoterMock,
  soknaderMock,
  sykmeldingerMock,
  tilgangBrukerMock,
  virksomhetMock: virksomhetMock(),
};
