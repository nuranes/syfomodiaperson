import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import PersonkortHeader from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { expect } from "chai";
import {
  queryClientWithAktivBruker,
  setQueryDataWithPersonkortdata,
} from "../../testQueryClient";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { brukerinfoMock } from "../../../mock/syfoperson/persondataMock";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";

let queryClient: any;

const renderPersonkortHeader = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetProvider>
        <PersonkortHeader />
      </ValgtEnhetProvider>
    </QueryClientProvider>
  );

describe("PersonkortHeader", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    setQueryDataWithPersonkortdata(queryClient);
  });

  it("viser 'Egenansatt' når isEgenansatt er true fra API", () => {
    queryClient.setQueryData(
      egenansattQueryKeys.egenansatt(ARBEIDSTAKER_DEFAULT.personIdent),
      () => true
    );
    renderPersonkortHeader();

    expect(screen.getByText("Egenansatt")).to.exist;
  });

  it("viser ikke 'Egenansatt' når isEgenansatt er false fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Egenansatt")).not.to.exist;
  });

  it("viser 'Kode 6' når diskresjonskode er 6 fra API", () => {
    queryClient.setQueryData(
      diskresjonskodeQueryKeys.diskresjonskode(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => "6"
    );
    renderPersonkortHeader();

    expect(screen.getByText("Kode 6")).to.exist;
  });

  it("viser 'Kode 7' når diskresjonskode er 7 fra API", () => {
    queryClient.setQueryData(
      diskresjonskodeQueryKeys.diskresjonskode(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => "7"
    );
    renderPersonkortHeader();

    expect(screen.getByText("Kode 7")).to.exist;
  });

  it("viser ingen diskresjonskode når diskresjonskode er tom fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Kode")).not.to.exist;
  });

  it("viser ikke tegnspråktolk eller talespråktolk når tilrettelagtKommunikasjon er null fra API", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Talespråktolk")).to.not.exist;
    expect(screen.queryByText("Tegnspråktolk")).to.not.exist;
  });

  it("viser talespråktolk, men ikke tegnspråktolk", () => {
    const tilrettelagtKommunikasjon = {
      talesprakTolk: {
        value: "NO",
      },
      tegnsprakTolk: null,
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          tilrettelagtKommunikasjon,
        };
      }
    );

    renderPersonkortHeader();

    expect(screen.getByText("Talespråktolk: NO")).to.exist;
    expect(screen.queryByText("Tegnspråktolk")).to.not.exist;
  });

  it("viser talespråktolk og tegnspråktolk samtidig", () => {
    const tilrettelagtKommunikasjon = {
      talesprakTolk: {
        value: "NO",
      },
      tegnsprakTolk: {
        value: "EN",
      },
    };
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          tilrettelagtKommunikasjon,
        };
      }
    );

    renderPersonkortHeader();

    expect(screen.getByText("Talespråktolk: NO")).to.exist;
    expect(screen.getByText("Tegnspråktolk: EN")).to.exist;
  });

  it("viser dødsdato når dato finnes i brukerinfo", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => {
        return {
          ...brukerinfoMock,
          dodsdato: "2023-02-01",
        };
      }
    );
    renderPersonkortHeader();

    expect(screen.getByText("Død 01.02.2023")).to.exist;
  });

  it("viser ikke dødsdato når det ikke finnes i brukerinfo", () => {
    renderPersonkortHeader();

    expect(screen.queryByText("Død")).not.to.exist;
  });

  it("viser maksdato og utbetalt tom fra API", () => {
    renderPersonkortHeader();

    expect(screen.getByText("Maksdato:")).to.exist;
    expect(screen.getByText("01.12.2023")).to.exist;
    expect(screen.getByText("Utbetalt tom:")).to.exist;
    expect(screen.getByText("01.07.2024")).to.exist;
  });
});
