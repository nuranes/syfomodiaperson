import { useRemoveOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useRemoveOppfolgingsoppgave";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  Tag,
  Tooltip,
} from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import React from "react";
import { OpenOppfolgingsoppgaveModalButton } from "@/components/oppfolgingsoppgave/OpenOppfolgingsoppgaveModalButton";
import { useGetOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useGetOppfolgingsoppgave";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { oppfolgingsgrunnToText } from "@/data/oppfolgingsoppgave/types";
import { Veileder } from "@/data/veilederinfo/types/Veileder";

const texts = {
  title: "Oppfølgingsoppgave",
  remove: "Fjern",
  removeTooltip: "Fjerner oppfølgingsoppgaven fra oversikten",
  createdBy: (veileder: Veileder, createdAt: Date) =>
    `Opprettet av: ${veileder.fulltNavn()} (${
      veileder.ident
    }), ${tilLesbarDatoMedArUtenManedNavn(createdAt)}`,
};

export const Oppfolgingsoppgave = () => {
  const removeOppfolgingsoppgave = useRemoveOppfolgingsoppgave();
  const { oppfolgingsoppgave } = useGetOppfolgingsoppgave();
  const { data: veilederinfo } = useVeilederInfoQuery(
    oppfolgingsoppgave?.createdBy ?? ""
  );
  const isExistingOppfolgingsoppgave = !!oppfolgingsoppgave;
  const handleRemoveOppfolgingsoppgave = (uuid: string) => {
    removeOppfolgingsoppgave.mutate(uuid);
  };

  const oppfolgingsgrunn = oppfolgingsoppgave?.oppfolgingsgrunn
    ? oppfolgingsgrunnToText[oppfolgingsoppgave.oppfolgingsgrunn]
    : null;

  const beskrivelse = oppfolgingsoppgave?.tekst
    ? oppfolgingsoppgave.tekst
    : null;

  const frist = oppfolgingsoppgave?.frist
    ? tilLesbarDatoMedArUtenManedNavn(oppfolgingsoppgave?.frist)
    : undefined;

  return isExistingOppfolgingsoppgave ? (
    <Box background={"surface-default"} padding="4" className="flex-1">
      {frist && (
        <Tag
          variant="warning"
          size="small"
          className="mb-4"
        >{`Frist: ${frist}`}</Tag>
      )}
      <Heading className="mb-2" size="xsmall">
        {texts.title}
      </Heading>
      {oppfolgingsgrunn && (
        <BodyShort className="mb-4">{oppfolgingsgrunn}</BodyShort>
      )}
      {beskrivelse && (
        <>
          <Heading className="mb-2" size="xsmall">
            {"Beskrivelse"}
          </Heading>
          <BodyShort className="mb-4">{beskrivelse}</BodyShort>
        </>
      )}
      <Tooltip content={texts.removeTooltip}>
        <Button
          type="button"
          icon={<TrashIcon aria-hidden />}
          variant={"primary-neutral"}
          onClick={() =>
            handleRemoveOppfolgingsoppgave(oppfolgingsoppgave.uuid)
          }
          loading={removeOppfolgingsoppgave.isPending}
          className={"ml-auto"}
          size={"small"}
        >
          {texts.remove}
        </Button>
      </Tooltip>
      {veilederinfo && (
        <BodyShort size="small" textColor="subtle" className="mt-2 text-xs">
          {texts.createdBy(veilederinfo, oppfolgingsoppgave.createdAt)}
        </BodyShort>
      )}
    </Box>
  ) : (
    <OpenOppfolgingsoppgaveModalButton />
  );
};
