import React, { ReactElement, useRef, useState } from "react";
import "@navikt/ds-css";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/dialogmote/innkalling/BehandlerSearchResult";

const BehandlerSearch = (): ReactElement => {
  const searchRef = useRef(null);
  const [searchTextForBehandler, setSearchTextForBehandler] = useState("");
  const setSearchText = (text) => {
    if (text.length > 3) {
      setSearchTextForBehandler(text); // TODO: Oppdater state når under 3 tegn også, men ikke søk
    } else if (searchTextForBehandler.length > 3) {
      setSearchTextForBehandler("");
    }
  };
  return (
    <form className="relative">
      <Search
        label="Legg til en behandler"
        ref={searchRef}
        size="medium"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
      />
      <BehandlerSearchResult
        searchRef={searchRef}
        searchText={searchTextForBehandler}
      />
    </form>
  );
};

export default BehandlerSearch;
