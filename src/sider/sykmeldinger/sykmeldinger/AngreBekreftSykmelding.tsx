import React, { ReactElement } from "react";
import Knapp from "nav-frontend-knapper";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";

const texts = {
  angre: "Endre opplysninger",
};

export const sykmeldingHarSoknad = (
  sykepengeSoknader: SykepengesoknadDTO[],
  sykmeldingId: string
): boolean => {
  return sykepengeSoknader.some(
    (soknad) => soknad.sykmeldingId === sykmeldingId
  );
};

interface AngreBekreftSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const AngreBekreftSykmelding = ({
  sykmelding,
}: AngreBekreftSykmeldingProps): ReactElement | null => {
  const { data: sykepengeSoknader } = useSykepengesoknaderQuery();

  const FIRE_MANEDER_SIDEN = new Date();
  FIRE_MANEDER_SIDEN.setMonth(FIRE_MANEDER_SIDEN.getMonth() - 4);
  const vis =
    new Date(sykmelding.sendtdato) > FIRE_MANEDER_SIDEN &&
    !sykmeldingHarSoknad(sykepengeSoknader, sykmelding.id);
  return vis ? (
    <div className="verktoylinje">
      <Knapp type="standard" mini disabled>
        {texts.angre}
      </Knapp>
    </div>
  ) : null;
};

export default AngreBekreftSykmelding;
