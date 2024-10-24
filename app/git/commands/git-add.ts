import path from "path";
import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";
import { execSync } from "child_process";
import pjson from "../../../package.json"
const rootCommand=pjson.scripts.dev || "Not Found"
class AddCommand {
  filePath: string | null;
  status: boolean;
  constructor(fileName: string | null, status: boolean = false) {
    this.status = status;
    this.filePath = fileName ? path.join(process.cwd(), fileName) : null;
  }

  async execute() {
    if (this.status) {
      const cwd = process.cwd();
      const modifiedFiles = this.getModifiedFiles(cwd);
      const untrackedFiles = this.getUntrackedFiles(cwd);

      this.printStatus(modifiedFiles, untrackedFiles);
      return;
    }
    if (this.filePath) {
      await this.addFile(this.filePath);
    } else {
      await this.addAllFiles();
    }
  }

  async addFile(filePath: string) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(
        `Could not open '${filePath}' for reading: No such file or directory`
      );
    }
    const hash = await this.hashObject(absolutePath);
    this.saveToObjectStore(hash, absolutePath);
    process.stdout.write(`Added file: ${filePath} with hash: ${hash}\n`);
  }

  async addAllFiles() {
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    const gitignoreContent = fs.existsSync(gitignorePath)
      ? fs.readFileSync(gitignorePath, "utf-8").split("\n")
      : [];

    const files = this.listFiles(process.cwd(), gitignoreContent);
    for (const file of files) {
      await this.addFile(file);
    }
  }

  listFiles(dir: string, gitignoreContent: string[]) {
    let result: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result = result.concat(this.listFiles(fullPath, gitignoreContent));
      } else if (!gitignoreContent.includes(entry.name)) {
        result.push(fullPath);
      }
    }
    return result;
  }

  async hashObject(filePath: string): Promise<string> {
    const fileContents: any = fs.readFileSync(filePath);
    const fileLength = fileContents.length;
    const header = `blob ${fileLength}\0`;
    const blob: any = Buffer.concat([Buffer.from(header), fileContents]);
    return crypto.createHash("sha1").update(blob).digest("hex");
  }

  saveToObjectStore(hash: string, filePath: string) {
    const folder = hash.slice(0, 2);
    const file = hash.slice(2);
    const completeFolderPath = path.join(
      process.cwd(),
      ".git",
      "objects",
      folder
    );
    if (!fs.existsSync(completeFolderPath)) {
      fs.mkdirSync(completeFolderPath, { recursive: true });
    }
    const compressedData: any = zlib.deflateSync(
      Buffer.concat([
        Buffer.from(`blob ${file.length}\0`),
        fs.readFileSync(filePath),
      ])
    );
    fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
  }
  getUntrackedFiles(cwd: string): string[] {
    const gitDir = path.join(cwd, ".git");
    const untrackedFiles: string[] = [];

    const statusOutput = execSync(`git status --porcelain`, { cwd })
      .toString()
      .trim();
    const lines = statusOutput.split("\n");

    for (const line of lines) {
      if (line.startsWith("??")) {
        const filePath = line.slice(3).trim(); 
        untrackedFiles.push(filePath);
      }
    }

    return untrackedFiles;
  }
  getModifiedFiles(cwd: string): string[] {
    const gitDir = path.join(cwd, ".git");
    const indexFile = path.join(gitDir, "index");
    const modifiedFiles: string[] = [];

    const statusOutput = execSync(`git status --porcelain`, { cwd })
      .toString()
      .trim();
    const lines = statusOutput.split("\n");

    for (const line of lines) {
      if (line.startsWith(" M")) {
        const filePath = line.slice(3).trim(); // Remove the status prefix
        modifiedFiles.push(filePath);
      }
    }

    return modifiedFiles;
  }
  printStatus(modifiedFiles: string[], untrackedFiles: string[]) {
    console.log(`On branch main`);

    if (modifiedFiles.length > 0) {
      console.log(`Changes not staged for commit:`);
      console.log(
        `  (use "${rootCommand} add <file>..." to update what will be committed)`
      );
      console.log(
        `  (use "${rootCommand} restore <file>..." to discard changes in working directory)`
      );
      modifiedFiles.forEach((file) =>
        console.log(`        modified:   ${file}`)
      );
      console.log();
    }

    if (untrackedFiles.length > 0) {
      console.log(`Untracked files:`);
      console.log(
        `  (use "${rootCommand} add <file>..." to include in what will be committed)`
      );
      untrackedFiles.forEach((file) => console.log(`        ${file}`));
      console.log();
    }

    if (modifiedFiles.length === 0 && untrackedFiles.length === 0) {
      console.log(
        `no changes added to commit (use "${rootCommand} add" and/or "${rootCommand} commit -a")`
      );
    }
  }

  async reset() {
    const gitDir = path.join(process.cwd(), ".git");
    const objectsDir = path.join(gitDir, "objects");
    fs.rmSync(objectsDir, { recursive: true, force: true });
    process.stdout.write("Reset all added files.\n");
  }
}

export { AddCommand };
