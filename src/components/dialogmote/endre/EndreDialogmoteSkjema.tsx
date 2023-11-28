import React from "react";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";

import Panel from "nav-frontend-paneler";
import { FlexRow } from "../../Layout";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Form } from "react-final-form";
import {
  validerBegrunnelser,
  validerSted,
  validerTidspunkt,
  validerVideoLink,
} from "@/utils/valideringUtils";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import EndreDialogmoteTekster, {
  MAX_LENGTH_ENDRE_BEGRUNNELSE,
} from "./EndreDialogmoteTekster";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useTidStedDocument } from "@/hooks/dialogmote/document/useTidStedDocument";
import {
  DialogmoteDTO,
  EndreTidStedDialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useEndreTidStedDialogmote } from "@/data/dialogmote/useEndreTidStedDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";
import { Flatknapp, Hovedknapp } from "nav-frontend-knapper";

const texts = {
  send: "Send",
  avbryt: "Avbryt",
};

const EndrePanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(Hovedknapp)`
  margin-right: 0.5rem;
`;

interface EndreTidStedSkjemaTekster {
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
  begrunnelseBehandler?: string;
}

export interface EndreTidStedSkjemaValues
  extends EndreTidStedSkjemaTekster,
    TidStedSkjemaValues {}

type EndreTidStedDialogmoteSkjemaFeil = Partial<
  Pick<
    EndreTidStedSkjemaValues,
    | "sted"
    | "klokkeslett"
    | "dato"
    | "begrunnelseArbeidsgiver"
    | "begrunnelseArbeidstaker"
    | "begrunnelseBehandler"
    | "videoLink"
  >
>;

interface Props {
  dialogmote: DialogmoteDTO;
}

const EndreDialogmoteSkjema = ({ dialogmote }: Props) => {
  const fnr = useValgtPersonident();

  const dato = dialogmote.tid.split("T")[0];
  const klokkeslett = dialogmote.tid.split("T")[1].substr(0, 5);

  const initialValues: Partial<EndreTidStedSkjemaValues> = {
    dato,
    klokkeslett,
    sted: dialogmote.sted,
    videoLink: dialogmote.videoLink,
  };

  const endreTidStedDialogmote = useEndreTidStedDialogmote(
    fnr,
    dialogmote.uuid
  );

  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();

  const {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  } = useTidStedDocument(dialogmote);
  const { toTidStedDto } = useSkjemaValuesToDto();

  const validate = (
    values: Partial<EndreTidStedSkjemaValues>
  ): EndreTidStedDialogmoteSkjemaFeil => {
    const begrunnelserFeil = validerBegrunnelser(
      values,
      MAX_LENGTH_ENDRE_BEGRUNNELSE,
      !!dialogmote.behandler
    );

    const feilmeldinger: EndreTidStedDialogmoteSkjemaFeil = {
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      videoLink: validerVideoLink(values.videoLink),
      ...begrunnelserFeil,
    };
    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const toEndreTidSted = (
    values: EndreTidStedSkjemaValues
  ): EndreTidStedDialogmoteDTO => {
    const endreTidStedDto: EndreTidStedDialogmoteDTO = {
      ...toTidStedDto(values),
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        endringsdokument: getTidStedDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        endringsdokument: getTidStedDocumentArbeidsgiver(values),
      },
    };
    if (dialogmote.behandler) {
      endreTidStedDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        endringsdokument: getTidStedDocumentBehandler(values),
      };
    }

    return endreTidStedDto;
  };

  const submit = (values: EndreTidStedSkjemaValues) => {
    const dialogmoteEndring = toEndreTidSted(values);
    endreTidStedDialogmote.mutate(dialogmoteEndring);
  };

  if (endreTidStedDialogmote.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <EndrePanel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteTidOgSted />
            <EndreDialogmoteTekster dialogmote={dialogmote} />
            {endreTidStedDialogmote.isError && (
              <SkjemaInnsendingFeil error={endreTidStedDialogmote.error} />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={endreTidStedDialogmote.isPending}
                autoDisableVedSpinner
              >
                {texts.send}
              </SendButton>
              <Link to={moteoversiktRoutePath}>
                <Flatknapp htmlType="button">{texts.avbryt}</Flatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </EndrePanel>
  );
};

export default EndreDialogmoteSkjema;
