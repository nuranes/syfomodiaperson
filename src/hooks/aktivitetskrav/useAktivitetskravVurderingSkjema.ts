import { VurderingArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  vurderAktivitetskravBeskrivelseFieldName,
  vurderAktivitetskravBeskrivelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { validerTekst } from "@/utils/valideringUtils";
import { vurderAktivitetskravArsakerFieldName } from "@/components/aktivitetskrav/vurdering/AvventArsakerCheckboxGruppe";

const validationText = {
  missingArsak: "Vennligst angi årsak",
  missingBeskrivelse: "Vennligst angi beskrivelse",
};

const validateArsak = (arsak: VurderingArsak | undefined) => {
  return !arsak ? validationText.missingArsak : undefined;
};

export const useAktivitetskravVurderingSkjema = () => {
  const validateArsakerField = (arsaker: VurderingArsak[] | undefined) => {
    return {
      [vurderAktivitetskravArsakerFieldName]: validateArsak(arsaker?.[0]),
    };
  };
  const validateBeskrivelseField = (
    beskrivelse: string | undefined,
    required: boolean
  ) => {
    return {
      [vurderAktivitetskravBeskrivelseFieldName]: validerTekst({
        value: beskrivelse || "",
        maxLength: vurderAktivitetskravBeskrivelseMaxLength,
        missingRequiredMessage: required
          ? validationText.missingBeskrivelse
          : undefined,
      }),
    };
  };

  return {
    validateArsakerField,
    validateBeskrivelseField,
  };
};
