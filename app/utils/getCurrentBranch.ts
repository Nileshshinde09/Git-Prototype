import fs from "fs"
import path from "path";
const getCurrentBranch = ():string|null => {
    try {
        const headPath = path.join('.git', 'HEAD');
        const headFileContent = fs.readFileSync(headPath, 'utf-8').trim();
        if (headFileContent.startsWith('ref:')) {
          const branch = headFileContent.split('/').slice(2).join('/');
          return branch;
        } else {
          return 'Detached HEAD at commit ' + headFileContent;
        }
      } catch (error) {
        console.error('Error reading .git/HEAD file:', error);
        return null;
      }
}

export default getCurrentBranch

