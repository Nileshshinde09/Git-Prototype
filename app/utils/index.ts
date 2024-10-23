import * as fs from "fs";
import { CatFileCommand } from "../git/commands/cat-file";
import { GitClient } from "../git/client";
import { HashObjectCommand } from "../git/commands/hash-object";
import getCurrentBranch from "./getCurrentBranch";
import { LSTreeCommand } from "../git/commands/ls-tree";

const args = process.argv.slice(2);
export type command = string | null;
const currentBranch = getCurrentBranch();
enum CommitEnum{
    COMMIT_COMMAND="commit",
    COMMIT_FLAG="-m"
}
const handleCommit=()=>{
 console.log("hello");
 
  const commitFlag = process.argv[4];
  // if(CommitEnum.COMMIT_COMMAND===commitCommand){

  // }

}



const isGitCommitHash = (input: string) => {
  const sha1Regex = /^[a-f0-9]{40}$/;
  return sha1Regex.test(input);
};

export enum FlagsEnum {
  RECURSIVE = "-r",
  RECURSIVE_LONG = "-rl",
  RECURSIVE_TREE = "-rt",
  LONG = "-l"
}

export enum PointerEnum {
  HEAD = "HEAD"
}

const handleLsTree = () => {
  const inp1 = process.argv[3]; 
  const inp2 = process.argv[4]; 
  const inp3 = process.argv[5]; 

  let flag: FlagsEnum | null = null;
  let pointer: PointerEnum | string | null = null;
  let objectLengthFlag: FlagsEnum | null = null;

  if (!inp1) {
    console.error("Usage: git ls-tree [<options>] <tree-ish> [<path>...]");
    return;
  }

  if (Object.values(FlagsEnum).includes(inp1 as FlagsEnum)) {
    flag = inp1 as FlagsEnum;
  } else if (inp1 === PointerEnum.HEAD || currentBranch === inp1 || isGitCommitHash(inp1)) {
    pointer = inp1 as PointerEnum;
  } else {
    console.error(`Invalid tree-ish or flag: ${inp1}`);
    return;
  }

  if (inp2) {
    if (Object.values(FlagsEnum).includes(inp2 as FlagsEnum)) {
      objectLengthFlag = inp2 as FlagsEnum;
    } else if (inp2 === PointerEnum.HEAD || currentBranch === inp2 || isGitCommitHash(inp2)) {
      pointer = inp2;
    } else {
      console.error(`Invalid potential branch or commit: ${inp2}`);
      return;
    }
  }

  if (objectLengthFlag && inp3) {
    if (inp3 === PointerEnum.HEAD || isGitCommitHash(inp3)) {
      pointer = inp3;
    } else {
      console.error(`Invalid object length reference: ${inp3}`);
      return;
    }
  }

  const lsTreeCommand = new LSTreeCommand(flag, pointer, objectLengthFlag);
  lsTreeCommand.execute();
};


const createHashObject = () => {
  let flag: command = process.argv[3];
  let path: string = process.argv[4];
  if (!path) {
    path = flag;
    flag = null;
  }
  const hashObject = new HashObjectCommand(flag, path);
  hashObject.execute();
};

const handleCatFileCommand = (): void => {
  const flag: string = process.argv[3];
  const commitSMA: string = process.argv[4];
  const gitClient = new GitClient();
  const command = new CatFileCommand(flag, commitSMA);
  gitClient.run(command);
};

const createInitializeGit = (): void => {
  fs.mkdirSync(".git", { recursive: true });
  fs.mkdirSync(".git/objects", { recursive: true });
  fs.mkdirSync(".git/refs", { recursive: true });
  fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
  console.log("Initialized git directory");
};

export {
  handleCatFileCommand,
  createInitializeGit,
  createHashObject,
  handleLsTree,
  handleCommit
};
