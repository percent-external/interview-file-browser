import gql from "graphql-tag";

export const EntriesSummary = gql`
  query EntriesSummary($path: String!) {
    entriesSummary(path: $path) {
      __typename
      totalSize
      totalNumberOfFiles
    }
  }
`;
