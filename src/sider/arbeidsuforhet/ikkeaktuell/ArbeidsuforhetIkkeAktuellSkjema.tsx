import React from "react";
import {
  arsakTexts,
  VurderingArsak,
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { Link } from "react-router-dom";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/notification/NotificationContext";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";

const texts = {
  title: "Vurdering av § 8-4 er ikke lenger aktuelt",
  body: "Det er sendt ut forhåndsvarsel om stans, men § 8-4 er ikke lenger aktuelt å vurdere.",
  description:
    "Når du trykker Lagre journalføres vurderingen automatisk og hendelsen fjernes fra oversikten.",
  arsakLegend: "Årsak (obligatorisk)",
  missingArsak: "Vennligst angi årsak",
  lagreButton: "Lagre",
  avbrytButton: "Avbryt",
  success:
    "Vurderingen er lagret i historikken og blir journalført automatisk.",
};

interface SkjemaValues {
  arsak: VurderingArsak;
}

export const ArbeidsuforhetIkkeAktuellSkjema = () => {
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { setNotification } = useNotification();
  const { getIkkeAktuellDocument } = useArbeidsuforhetVurderingDocument();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>();

  const submit = (values: SkjemaValues) => {
    const { arsak } = values;
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.IKKE_AKTUELL,
      begrunnelse: "",
      arsak,
      document: getIkkeAktuellDocument({ arsak }),
    };
    sendVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };

  return (
    <Box background="surface-default" padding="4" className="mb-2">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <BodyShort size="small">{texts.body}</BodyShort>
        <RadioGroup
          name="arsak"
          size="small"
          legend={texts.arsakLegend}
          error={errors.arsak && texts.missingArsak}
        >
          {Object.entries(arsakTexts).map(([arsak, text], index) => (
            <Radio
              key={index}
              value={arsak}
              {...register("arsak", { required: true })}
            >
              {text}
            </Radio>
          ))}
        </RadioGroup>
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        <BodyShort size="small" textColor="subtle">
          {texts.description}
        </BodyShort>
        <ButtonRow>
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.lagreButton}
          </Button>
          <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
};
