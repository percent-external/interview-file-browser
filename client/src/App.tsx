import React from "react";
import styled from "styled-components";
import { Card } from "@material-ui/core";
import "./App.css";
import { useListEntriesQuery } from "./generated-api";
import { Folder } from "./components/Folder";
import { File } from "./components/File";
import { Summary } from "./components/Summary";

export const StyledCard = styled(Card)`
  border: 1px solid gray;
  width: 300px;
  padding: 8px;
  margin: 8px;
`;

function App() {
  const { data, loading, error } = useListEntriesQuery({
    variables: { path: "/" },
  });

  if (loading) {
    return <div>...Loading</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="App">
      <Summary path={"/"} />
      {data?.listEntries?.entries.map((entry, index) => {
        switch (entry?.__typename) {
          case "Directory":
            return <Folder key={index} {...entry} />;
          case "File":
            return <File key={index} {...entry} />;
        }
      })}
    </div>
  );
}

export default App;
