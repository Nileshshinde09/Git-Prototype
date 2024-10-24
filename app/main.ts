import {
  createInitializeGit,
  handleCatFileCommand,
  createHashObject,
  handleLsTree,
  handleCommit,
  handleWriteTree
} from "./utils";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  Cat_File = "cat-file",
  HashObject = "hash-object",
  LsTree = "ls-tree",
  Commit = "commit",
  WriteTree = "write-tree",
}

switch (command) {
  case Commands.Init:
    createInitializeGit();
    break;
  case Commands.Cat_File:
    handleCatFileCommand();
    break;
  case Commands.HashObject:
    createHashObject();
    break;
  case Commands.LsTree:
    handleLsTree();
    break;
  case Commands.Commit:
    handleCommit();
    break;
  case Commands.WriteTree:
  handleWriteTree();  
  break;
  default:
    throw new Error(`Unknown command ${command}`);
}
