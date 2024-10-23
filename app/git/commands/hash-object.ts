import path from "path";
import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";
class HashObjectCommand {
  flag: string | null;
  filePath: string;
  constructor(flag: string | null, filePath: string) {
    this.flag = flag;
    this.filePath = filePath;
  }
  execute() {
    const filePath = path.resolve(this.filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `could not open '${this.filePath}' for reading: No such file or directory`
      );
    }
    const fileContents: any = fs.readFileSync(filePath);
    const fileLength: number = fileContents.length;
    const header: string = `blob ${fileLength}\0`;
    const blob: Buffer = Buffer.concat([Buffer.from(header), fileContents]);
    const hash = crypto.createHash("sha1").update(blob).digest("hex");
    if (this.flag && this.flag === "-w") {
      const folder: string = hash.slice(0, 2);
      const file: string = hash.slice(0);
      const completeFolderPath = path.join(
        process.cwd(),
        ".git",
        "object",
        folder,
        file
      );
      if (!fs.existsSync(completeFolderPath)) {
        fs.mkdirSync(completeFolderPath);
      }
      const compressedData = zlib.deflateSync(blob);
      fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
    }
    process.stdout.write(hash);
  }
}
export {
    HashObjectCommand
}