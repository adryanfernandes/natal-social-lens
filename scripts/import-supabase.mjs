import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as XLSX from "xlsx";

const projectUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const bucket = "excel-fontes";
const files = ["2026_BDTrabalhado_10Abril_Karine.xlsx", "dicionariotudo.xlsx"];

if (!projectUrl || !serviceRoleKey) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers ?? {}) },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }
  return response;
}

async function uploadFile(fileName) {
  const filePath = path.join(dataDir, fileName);
  const content = await fs.readFile(filePath);
  const url = `${projectUrl}/storage/v1/object/${bucket}/${encodeURIComponent(fileName)}`;
  await request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "x-upsert": "true",
    },
    body: content,
  });
  console.log(`Arquivo enviado: ${fileName}`);
}

async function importRows(fileName) {
  const filePath = path.join(dataDir, fileName);
  const workbook = XLSX.read(await fs.readFile(filePath), { type: "buffer", cellDates: false });
  const rows = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: true,
    });

    sheetRows.forEach((values, index) => {
      const data = Object.fromEntries(values.map((value, column) => [`column_${column + 1}`, value]));
      rows.push({ source_file: fileName, sheet_name: sheetName, row_number: index + 1, data });
    });
  }

  const tableUrl = `${projectUrl}/rest/v1/excel_rows?on_conflict=source_file,sheet_name,row_number`;
  for (let offset = 0; offset < rows.length; offset += 500) {
    const batch = rows.slice(offset, offset + 500);
    await request(tableUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(batch),
    });
  }
  console.log(`Linhas importadas: ${fileName} (${rows.length})`);
}

for (const fileName of files) {
  await uploadFile(fileName);
  await importRows(fileName);
}
