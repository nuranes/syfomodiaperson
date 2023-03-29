import React from "react";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { expect } from "chai";
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
      <Forhandsvisning
        title={"Tittel her"}
        contentLabel={"Test"}
        isOpen={true}
        handleClose={doNothing}
        getDocumentComponents={() => []}
      />
    );
    expect(screen.getByRole("heading", { name: "Tittel her" })).to.exist;
    expect(screen.getAllByRole("button", { name: "Lukk" })).to.not.be.empty;
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
      <Forhandsvisning
        title={"Tittel her"}
        contentLabel={"Test"}
        isOpen={true}
        handleClose={doNothing}
        getDocumentComponents={() => documentComponents}
      />
    );
    expect(screen.getByRole("heading", { name: "En overskrift" })).to.exist;
    expect(screen.getByRole("link", { name: "www.test.no" })).to.exist;
    expect(screen.getByText("Her er en link")).to.exist;
    expect(screen.getByText("En paragraph")).to.exist;
    expect(screen.getByText("Paragraph title")).to.exist;
    expect(screen.getByText("A paragraph")).to.exist;
    expect(screen.getByText("Other paragraph")).to.exist;
  });
});
