import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

describe(
  "Møtelandingsside actions",
  {
    retries: {
      runMode: 3,
    },
  },
  () => {
    beforeEach(() => {
      cy.visit("/sykefravaer/moteoversikt");
      cy.OAuth2Login();
    });

    it("Oppretter nytt møte uten at man ønsker å prøve ny løsning", () => {
      cy.stubMoter(MoteState.INGEN_MOTER);

      cy.dataCy(selectors.nyttDM2Mote).click();

      cy.get("button").contains("Nei").click();

      cy.url().should("include", "/sykefravaer/mote");
    });

    it("Ønsker å prøve ny løsning for Dialogmøte", () => {
      cy.stubMoter(MoteState.INGEN_MOTER);

      cy.dataCy(selectors.nyttDM2Mote).click();

      cy.get("button").contains("Ja").click();

      cy.url().should("include", "/sykefravaer/dialogmote");
    });

    it("Ser på referat og avlysningsbrev i møtehistorikk", () => {
      cy.stubMoter(MoteState.AVLYST_OG_FERDIG_MOTE);

      cy.dataCy("Avlysningsbrev").click();
      cy.dataCy(selectors.forhandsvisningModal).contains("Avlysningsbrev");
      cy.dataCy(selectors.forhandsvisningModal).contains("Lukk").click();

      cy.dataCy("Referat").click();
      cy.dataCy(selectors.forhandsvisningModal).contains("Referat");
      cy.contains("Lukk").click();
    });

    it("Har tilgang til DM2 og aktiv dialogmøte-innkalling, blir sendt til møte-landingsside når man forsøker gå direkte til ny løsning for innkalling", () => {
      cy.stubMoter(MoteState.INNKALT_DIALOGMOTE);

      cy.visit("/sykefravaer/dialogmote");

      cy.url().should("include", "/sykefravaer/mote");
    });

    it("Har tilgang til DM2 og ikke aktiv dialogmøte-innkalling, kan gå direkte til ny løsning for innkalling", () => {
      cy.stubMoter(MoteState.INGEN_MOTER);

      cy.visit("/sykefravaer/dialogmote");

      cy.url().should("include", "/sykefravaer/dialogmote");
    });
  }
);
