import { SporsmalDTO } from "./SporsmalDTO";
import { ArbeidsgiverStatusDTO } from "./ArbeidsgiverStatusDTO";
import { NyeSykmeldingStatuser } from "@/utils/sykmeldinger/sykmeldingstatuser";

export interface SykmeldingStatusDTO {
  readonly statusEvent: NyeSykmeldingStatuser;
  readonly timestamp: string;
  readonly arbeidsgiver?: ArbeidsgiverStatusDTO;
  readonly sporsmalOgSvarListe: SporsmalDTO[];
}
