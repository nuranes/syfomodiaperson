import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { vurderAktivitetskravArsakFieldName } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import {
  vurderAktivitetskravBeskrivelseFieldName,
  vurderAktivitetskravBeskrivelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { validerTekst } from "@/utils/valideringUtils";

export const useAktivitetskravVurderingSkjema = (
  status: AktivitetskravStatus
) => {
  const createDto = (
    beskrivelse: string,
    arsaker: VurderingArsak[]
  ): CreateAktivitetskravVurderingDTO => {
    return {
      status,
      beskrivelse,
      arsaker,
    };
  };
  const validateArsak = (arsak: VurderingArsak | undefined) => {
    return {
      [vurderAktivitetskravArsakFieldName]: !arsak
        ? "Vennligst angi årsak"
        : undefined,
    };
  };
  const validateBeskrivelse = (
    beskrivelse: string | undefined,
    required: boolean
  ) => {
    return {
      [vurderAktivitetskravBeskrivelseFieldName]: validerTekst({
        value: beskrivelse || "",
        maxLength: vurderAktivitetskravBeskrivelseMaxLength,
        missingRequiredMessage: required
          ? "Vennligst angi beskrivelse"
          : undefined,
      }),
    };
  };

  return {
    createDto,
    validateArsak,
    validateBeskrivelse,
  };
};
