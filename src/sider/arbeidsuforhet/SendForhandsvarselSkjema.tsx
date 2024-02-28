import React from "react";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow } from "@/components/Layout";
import { Box, Button, Heading, Textarea } from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { useArbeidsuforhetVarselDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVarselDocument";
import { Forhandsvisning } from "@/components/Forhandsvisning";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Begrunnelsen din blir en del av en større brevmal. Åpne forhåndsvisning for å se hele varselet.",
  helptexts: [
    "Skriv en kort setning om det er vilkåret om sykdom eller skade, arbeidsuførhet, eller årsakssammenheng mellom de to, som ikke er oppfylt. Skriv kort hvilke opplysninger som ligger til grunn for forhåndsvarsel.",
    "Skriv kort din vurdering av hvorfor vilkåret ikke er oppfylt.",
    "Hvis du har vurdert ordningen friskmelding til arbeidsformidling: skriv hvorfor ordningen ikke er aktuell og legg inn henvisning til §8-5.",
  ],
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
};

const forhandsvarselFrist = addWeeks(new Date(), 3);
const defaultValues = { begrunnelse: "" };
const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

export const SendForhandsvarselSkjema = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues });
  const { getForhandsvarselDocument } = useArbeidsuforhetVarselDocument();

  const submit = (values: SkjemaValues) => {
    console.log(values);
    // TODO: Mutate arbeidsuforhet (og sett loading på send-knappen)
  };

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)}>
        <Heading className="mt-4 mb-4" level="2" size="small">
          {texts.title}
        </Heading>
        <ul className="pl-8">
          {texts.helptexts.map((text, index) => (
            <li key={index} className="mb-2">
              {text}
            </li>
          ))}
        </ul>
        <Textarea
          className="mb-8"
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBeskrivelse,
          })}
          value={watch("begrunnelse")}
          label={texts.beskrivelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {/* TODO: <SkjemaInnsendingFeil /> */}
        <ButtonRow className="flex">
          <Button variant="secondary" type="button">
            {texts.avbrytButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getForhandsvarselDocument({
                begrunnelse: watch("begrunnelse"),
                frist: forhandsvarselFrist,
              })
            }
            title={texts.forhandsvisningLabel}
          />
          <Button loading={false} type="submit" className="ml-auto">
            {texts.sendVarselButtonText}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
};
