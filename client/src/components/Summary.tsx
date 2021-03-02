import React from "react";
import { FC } from "react";
import { StyledCard } from "../App";
import { useEntriesSummaryQuery } from "../generated-api";
import "./styles.css";

export const Summary: FC<{ path: string }> = ({ path }) => {
  const { data, loading, error } = useEntriesSummaryQuery({
    variables: { path },
  });

  if (loading) {
    return <StyledCard>{`...Loading`}</StyledCard>;
  }

  if (error) {
    return <StyledCard>{`Error`}</StyledCard>;
  }

  return (
    <StyledCard>
      <div className="file">
        <p>Path: {path}</p>
        <p>Total Size: {data?.entriesSummary?.totalSize}</p>
        <p>Total Number of Files: {data?.entriesSummary?.totalNumberOfFiles}</p>
      </div>
    </StyledCard>
  );
};
