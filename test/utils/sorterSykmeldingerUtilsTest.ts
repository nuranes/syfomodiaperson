import { sorterSykmeldinger } from "@/utils/sorterSykmeldingerUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { expect, describe, it } from "vitest";

const mockSykmelding = (data: unknown): SykmeldingOldFormat => {
  return data as SykmeldingOldFormat;
};

describe("sorterSykmeldinger", () => {
  it("sorterer på startdato når kriterium mangler og startdato er ulik", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Arve Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-06-15",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger);
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding2);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding1);
  });
  it("sorterer på sluttdato når kriterium mangler og startdato er lik", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Arve Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger);
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding1);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding2);
  });
  it("sorterer på startdato når kriterium er 'dato' og startdato er ulik", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Arve Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-06-15",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger, "dato");
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding2);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding1);
  });
  it("sorterer på sluttdato når kriterium er 'dato' og startdato er lik", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Arve Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger, "dato");
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding1);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding2);
  });
  it("sorterer på arbeidsgiver når kriterium er arbeidsgiver og arbeidsgivernavn er ulik", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Arve Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-06-15",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger, "arbeidsgiver");
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding1);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding2);
  });
  it("sorterer på dato når kriterium er arbeidsgiver og arbeidsgivernavn er likt", () => {
    const sykmelding1 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-05-01",
            tom: "2021-06-01",
          },
        ],
      },
    });
    const sykmelding2 = mockSykmelding({
      arbeidsgiver: "Are Arbeidsgiver",
      mulighetForArbeid: {
        perioder: [
          {
            fom: "2021-06-15",
            tom: "2021-07-01",
          },
        ],
      },
    });
    const sykmeldinger: SykmeldingOldFormat[] = [sykmelding1, sykmelding2];
    const sykmeldingerSorted = sorterSykmeldinger(sykmeldinger, "arbeidsgiver");
    expect(sykmeldingerSorted[0]).to.deep.equal(sykmelding2);
    expect(sykmeldingerSorted[1]).to.deep.equal(sykmelding1);
  });
});
