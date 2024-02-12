import React from "react";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { NoNarmesteLederAlert } from "@/sider/mote/components/innkalling/NoNarmestLederAlert";
import { VirksomhetChooser } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetChooser";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { BodyShort, Label } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import { DialogmoteInnkallingSkjemaValues } from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { validerArbeidsgiver } from "@/utils/valideringUtils";

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
  const defaultVirksomhet =
    virksomheter.length === 1 ? virksomheter[0] : undefined;
  const { field, fieldState } = useController<
    DialogmoteInnkallingSkjemaValues,
    "arbeidsgiver"
  >({
    name: "arbeidsgiver",
    defaultValue: defaultVirksomhet,
    rules: {
      validate: (value) => validerArbeidsgiver(value),
    },
  });

  const virksomhetsnummer = field.value || "";
  const isVirksomhetChosen =
    virksomhetsnummer.length > 0 && virksomhetsnummer !== "VELG";
  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    virksomhetsnummer
  );
  const noNarmesteLeder = !narmesteLeder;

  return (
    <div className="mb-2">
      <VirksomhetChooser
        defaultVirksomhet={defaultVirksomhet}
        velgVirksomhet={field.onChange}
        virksomheter={virksomheter}
        label={texts.selectLabel}
        error={fieldState.error?.message}
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
      {isVirksomhetChosen && noNarmesteLeder && virksomheter.length > 0 && (
        <NoNarmesteLederAlert />
      )}
    </div>
  );
};
export default DialogmoteInnkallingVelgVirksomhet;
