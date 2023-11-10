import React from "react";
import { BodyShort, Button, Heading, Panel } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useCreateAktivitetskrav } from "@/data/aktivitetskrav/useCreateAktivitetskrav";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { GjelderOppfolgingstilfelle } from "@/components/aktivitetskrav/GjelderOppfolgingstilfelle";

export const texts = {
  header: "Start ny aktivitetskrav-vurdering",
  noAktivitetskrav:
    "Aktivitetskravet er ikke tidligere vurdert i dette sykefraværet.",
  button: "Start ny vurdering",
};

export const StartNyVurdering = () => {
  const { hasActiveOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const createAktivitetskrav = useCreateAktivitetskrav();
  const handleStartNyVurdering = () => {
    createAktivitetskrav.mutate();
  };

  return (
    <Panel className="mb-4 flex flex-col p-8">
      <Heading level="2" size="large" className="mb-1">
        {texts.header}
      </Heading>
      {hasActiveOppfolgingstilfelle && (
        <GjelderOppfolgingstilfelle
          oppfolgingstilfelle={latestOppfolgingstilfelle}
        />
      )}
      <BodyShort className="mb-4">{texts.noAktivitetskrav}</BodyShort>
      {createAktivitetskrav.isError && (
        <SkjemaInnsendingFeil error={createAktivitetskrav.error} />
      )}
      <Button
        variant="secondary"
        className="mr-auto"
        loading={createAktivitetskrav.isLoading}
        onClick={handleStartNyVurdering}
      >
        {texts.button}
      </Button>
    </Panel>
  );
};
