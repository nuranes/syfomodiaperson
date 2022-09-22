import React, { ReactElement, useRef, useState } from "react";
import "@navikt/ds-css";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/dialogmote/innkalling/BehandlerSearchResult";
import { BehandlerAlert } from "@/components/dialogmote/innkalling/BehandlerAlert";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";

const StyledSearch = styled(Search)`
  width: 80%;
`;

interface BehandlerSearchProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
}

const BehandlerSearch = ({
  setSelectedBehandler,
}: BehandlerSearchProps): ReactElement => {
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSearchResult, setselectedSearchResult] = useState(""); //TODO: Finn bedre navn/oppsett
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false);
  const setSearchText = (text) => {
    if (text.length > 3) {
      setSearchValue(text);
    } else if (searchValue.length > 3) {
      setSearchValue("");
    }
    setselectedSearchResult(text);
    setPopoverIsOpen(true);
  };
  return (
    <>
      <StyledSearch
        label="Legg til en behandler"
        ref={searchRef}
        size="small"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
        hideLabel={false}
        value={selectedSearchResult}
      />
      {popoverIsOpen && (
        <BehandlerSearchResult
          searchRef={searchRef}
          searchText={searchValue}
          setPopoverIsOpen={setPopoverIsOpen}
          setSelectedBehandler={setSelectedBehandler}
          setSelectedSearchResult={setselectedSearchResult}
        />
      )}
      <BehandlerAlert />
    </>
  );
};

export default BehandlerSearch;
