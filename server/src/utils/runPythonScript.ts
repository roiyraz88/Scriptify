import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const runPythonScript = async (code: string): Promise<string> => {
  const tempDir = path.join(__dirname, "../../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, `script_${Date.now()}.py`);
  fs.writeFileSync(filePath, code);

  try {
    const { stdout } = await execAsync(`python3 "${filePath}"`);
    return stdout;
  } catch (err: any) {
    throw new Error(`Script execution failed: ${err.stderr || err.message}`);
  } finally {
    fs.unlinkSync(filePath);
  }
};
