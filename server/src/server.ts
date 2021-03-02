import { ApolloServer, makeExecutableSchema } from "apollo-server";

import { typeDefs } from "./schema";
import {
  Entry,
  Resolvers,
  File,
  Directory,
  Pagination,
} from "./generated/schema";
import {
  Entry as FileSystemEntry,
  File as FileSystemFile,
  Directory as FileSystemDirectory,
  lookupPath,
} from "./db";

const mapFileOutput = (file: FileSystemFile, pathSegments: string[]): File => {
  return {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    path: [...pathSegments, file.name].join("/"),
  };
};

const mapDirectoryOutput = (
  directory: FileSystemDirectory,
  pathSegments: string[]
): Directory => {
  return {
    name: directory.name,
    path: [...pathSegments, directory.name].join("/"),
  };
};

const isFileType = (entry: Entry): entry is File =>
  (entry as File).size !== undefined;

const createSummary = (
  entries: Entry[]
): { totalSize: number; totalNumberOfFiles: number } => {
  let totalSize = 0;
  let totalNumberOfFiles = 0;

  entries.forEach((entry) => {
    totalNumberOfFiles++;
    if (isFileType(entry)) {
      totalSize = totalSize + entry.size;
    } else {
      const result = getEntries(entry.path);
      const { totalSize: size, totalNumberOfFiles: files } = createSummary(
        result
      );
      totalSize = totalSize + size;
      totalNumberOfFiles = totalNumberOfFiles + files;
    }
  });

  return {
    totalSize,
    totalNumberOfFiles,
  };
};

const mapOutput = (entry: FileSystemEntry, pathSegments: string[]): Entry => {
  if (entry.isFile) {
    return mapFileOutput(entry, pathSegments);
  } else {
    return mapDirectoryOutput(entry, pathSegments);
  }
};

const PAGE_SIZE = 25;
const slicePage = <T>(entries: T[], page: number) => {
  const pageCount = Math.ceil(entries.length / PAGE_SIZE);
  if (page < 1) {
    page = 1;
  } else if (page > pageCount) {
    page = pageCount;
  }

  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, entries.length);
  return [...entries].slice(start, end);
};

const buildPagination = (entries: any[], page: number): Pagination => {
  return {
    page,
    pageCount: Math.ceil(entries.length / PAGE_SIZE),
    prevPage: page === 1 ? null : page - 1,
    nextPage: page * PAGE_SIZE >= entries.length ? null : page + 1,
  };
};

const getEntries = (path: string) => {
  const pathSegments = path === "/" ? [""] : path.split("/");
  const result = lookupPath(path.split("/"));

  return result.isFile
    ? [mapOutput(result, pathSegments)]
    : result.entries.map((e) => mapOutput(e, pathSegments));
};

const resolvers: Resolvers = {
  Query: {
    listEntries(_root, { path, page }) {
      page = page || 1;

      if (!path.startsWith("/")) {
        throw new Error(`Path must start with a '/'`);
      }
      const entries = getEntries(path);

      return {
        entries: slicePage(entries, page),
        pagination: buildPagination(entries, page),
      };
    },
    entriesSummary(_root, { path }) {
      if (!path.startsWith("/")) {
        throw new Error(`Path must start with a '/'`);
      }
      const entries = getEntries(path);
      console.log("what are the entries", entries);

      return createSummary(entries);
    },
  },
  Entry: {
    __resolveType(obj: Entry) {
      if (!Object.prototype.hasOwnProperty.call(obj, "path")) {
        return null;
      }

      if (Object.prototype.hasOwnProperty.call(obj, "size")) {
        return "File";
      } else {
        return "Directory";
      }
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers: resolvers as any });

const server = new ApolloServer({ schema });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
