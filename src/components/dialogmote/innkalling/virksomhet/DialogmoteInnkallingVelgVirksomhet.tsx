import React from "react";
import { Field } from "react-final-form";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { NoNarmesteLederAlert } from "@/components/mote/NoNarmestLederAlert";
import { VirksomhetChooser } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetChooser";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { BodyShort, Label } from "@navikt/ds-react";

const texts = {
  title: "Arbeidsgiver",
  selectLabel: "Arbeidsgiver",
  navnLabel: "Nærmeste leder",
  epostLabel: "Epost",
};

const DialogmoteInnkallingVelgVirksomhet = () => {
  const { currentLedere } = useLedereQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const virksomheterFromTilfelle =
    latestOppfolgingstilfelle?.virksomhetsnummerList || [];
  const virksomheterFromCurentLedere = currentLedere.map(
    (leder) => leder.virksomhetsnummer
  );
  const virksomheterWithDuplicates = virksomheterFromTilfelle.concat(
    virksomheterFromCurentLedere
  );
  const virksomheter = [...new Set(virksomheterWithDuplicates)];

  const field = "arbeidsgiver";

  return (
    <div className="mb-2">
      <Field<string> name={field}>
        {({ input, meta }) => {
          const virksomhetsnummer = input.value;
          const isVirksomhetChosen =
            virksomhetsnummer.length > 0 && virksomhetsnummer !== "VELG";
          const narmesteLeder = narmesteLederForVirksomhet(
            currentLedere,
            virksomhetsnummer
          );
          const noNarmesteLeder = !narmesteLeder;

          return (
            <>
              <VirksomhetChooser
                velgVirksomhet={input.onChange}
                virksomheter={virksomheter}
                id={field}
                label={texts.selectLabel}
                name={field}
                error={meta.submitFailed && meta.error}
              />
              {narmesteLeder && (
                <div className="flex gap-8 mb-8">
                  <div className="flex flex-col flex-[0.2]">
                    <Label size="small">{texts.navnLabel}</Label>
                    <BodyShort>{narmesteLeder.narmesteLederNavn}</BodyShort>
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label size="small">{texts.epostLabel}</Label>
                    <BodyShort>{narmesteLeder.narmesteLederEpost}</BodyShort>
                  </div>
                </div>
              )}
              {isVirksomhetChosen &&
                noNarmesteLeder &&
                virksomheter.length > 0 && <NoNarmesteLederAlert />}
            </>
          );
        }}
      </Field>
    </div>
  );
};
export default DialogmoteInnkallingVelgVirksomhet;
