import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";
import {
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
  Oppfolgingsgrunn,
  EditOppfolgingsoppgaveRequestDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "@/utils/uuidUtils";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { Oppfolgingsoppgave } from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";
import { changeTextInput } from "../testUtils";
import dayjs from "dayjs";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { stubOppfolgingsoppgaveApi } from "../stubs/stubIshuskelapp";

let queryClient: QueryClient;
let apiMockScope: nock.Scope;

const oppfolgingsoppgaveOppfolgingsgrunn =
  Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE;
const oppfolgingsoppgaveOppfogingsgrunnText = "Vurder behov for dialogmøte";
const oppfolgingsoppgave: OppfolgingsoppgaveResponseDTO = {
  createdBy: VEILEDER_IDENT_DEFAULT,
  uuid: generateUUID(),
  oppfolgingsgrunn: oppfolgingsoppgaveOppfolgingsgrunn,
  tekst: "Dette var en veldig god grunn for å lage oppfolgingsoppgave.",
  updatedAt: new Date(),
  createdAt: new Date(),
  frist: "2030-01-01",
};
const openOppfolgingsoppgaveButtonText = "Oppfølgingsoppgave";

const renderOppfolgingsoppgave = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Oppfolgingsoppgave />
    </QueryClientProvider>
  );

describe("Oppfolgingsoppgave", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe("oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(apiMockScope, oppfolgingsoppgave);
    });
    it("renders oppfolgingsoppgave-tekst with save, cancel and remove buttons", async () => {
      renderOppfolgingsoppgave();

      expect(await screen.findByText(oppfolgingsoppgaveOppfogingsgrunnText)).to
        .exist;
      expect(await screen.findByText("Frist: 01.01.2030")).to.exist;
      expect(await screen.findByRole("button", { hidden: true, name: "Endre" }))
        .to.exist;
      expect(await screen.findByRole("button", { hidden: true, name: "Fjern" }))
        .to.exist;
    });
    it("renders oppfolgingsoppgave-info", async () => {
      renderOppfolgingsoppgave();

      expect(
        await screen.findByText(
          `Opprettet: ${tilLesbarDatoMedArUtenManedNavn(new Date())}`
        )
      ).to.exist;
      expect(
        await screen.findByText(
          `Sist oppdatert: ${tilLesbarDatoMedArUtenManedNavn(new Date())}`
        )
      ).to.exist;
      expect(
        await screen.findByText(
          `Sist oppdatert av: ${VEILEDER_DEFAULT.fulltNavn()} (${
            VEILEDER_DEFAULT.ident
          })`
        )
      ).to.exist;
    });
    it("remove deletes oppfolgingsoppgave", async () => {
      renderOppfolgingsoppgave();

      const removeButton = await screen.findByRole("button", {
        hidden: true,
        name: "Fjern",
      });
      userEvent.click(removeButton);

      const fjernOppfolgingsoppgaveMutation = queryClient
        .getMutationCache()
        .getAll()[0];
      expect(fjernOppfolgingsoppgaveMutation.state.variables).to.deep.equal(
        oppfolgingsoppgave.uuid
      );
    });
    it("edit opens oppfolgingsoppgavemodal", async () => {
      renderOppfolgingsoppgave();

      const editButton = await screen.findByRole("button", {
        hidden: true,
        name: "Endre",
      });
      userEvent.click(editButton);

      const dialogs = await screen.findAllByRole("dialog", {
        hidden: true,
      });
      const oppfolgingsoppgaveModal = dialogs[0];
      expect(oppfolgingsoppgaveModal).to.exist;
      expect(within(oppfolgingsoppgaveModal).getByText("Lagre")).to.exist;
      expect(within(oppfolgingsoppgaveModal).getByText("Avbryt")).to.exist;
    });
    it("edit date of existing oppfolgingsoppgavemodal", async () => {
      renderOppfolgingsoppgave();

      const editButton = await screen.findByRole("button", {
        hidden: true,
        name: "Endre",
      });
      userEvent.click(editButton);

      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      userEvent.click(lagreButton);

      await waitFor(() => {
        const endreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO = {
          tekst: "Dette var en veldig god grunn for å lage oppfolgingsoppgave.",
          frist: fristDate.format("YYYY-MM-DD"),
        };
        expect(
          endreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("fails if date is not edited on existing oppfolgingsoppgavemodal", async () => {
      renderOppfolgingsoppgave();
      const editButton = await screen.findByRole("button", {
        hidden: true,
        name: "Endre",
      });
      userEvent.click(editButton);

      expect(
        screen.getByRole("textbox", {
          hidden: true,
          name: "Frist",
        })
      ).to.exist;

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      expect(lagreButton).to.exist;
      userEvent.click(lagreButton);

      await screen.findByText("Du må gjøre en endring før du kan lagre.");
    });
  });
  describe("OppfolgingsoppgaveModal: no oppfolgingsoppgave exists", () => {
    beforeEach(() => {
      stubOppfolgingsoppgaveApi(apiMockScope, undefined);
    });

    it("renders oppfolgingsoppgave input with radio group, textarea, datepicker and save and cancel buttons", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      userEvent.click(openModalButton);

      expect(
        await screen.findByText(
          "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
        )
      ).to.exist;
      expect(screen.getByRole("textbox", { hidden: true, name: "Beskrivelse" }))
        .to.exist;
      expect(screen.getByRole("textbox", { hidden: true, name: "Frist" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Lagre" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Avbryt" })).to
        .exist;
    });
    it("save oppfolgingsoppgave with oppfolgingsgrunn and frist", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE },
      });
      const beskrivelseInput = screen.getByLabelText("Beskrivelse");
      changeTextInput(
        beskrivelseInput,
        "Dette var en veldig god grunn for å lage oppfolgingsoppgave."
      );

      const fristDateInput = screen.getByRole("textbox", {
        hidden: true,
        name: "Frist",
      });
      const fristDate = dayjs();
      changeTextInput(fristDateInput, fristDate.format("DD-MM-YY"));
      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      userEvent.click(lagreButton);

      await waitFor(() => {
        const lagreOppfolgingsoppgaveMutation = queryClient
          .getMutationCache()
          .getAll();
        const expectedOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO = {
          oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE,
          tekst: "Dette var en veldig god grunn for å lage oppfolgingsoppgave.",
          frist: fristDate.format("YYYY-MM-DD"),
        };
        expect(
          lagreOppfolgingsoppgaveMutation[0].state.variables
        ).to.deep.equal(expectedOppfolgingsoppgave);
      });
    });
    it("shown extra alert when ANNET oppfolgingsgrunn is chosen", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.ANNET },
      });
      expect(
        screen.queryByText(
          "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her."
        )
      ).to.exist;
    });
    it("does not show extra alert when ANNET oppfolgingsgrunn is NOT chosen", async () => {
      renderOppfolgingsoppgave();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: openOppfolgingsoppgaveButtonText,
      });
      userEvent.click(openModalButton);

      const selectOppfolgingsgrunn = await screen.findByLabelText(
        "Hvilken oppfølgingsgrunn har du? (obligatorisk)"
      );
      fireEvent.change(selectOppfolgingsgrunn, {
        target: { value: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER },
      });
      expect(
        screen.queryByText(
          "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her."
        )
      ).to.not.exist;
    });
  });
});
