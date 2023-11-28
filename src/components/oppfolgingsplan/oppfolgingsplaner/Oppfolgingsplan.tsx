import React from "react";
import { Link } from "react-router-dom";
import Knapp from "nav-frontend-knapper";
import { DokumentinfoDTO } from "@/data/oppfolgingsplan/types/DokumentinfoDTO";
import Feilmelding from "../../Feilmelding";
import AppSpinner from "../../AppSpinner";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "@/apiConstants";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { useDokumentinfoQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

interface PlanVisningProps {
  dokumentinfo?: DokumentinfoDTO;
  oppfolgingsplan: OppfolgingsplanDTO;
}

const PlanVisning = ({ dokumentinfo, oppfolgingsplan }: PlanVisningProps) => {
  const bildeUrler: string[] = [];
  if (dokumentinfo) {
    for (let i = 1; i <= dokumentinfo.antallSider; i += 1) {
      bildeUrler.push(
        `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/${oppfolgingsplan.id}/side/${i}`
      );
    }
  }

  const TilbakeTilOppfolgingsplaner = () => {
    return (
      <div className="blokk">
        <Link to={`/sykefravaer/oppfoelgingsplaner`} className="tilbakelenke">
          Til oppfølgingsplaner
        </Link>
      </div>
    );
  };

  return (
    <div className="blokk--l">
      <TilbakeTilOppfolgingsplaner />
      <div className="pdfbilder blokk--s">
        {bildeUrler.map((bildeUrl, index) => {
          return (
            <div key={index} className="pdfbilde">
              <img
                width="944"
                height="1222"
                className="pdfbilde__bilde"
                key={bildeUrl}
                src={bildeUrl}
                alt="Bilde av oppfølgingsplan"
              />
            </div>
          );
        })}
      </div>
      <TilbakeTilOppfolgingsplaner />
      <div className="knapperad">
        <Knapp
          type="standard"
          onClick={() => {
            const newWindow = window.open(
              `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/${oppfolgingsplan.id}`
            );
            newWindow?.print();
          }}
        >
          Skriv ut
        </Knapp>
      </div>
    </div>
  );
};

interface OppfolgingsplanProps {
  oppfolgingsplan: OppfolgingsplanDTO;
}

const Oppfolgingsplan = ({ oppfolgingsplan }: OppfolgingsplanProps) => {
  const { data, isLoading, isError } = useDokumentinfoQuery(oppfolgingsplan.id);

  return (() => {
    if (isLoading) {
      return <AppSpinner />;
    }
    if (isError) {
      return <Feilmelding />;
    }
    return (
      <PlanVisning oppfolgingsplan={oppfolgingsplan} dokumentinfo={data} />
    );
  })();
};

export default Oppfolgingsplan;
