import { queryClientWithMockData } from "../testQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { HuskelappModal } from "@/components/huskelapp/HuskelappModal";
import { VEILEDER_IDENT_DEFAULT } from "../../mock/common/mockConstants";
import {
  HuskelappRequestDTO,
  HuskelappResponseDTO,
} from "@/data/huskelapp/huskelappTypes";
import { generateUUID } from "@/utils/uuidUtils";
import { changeTextInput } from "../testUtils";
import { expect } from "chai";
import userEvent from "@testing-library/user-event";
import { stubHuskelappApi } from "../stubs/stubIshuskelapp";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";

let queryClient: QueryClient;
let apiMockScope: any;

const huskelappTekst = "Note to self";
const huskelapp: HuskelappResponseDTO = {
  tekst: huskelappTekst,
  createdBy: VEILEDER_IDENT_DEFAULT,
  uuid: generateUUID(),
};

const renderHuskelappModal = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <HuskelappModal isOpen={true} toggleOpen={() => void 0} />
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
      renderHuskelappModal();

      const huskelappInput = (
        await screen.findAllByRole("textbox", {
          hidden: true,
        })
      )[0];
      expect(huskelappInput.textContent).to.equal(huskelappTekst);
      expect(screen.getByRole("button", { hidden: true, name: "Lagre" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Avbryt" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Fjern" })).to
        .exist;
    });
    it("save posts huskelapp with expected text", async () => {
      renderHuskelappModal();

      const huskelappInput = (
        await screen.findAllByRole("textbox", {
          hidden: true,
        })
      )[0];
      changeTextInput(huskelappInput, "New note to self");

      const lagreButton = screen.getByRole("button", {
        hidden: true,
        name: "Lagre",
      });
      userEvent.click(lagreButton);

      const lagreHuskelappMutation = queryClient.getMutationCache().getAll()[0];
      const expectedHuskelapp: HuskelappRequestDTO = {
        tekst: "New note to self",
      };
      expect(lagreHuskelappMutation.options.variables).to.deep.equal(
        expectedHuskelapp
      );
    });
    it("remove deletes huskelapp", async () => {
      renderHuskelappModal();

      const removeButton = await screen.findByRole("button", {
        hidden: true,
        name: "Fjern",
      });
      userEvent.click(removeButton);

      const fjernHuskelappMutation = queryClient.getMutationCache().getAll()[0];
      expect(fjernHuskelappMutation.options.variables).to.deep.equal(
        huskelapp.uuid
      );
    });
  });
  describe("no huskelapp exists", () => {
    beforeEach(() => {
      stubHuskelappApi(apiMockScope, undefined);
    });
    it("renders huskelapp input with save and cancel buttons", async () => {
      renderHuskelappModal();

      const huskelappInput = (
        await screen.findAllByRole("textbox", {
          hidden: true,
        })
      )[0];
      expect(huskelappInput.textContent).to.be.empty;
      expect(screen.getByRole("button", { hidden: true, name: "Lagre" })).to
        .exist;
      expect(screen.getByRole("button", { hidden: true, name: "Avbryt" })).to
        .exist;
      expect(screen.queryByRole("button", { hidden: true, name: "Fjern" })).to
        .not.exist;
    });
  });
});
