import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { VEILEDER_IDENT_DEFAULT } from "../../mock/common/mockConstants";
import {
  HuskelappRequestDTO,
  HuskelappResponseDTO,
  Oppfolgingsgrunn,
} from "@/data/huskelapp/huskelappTypes";
import { generateUUID } from "@/utils/uuidUtils";
import { expect } from "chai";
import userEvent from "@testing-library/user-event";
import { stubHuskelappApi } from "../stubs/stubIshuskelapp";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { Huskelapp } from "@/components/huskelapp/Huskelapp";

let queryClient: QueryClient;
let apiMockScope: nock.Scope;

const huskelappOppfolgingsgrunn = Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE;
const huskelappOppfogingsgrunnText = "Vurder dialogmøte på et senere tidspunkt";
const huskelapp: HuskelappResponseDTO = {
  createdBy: VEILEDER_IDENT_DEFAULT,
  uuid: generateUUID(),
  oppfolgingsgrunn: huskelappOppfolgingsgrunn,
};

const renderHuskelapp = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Huskelapp />
    </QueryClientProvider>
  );

describe("HuskelappModal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  describe("huskelapp exists", () => {
    beforeEach(() => {
      stubHuskelappApi(apiMockScope, huskelapp);
    });
    it("renders huskelapp-tekst with save, cancel and remove buttons", async () => {
      renderHuskelapp();

      expect(await screen.findByText(huskelappOppfogingsgrunnText)).to.exist;
      expect(await screen.findByRole("button", { hidden: true, name: "Fjern" }))
        .to.exist;
    });
    it("remove deletes huskelapp", async () => {
      renderHuskelapp();

      const removeButton = await screen.findByRole("button", {
        hidden: true,
        name: "Fjern",
      });
      userEvent.click(removeButton);

      const fjernHuskelappMutation = queryClient.getMutationCache().getAll()[0];
      expect(fjernHuskelappMutation.state.variables).to.deep.equal(
        huskelapp.uuid
      );
    });
  });
  describe("no huskelapp exists", () => {
    beforeEach(() => {
      stubHuskelappApi(apiMockScope, undefined);
    });
    it("renders huskelapp input with radio group and save and cancel buttons", async () => {
      renderHuskelapp();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: "Åpne huskelapp",
      });
      userEvent.click(openModalButton);

      expect(await screen.findByText("Velg oppfølgingsgrunn")).to.exist;
      expect(screen.getByRole("button", { hidden: true, name: "Lagre" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Avbryt" })).to
        .exist;
    });
    it("save huskelapp with oppfolgingsgrunn", async () => {
      renderHuskelapp();

      const openModalButton = await screen.findByRole("button", {
        hidden: true,
        name: "Åpne huskelapp",
      });
      userEvent.click(openModalButton);

      const oppfolgingsgrunnRadioButton = await screen.findByText(
        "Vurder dialogmøte på et senere tidspunkt"
      );
      userEvent.click(oppfolgingsgrunnRadioButton);
      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      userEvent.click(lagreButton);

      await waitFor(() => {
        const lagreHuskelappMutation = queryClient.getMutationCache().getAll();
        const expectedHuskelapp: HuskelappRequestDTO = {
          oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE,
        };
        expect(lagreHuskelappMutation[0].state.variables).to.deep.equal(
          expectedHuskelapp
        );
      });
    });
  });
});
