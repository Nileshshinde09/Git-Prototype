import path from "path";
import zlib from "zlib";
import fs from "fs";
import crypto from "crypto";

const writeFileBlob = (currentPath: string): string => {
  const contents: any = fs.readFileSync(currentPath);
  const len: number = contents.length;
  const header: string = `blob ${len}\0`;
  const blob: any = Buffer.concat([Buffer.from(header), contents]);
  const hash = crypto.createHash("sha1").update(blob).digest("hex");
  const folder = hash.slice(0, 2);
  const file = hash.slice(2);
  const completeFolderPath = path.join(
    process.cwd(),
    ".git",
    "objects",
    folder
  );

  if (!fs.existsSync(completeFolderPath)) fs.mkdirSync(completeFolderPath);
  try {
    const compressedData: any = zlib.deflateSync(blob); 
    const gitPath = path.resolve(process.cwd(), ".git", "objects", folder);
    if (!fs.existsSync(gitPath)) fs.mkdirSync(gitPath, { recursive: true }); 

    const filePath = path.join(gitPath, file);
    fs.writeFileSync(filePath, compressedData); 
  } catch (error) {}
  return hash;
};

interface TreeEntry {
  mode: string;
  basename: string;
  sha: string;
}

class WriteTreeCommand {
  constructor() {}

  execute() {
    const recursiveCreateTree = (basePath: string): string | null => {
      const dirContents = fs.readdirSync(basePath);
      const result: TreeEntry[] = [];

      for (const dirContent of dirContents) {
        if (dirContent.includes(".git")) continue;

        const currentPath = path.join(basePath, dirContent);
        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
          const sha = recursiveCreateTree(currentPath);
          if (sha) {
            result.push({
              mode: "40000",
              basename: path.basename(currentPath),
              sha,
            });
          }
        } else if (stat.isFile()) {
          const sha = writeFileBlob(currentPath);
          result.push({
            mode: "100644",
            basename: path.basename(currentPath),
            sha,
          });
        }
      }

      if (dirContents.length === 0 || result.length === 0) return null;

      const treeData = result.reduce((acc: any, current) => {
        return Buffer.concat([
          acc,
          Buffer.from(`${current.mode} ${current.basename}\0`),
          Buffer.from(current.sha, "hex"),
        ]);
      }, Buffer.alloc(0));

      const tree: any = Buffer.concat([
        Buffer.from(`tree ${treeData.length}\0`),
        treeData,
      ]);

      const hash = crypto.createHash("sha1").update(tree).digest("hex");
      const folder = hash.slice(0, 2);
      const file = hash.slice(2);
      const treeFolderPath = path.join(
        process.cwd(),
        ".git",
        "objects",
        folder
      );

      if (!fs.existsSync(treeFolderPath)) fs.mkdirSync(treeFolderPath);

      const compressed: any = zlib.deflateSync(tree);
      fs.writeFileSync(path.join(treeFolderPath, file), compressed);

      return hash;
    };

    const sha = recursiveCreateTree(process.cwd());
    if (sha) {
      process.stdout.write(sha);
    }
  }
}

export { WriteTreeCommand };
