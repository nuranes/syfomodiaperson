import { SykmeldingBehandlerDTO } from "@/data/sykmelding/types/SykmeldingBehandlerDTO";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { DialogmotedeltakerBehandlerDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { capitalizeWord } from "@/utils/stringUtils";

export const behandlerNavn = (
  behandler: SykmeldingBehandlerDTO | BehandlerDTO
): string => {
  return [behandler.fornavn, behandler.mellomnavn, behandler.etternavn]
    .filter(Boolean)
    .join(" ");
};

export const behandlerDeltokTekst = (
  behandler: DialogmotedeltakerBehandlerDTO,
  deltatt: boolean | undefined
): string =>
  `Behandler: ${behandler.behandlerNavn}${
    deltatt === false ? ", deltok ikke" : ""
  }`;

export const behandlerDisplayText = (behandler: BehandlerDTO): string => {
  const name = behandlerNavn(behandler);
  const type = !!behandler.type ? `${capitalizeWord(behandler.type)}:` : "";
  const typeAndName = `${type} ${name}`;
  const office = !!behandler.kontor ? capitalizeWord(behandler.kontor) : "";
  const phone = !!behandler.telefon ? `tlf ${behandler.telefon}` : "";

  return [typeAndName, office, phone].filter(Boolean).join(", ");
};
