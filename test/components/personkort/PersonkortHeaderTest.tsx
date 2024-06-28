import { QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import React from "react";
import PersonkortHeader from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { beforeEach, describe, expect, it } from "vitest";
import {
  queryClientWithAktivBruker,
  setQueryDataWithPersonkortdata,
} from "../../testQueryClient";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";
import { egenansattQueryKeys } from "@/data/egenansatt/egenansattQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GRUNERLOKKA,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../../mock/common/mockConstants";
import {
  brukerinfoMock,
  maksdato,
} from "../../../mock/syfoperson/persondataMock";
import { diskresjonskodeQueryKeys } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { daysFromToday } from "../../testUtils";
import dayjs from "dayjs";
import { veilederMock } from "../../../mock/syfoveileder/veilederMock";
import { veilederinfoQueryKeys } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useGetVeilederBrukerKnytning } from "@/components/personkort/hooks/useGetVeilederBrukerKnytning";
import { apiMock } from "../../stubs/stubApi";
import { stubSyfooversiktsrvPersontildelingNoContent } from "../../stubs/stubSyfooversiktsrv";
import { queryHookWrapper } from "../../data/queryHookTestUtils";

let queryClient: any;
let apiMockScope: any;

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
    apiMockScope = apiMock();
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
    expect(screen.getByText(dayjs(maksdato).format("DD.MM.YYYY"))).to.exist;
    expect(screen.getByText("Utbetalt tom:")).to.exist;
    expect(screen.getByText("01.07.2024")).to.exist;
  });

  it("viser ikke sikkerhetstiltak-tag når bruker mangler sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [],
      })
    );
    renderPersonkortHeader();

    expect(screen.queryByText("Sikkerhetstiltak")).to.not.exist;
  });

  it("viser sikkerhetstiltak-tag når bruker har sikkerhetstiltak", () => {
    queryClient.setQueryData(
      brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        ...brukerinfoMock,
        sikkerhetstiltak: [
          {
            type: "FYUS",
            beskrivelse: "Fysisk utestengelse",
            gyldigFom: daysFromToday(-10),
            gyldigTom: daysFromToday(10),
          },
        ],
      })
    );
    renderPersonkortHeader();

    expect(screen.getByText("Sikkerhetstiltak")).to.exist;
  });

  describe("TildeltVeileder", () => {
    it("viser 'Tildelt veileder' når kall for å hente knytning er success", () => {
      queryClient.setQueryData(
        ["veilederBrukerKnytning", ARBEIDSTAKER_DEFAULT.personIdent],
        () => ({
          personident: ARBEIDSTAKER_DEFAULT.personIdent,
          tildeltVeilederident: VEILEDER_IDENT_DEFAULT,
          tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
        })
      );
      queryClient.setQueryData(
        veilederinfoQueryKeys.veilederinfoByIdent(VEILEDER_IDENT_DEFAULT),
        () => veilederMock
      );
      renderPersonkortHeader();

      expect(
        screen.getByText(
          `Tildelt veileder: ${VEILEDER_DEFAULT.fulltNavn()} (${
            VEILEDER_DEFAULT.ident
          })`
        )
      ).to.exist;
    });

    it("viser 'Tildelt veileder: ufordelt' når kall for å hente knytning ikke finner noen knytning", async () => {
      stubSyfooversiktsrvPersontildelingNoContent(apiMockScope);
      const wrapper = queryHookWrapper(queryClient);

      const { result } = renderHook(() => useGetVeilederBrukerKnytning(), {
        wrapper,
      });
      renderPersonkortHeader();

      await waitFor(() => expect(result.current.isSuccess).to.be.true);
      await screen.findByText("Ufordelt bruker");
    });
  });
});
