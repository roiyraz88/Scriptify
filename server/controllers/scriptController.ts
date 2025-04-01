import { Response, Request } from "express";
import { generateScript } from "../services/scriptService";
import fs from "fs";
import path from "path";


const fileName = `send_email_${Date.now()}.py`;
const filePath = path.join(__dirname, "../scripts", fileName);

const generateEmailScript = (req: Request, res: Response) => {
  const { subject, body } = req.body;
  if (!subject || !body) {
    return res.status(400).json({ error: "Subject and body are required" });
  }

  try {
    const script = generateScript(subject, body);
    fs.writeFileSync(filePath, script, { encoding: "utf8" });
    return res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        return res.status(500).json({ error: "Error downloading the file" });
        }});
      } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while generating the script" });
  }
};

export { generateEmailScript };
