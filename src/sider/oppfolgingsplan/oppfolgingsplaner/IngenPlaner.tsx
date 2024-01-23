import * as React from "react";
import Infomelding from "../../../components/Infomelding";

const IngenPlaner = () => {
  return (
    <div>
      <h2 style={{ margin: 0 }}>Oppfølgingsplaner</h2>
      <Infomelding
        tittel="NAV har ikke mottatt noen oppfølgingsplaner"
        melding="For å se oppfølgingsplaner her må den sykmeldte eller nærmeste leder sende den inn fra sin side på nav.no"
      />
    </div>
  );
};

export default IngenPlaner;
