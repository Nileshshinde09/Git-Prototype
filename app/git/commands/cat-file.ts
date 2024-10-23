import path from "path";
import fs from "fs";
import zlib from "zlib";
class CatFileCommand {
  flag: string;
  commitSMA: string;

  constructor(flag: string, commitSMA: string) {
    this.flag = flag;
    this.commitSMA = commitSMA;
  }

  execute(): void {
    const flag = this.flag;
    const commitSMA = this.commitSMA;
    switch (flag) {
      case "-p":
        {
          const folder = commitSMA.slice(0, 2);
          const file = commitSMA.slice(2);
          const completePath = path.join(
            process.cwd(),
            ".git",
            "object",
            folder,
            file
          );
          if (!completePath) {
            throw new Error(`Not a valid object name ${commitSMA}`);
          }
          const fileContents = fs.readFileSync(completePath);
          const outputBuffer = zlib.inflateSync(fileContents);
          const output = outputBuffer.toString().split("\x00")[1];
          process.stdout.write(output);
        }
        break;

      default:
        break;
    }
  }
}

export { CatFileCommand };
