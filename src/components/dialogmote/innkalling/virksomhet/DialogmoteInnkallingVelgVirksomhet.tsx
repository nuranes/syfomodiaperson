import React from "react";
import { Input, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import styled from "styled-components";
import { FlexColumn, FlexRow, PaddingSize } from "../../../Layout";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { NoNarmesteLederAlert } from "@/components/mote/NoNarmestLederAlert";
import { VirksomhetChooser } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetChooser";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  title: "Arbeidsgiver",
  selectLabel: "Arbeidsgiver",
  navnLabel: "Nærmeste leder",
  epostLabel: "Epost",
};

const LederNavnColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

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
              />
              <SkjemaelementFeilmelding>
                {meta.submitFailed && meta.error}
              </SkjemaelementFeilmelding>
              {narmesteLeder && (
                <FlexRow topPadding={PaddingSize.SM}>
                  <LederNavnColumn flex={0.2}>
                    <Input
                      bredde="L"
                      label={texts.navnLabel}
                      disabled
                      value={narmesteLeder.narmesteLederNavn}
                    />
                  </LederNavnColumn>
                  <FlexColumn flex={1}>
                    <Input
                      bredde="L"
                      label={texts.epostLabel}
                      disabled
                      value={narmesteLeder.narmesteLederEpost}
                    />
                  </FlexColumn>
                </FlexRow>
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
