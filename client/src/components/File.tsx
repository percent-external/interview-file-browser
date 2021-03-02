import React from "react";
import { FC } from "react";
import { StyledCard } from "../App";
import { File as FileType } from "../generated-api";
import "./styles.css";

export const File: FC<FileType> = ({ name, size, lastModified }) => {
  return (
    <StyledCard>
      <div className="file">
        <p>{name}</p>
        <p>{size}</p>
        <p>{new Date(lastModified).toLocaleTimeString()}</p>
      </div>
    </StyledCard>
  );
};
