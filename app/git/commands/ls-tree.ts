//TODOS: remove file mentioned in .gitignore

import { FlagsEnum, PointerEnum, type command } from "../../utils";
import fs from "fs";
import path from "path";
import crypto from "crypto";

class LSTreeCommand {
  flag: command;
  pointer: command;
  objectLengthFlag: command;
  gitignore: any;
  gitignoreContent: string | null;
  constructor(flag: command, pointer: command, objectLengthFlag: command) {
    this.flag = flag;
    this.pointer = pointer;
    this.objectLengthFlag = objectLengthFlag;
    this.gitignoreContent = null;
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      this.gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      this.gitignoreContent = this.gitignoreContent + "\n.git";
    }
  }

  async execute() {
    switch (this.pointer) {
      case PointerEnum.HEAD: {
        const headPath = path.join(process.cwd(), ".git", "HEAD");
        (async () => {
          const processedFiles = new Set();
          for (let dir of await this.listDirOneLayer(
            process.cwd(),
            FlagsEnum.RECURSIVE === this.flag ||
              FlagsEnum.RECURSIVE_TREE === this.flag ||
              FlagsEnum.RECURSIVE_LONG === this.flag
          )) {
            const relativePath = path.relative(process.cwd(), dir);
            const stats = fs.lstatSync(dir);
            const mode = stats.mode;
            const modeString = mode.toString(8).padStart(6, "0");
            if (
              typeof this.gitignoreContent === "string"
                ? this.gitignoreContent.includes(path.basename(dir))
                  ? path.basename(dir)
                  : false
                : false
            ) {
              continue;
            }
            const displayName = stats.isDirectory()
              ? `${path.basename(dir)}/`
              : `${path.basename(dir)}`;

            if (!processedFiles.has(relativePath)) {
              processedFiles.add(relativePath);
              process.stdout.write(
                `${modeString} ${
                  stats.isDirectory() ? "tree" : "blob"
                } ${this.getHash(dir)} ${
                  this.objectLengthFlag === FlagsEnum.LONG ||
                  FlagsEnum.RECURSIVE_LONG
                    ? stats.size
                    : null
                }  ${displayName}\n`
              );
            }
          }
        })();
        break;
      }
      default:
        break;
    }
  }

  async listDirOneLayer(pathToDir: string, recursive: boolean = false) {
    const result = fs.readdirSync(pathToDir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of result) {
      const fullPath = path.resolve(path.join(pathToDir, entry.name));
      if (entry.isDirectory()) {
        if (recursive) {
          const subDirFiles = await this.listDirOneLayer(fullPath, true);
          files = files.concat(subDirFiles);
        }
      }
      files.push(fullPath);
    }
    return files;
  }

  getHash(filePath: any) {
    const filePathRes = path.resolve(filePath);
    if (!fs.existsSync(filePathRes)) {
      throw new Error(
        `Could not open '${filePath}' for reading: No such file or directory`
      );
    }
    const hash = crypto.createHash("sha1");
    if (fs.statSync(filePathRes).isFile()) {
      const fileContents = fs.readFileSync(filePathRes);
      hash.update(fileContents);
    } else {
      const files = fs.readdirSync(filePathRes);
      for (const file of files) {
        const currentPath = path.join(filePathRes, file);
        if (fs.statSync(currentPath).isFile()) {
          const fileContents = fs.readFileSync(currentPath);
          hash.update(fileContents);
        }
      }
    }

    return hash.digest("hex");
  }
}
export { LSTreeCommand };
