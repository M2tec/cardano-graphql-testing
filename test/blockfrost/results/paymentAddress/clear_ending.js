import fs from "fs";
import path from "path";

const folderPath = "./"; // change to your folder path

fs.readdirSync(folderPath).forEach((file) => {
  if (file.endsWith(".json")) {
    const filePath = path.join(folderPath, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Remove unwanted properties
    delete data.stake_address;
    delete data.type;
    delete data.script;

    // Save file back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Cleaned: ${file}`);
  }
});