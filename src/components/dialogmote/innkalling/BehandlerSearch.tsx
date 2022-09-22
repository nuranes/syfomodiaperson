import React, { ReactElement, useRef, useState } from "react";
import "@navikt/ds-css";
import { Search } from "@navikt/ds-react";
import BehandlerSearchResult from "@/components/dialogmote/innkalling/BehandlerSearchResult";
import { BehandlerAlert } from "@/components/dialogmote/innkalling/BehandlerAlert";

const BehandlerSearch = (): ReactElement => {
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const setSearchText = (text) => {
    if (text.length > 3) {
      setSearchValue(text);
    } else if (searchValue.length > 3) {
      setSearchValue("");
    }
  };
  return (
    <>
      <Search
        label="Legg til en behandler"
        ref={searchRef}
        size="small"
        variant="simple"
        onChange={(searchText) => setSearchText(searchText)}
        clearButton={false}
        hideLabel={false}
      />
      <BehandlerSearchResult searchRef={searchRef} searchText={searchValue} />
      <BehandlerAlert />
    </>
  );
};

export default BehandlerSearch;
