import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Summary, File } from ".";
import { StyledCard } from "../App";
import {
  Directory,
  Entry,
  Maybe,
  useListEntriesLazyQuery,
  useListEntriesQuery,
} from "../generated-api";
import "./styles.css";

export const Folder: FC<Directory> = ({ name, path }) => {
  const {
    data: firstPageData,
    loading: firstPageLoading,
    error: firstPageError,
  } = useListEntriesQuery({
    variables: { path },
  });
  const [nextPage, setNextPage] = useState<number | undefined | null>(2);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [paginatedDataList, setPaginatedDataList] = useState<
    Array<Maybe<Entry>>
  >([]);
  const [fetch, { loading, error, data }] = useListEntriesLazyQuery();
  const showNextPageButton =
    firstPageData?.listEntries?.pagination.nextPage &&
    data?.listEntries?.pagination.nextPage !== null &&
    nextPage !== firstPageData?.listEntries?.pagination.pageCount + 1;

  useEffect(() => {
    if (firstPageData) {
      setPaginatedDataList(firstPageData?.listEntries?.entries ?? []);
      setNextPage(firstPageData?.listEntries?.pagination.nextPage);
    }
    if (data) {
      setPaginatedDataList(data?.listEntries?.entries ?? []);
      setNextPage(data?.listEntries?.pagination.nextPage);
    }
  }, [firstPageData, data]);

  if (loading || firstPageLoading) {
    return <StyledCard>{`...Loading`}</StyledCard>;
  }

  if (error || firstPageError) {
    return <StyledCard>{`Error`}</StyledCard>;
  }

  return (
    <>
      <StyledCard
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {name}
      </StyledCard>
      {isOpen && <Summary path={path} />}

      <div className="children">
        {isOpen &&
          paginatedDataList.map((entry, index) => {
            switch (entry?.__typename) {
              case "Directory":
                return <Folder key={index} {...entry} />;
              case "File":
                return <File key={index} {...entry} />;
            }
          })}
      </div>
      <div className="button-group">
        {isOpen && data?.listEntries?.pagination.prevPage && (
          <button
            onClick={() =>
              fetch({
                variables: {
                  path,
                  page: data?.listEntries?.pagination.prevPage,
                },
              })
            }
          >
            show previous page
          </button>
        )}
        {isOpen && showNextPageButton && (
          <button
            onClick={() => {
              fetch({
                variables: {
                  path,
                  page: nextPage,
                },
              });
              setNextPage(nextPage && nextPage + 1);
            }}
          >
            show next page
          </button>
        )}
      </div>
    </>
  );
};
