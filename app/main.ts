import {
  createInitializeGit,
  handleCatFileCommand,
  createHashObject,
  handleLsTree,
  handleCommit,
  handleWriteTree,
  handleReset,
  handleStatus,
  handleAddFile,
  handleAddAll,
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
  Status = "status",
  Reset = "reset",
  AddAll = "add .",
  AddFile = "add",
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
  case Commands.AddAll:
    handleAddAll();
    break;
  case Commands.AddFile:
    handleAddFile();
    break;
  case Commands.Status:
    handleStatus();
    break;
  case Commands.Reset:
    handleReset();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
