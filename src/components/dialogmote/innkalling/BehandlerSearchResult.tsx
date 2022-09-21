import React, { ReactElement } from "react";
import { Popover } from "@navikt/ds-react";
import { useSokBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";

interface BehandlerSearchResultProps {
  searchRef: React.MutableRefObject<any>;
  searchText: string;
}

const BehandlerSearchResult = ({
  searchRef,
  searchText,
}: BehandlerSearchResultProps): ReactElement => {
  const { data: behandlere, isLoading } = useSokBehandlereQuery(searchText);

  return (
    <>
      <Popover
        anchorEl={searchRef.current}
        placement="bottom-start"
        open={behandlere.length > 0}
        onClose={() => null}
        arrow={false}
        className="w-full"
        offset={8}
      >
        {behandlere.map((behandler, index) => (
          <Popover.Content key={index}>
            {behandler.etternavn}, {behandler.fornavn}: {behandler.kontor}
          </Popover.Content>
        ))}
      </Popover>
    </>
  );
};

export default BehandlerSearchResult;
