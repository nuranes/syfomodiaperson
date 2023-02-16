import {
  isAktivtDialogmote,
  isPersonoppgaveCompletedAfterLastMoteEndring,
} from "@/utils/dialogmoteUtils";
import { expect } from "chai";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import dayjs from "dayjs";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

describe("dialogmoteutils", () => {
  describe("isAktivtDialogmote", () => {
    it("returns true if status is innkalt", () => {
      const dialogmote = {
        status: DialogmoteStatus.INNKALT,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.true;
    });

    it("returns true if status is endring", () => {
      const dialogmote = {
        status: DialogmoteStatus.NYTT_TID_STED,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.true;
    });

    it("returns false if status is avlyst", () => {
      const dialogmote = {
        status: DialogmoteStatus.AVLYST,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });

    it("returns false if status is ferdigstilt", () => {
      const dialogmote = {
        status: DialogmoteStatus.FERDIGSTILT,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });

    it("returns false if status is lukket", () => {
      const dialogmote = {
        status: DialogmoteStatus.LUKKET,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });
  });

  describe("isPersonoppgaveCompletedAfterLastMoteEndring", () => {
    const TODAY = new Date();
    const YESTERDAY = dayjs(TODAY).subtract(1, "day").toDate();

    it("returns true if oppgave was behandlet after last varsel to arbeidstaker was created", () => {
      const oppgave = {
        behandletTidspunkt: TODAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: YESTERDAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote
      );

      expect(isCompletedAfter).to.be.true;
    });

    it("returns false if oppgave was behandlet before last varsel to arbeidstaker was created", () => {
      const oppgave = {
        behandletTidspunkt: YESTERDAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: TODAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote
      );

      expect(isCompletedAfter).to.be.false;
    });

    it("returns false if oppgave is not behandlet", () => {
      const oppgave = {
        behandletTidspunkt: null,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: TODAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote
      );

      expect(isCompletedAfter).to.be.false;
    });

    it("returns false if no varsler is sent to arbeidstaker (no oppgave should actually exist in this state)", () => {
      const oppgave = {
        behandletTidspunkt: TODAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote
      );

      expect(isCompletedAfter).to.be.false;
    });
  });
});
