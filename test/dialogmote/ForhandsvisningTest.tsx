import React from "react";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

const doNothing = () => {
  /* do nothing */
};

describe("Forhandsvisning", () => {
  it("inneholder tittel, undertittel og knapper", () => {
    render(
      <ForhandsvisningModal
        title={"Tittel her"}
        contentLabel={"Test"}
        isOpen={true}
        handleClose={doNothing}
        getDocumentComponents={() => []}
      />
    );
    expect(screen.getByRole("heading", { name: "Tittel her", hidden: true })).to
      .exist;
    expect(screen.getAllByRole("button", { name: "Lukk", hidden: true })).to.not
      .be.empty;
  });
  it("rendrer document components", () => {
    const documentComponents: DocumentComponentDto[] = [
      {
        type: DocumentComponentType.LINK,
        title: "Her er en link",
        texts: ["www.test.no"],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        texts: ["En paragraph"],
      },
      {
        type: DocumentComponentType.PARAGRAPH,
        title: "Paragraph title",
        texts: ["A paragraph", "Other paragraph"],
      },
      {
        type: DocumentComponentType.HEADER_H2,
        texts: ["En overskrift"],
      },
    ];
    render(
      <ForhandsvisningModal
        title={"Tittel her"}
        contentLabel={"Test"}
        isOpen={true}
        handleClose={doNothing}
        getDocumentComponents={() => documentComponents}
      />
    );
    expect(screen.getByRole("heading", { name: "En overskrift", hidden: true }))
      .to.exist;
    expect(screen.getByRole("link", { name: "www.test.no", hidden: true })).to
      .exist;
    expect(screen.getByText("Her er en link")).to.exist;
    expect(screen.getByText("En paragraph")).to.exist;
    expect(screen.getByText("Paragraph title")).to.exist;
    expect(screen.getByText("A paragraph")).to.exist;
    expect(screen.getByText("Other paragraph")).to.exist;
  });
});
