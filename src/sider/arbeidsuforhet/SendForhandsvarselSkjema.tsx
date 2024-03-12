import React from "react";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow } from "@/components/Layout";
import { Box, Button, Heading, Textarea } from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { useArbeidsuforhetVarselDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVarselDocument";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ForhandsvarselRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useSendForhandsvarsel } from "@/data/arbeidsuforhet/useSendForhandsvarsel";

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
  defaultTextareaValue: "NAV vurderer å avslå sykepengene dine fordi ...",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
};

const forhandsvarselFrist = addWeeks(new Date(), 3);
const defaultValues = { begrunnelse: texts.defaultTextareaValue };
const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

export const SendForhandsvarselSkjema = () => {
  const sendForhandsvarsel = useSendForhandsvarsel();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues });
  const { getForhandsvarselDocument } = useArbeidsuforhetVarselDocument();

  const submit = (values: SkjemaValues) => {
    const forhandsvarselRequestDTO: ForhandsvarselRequestDTO = {
      begrunnelse: values.begrunnelse,
      document: getForhandsvarselDocument({
        begrunnelse: values.begrunnelse,
        frist: forhandsvarselFrist,
      }),
    };
    sendForhandsvarsel.mutate(forhandsvarselRequestDTO);
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
            validate: (value) =>
              value !== texts.defaultTextareaValue || texts.missingBeskrivelse,
          })}
          value={watch("begrunnelse")}
          label={texts.beskrivelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {sendForhandsvarsel.isError && (
          <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
        )}
        <ButtonRow className="flex">
          <Button loading={sendForhandsvarsel.isPending} type="submit">
            {texts.sendVarselButtonText}
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
          <Button variant="secondary" type="button" className="ml-auto">
            {texts.avbrytButtonText}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
};
