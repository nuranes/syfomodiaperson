import React, { ReactElement } from "react";
import { Button, Popover } from "@navikt/ds-react";
import { useSokBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

interface BehandlerSearchResultProps {
  searchRef: React.MutableRefObject<any>;
  searchText: string;
  setPopoverIsOpen: (value: boolean) => void;
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  setSelectedSearchResult: (selectedResult: string) => void;
}

const BehandlerSearchResult = ({
  searchRef,
  searchText,
  setPopoverIsOpen,
  setSelectedBehandler,
  setSelectedSearchResult,
}: BehandlerSearchResultProps): ReactElement => {
  const { data: behandlere } = useSokBehandlereQuery(searchText);

  const updateSearch = (behandler: BehandlerDTO, selectedResult: string) => {
    setSelectedSearchResult(selectedResult);
    setSelectedBehandler(behandler);
    setPopoverIsOpen(false);
  };

  return (
    <Popover
      anchorEl={searchRef.current}
      placement="bottom-start"
      open={behandlere.length > 0 && searchText !== ""}
      onClose={() => null}
      arrow={false}
      className="w-[30rem] overflow-auto max-h-60"
      offset={8}
      tabIndex={0}
    >
      {behandlere.map((behandler, index) => {
        const behandlerInfo = `${behandler.etternavn}, ${behandler.fornavn}: ${behandler.kontor}`;
        return (
          <Popover.Content key={index} className="p-0">
            <Button
              variant="tertiary"
              onClick={() => updateSearch(behandler, behandlerInfo)}
              className="w-full flex justify-start text-start text-neutral-800"
            >
              {behandlerInfo}
            </Button>
          </Popover.Content>
        );
      })}
    </Popover>
  );
};

export default BehandlerSearchResult;
