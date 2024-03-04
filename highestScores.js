const fs = require("fs");
function parseLine(line) {
  const separatorIndex = line.indexOf(": ");
  if (separatorIndex === -1) {
    throw new Error("Invalid format");
  }
  const scoreStr = line.substring(0, separatorIndex);
  const jsonStr = line.substring(separatorIndex + 2); 
  return {
    score: parseInt(scoreStr, 10),
    jsonStr: jsonStr.trim(),
  };
}

function readAndProcessFile(filePath, n) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.split("\n");
  let records = [];

  for (const line of lines) {
    if (line.trim() === "") continue; 
    let { score, jsonStr } = parseLine(line);
    try {
      const json = JSON.parse(jsonStr);
      if (!json.id) throw new Error('JSON object does not have an "id" key');
      records.push({ score, id: json.id });
    } catch (e) {
      console.error(`Error processing line: ${line}`);
      console.error(`JSON parse error: ${e.message}`);
      return; 
    }
  }

  // Sort records
  records.sort((a, b) => b.score - a.score);
  console.log(JSON.stringify(records.slice(0, n), null, 2));
}


const filePath = "./score_recs.data"; 
const n = 2; // Number of top scores to return

if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}

try {
  readAndProcessFile(filePath, n);
} catch (error) {
  console.error("An error occurred:", error.message);
  process.exit(1);
}
