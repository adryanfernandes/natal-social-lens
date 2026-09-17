const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const base = path.join('C:\\', 'git', 'painel_cadunico', 'natal-social-lens', 'src', 'data');
const files = fs.readdirSync(base).filter((f) => f.toLowerCase().endsWith('.xlsx'));

for (const file of files) {
  const fullPath = path.join(base, file);
  console.log('\nFILE:', file);
  const workbook = XLSX.readFile(fullPath);
  console.log('SHEETS:', workbook.SheetNames);
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false, defval: '' });
    console.log('--- SHEET', sheetName, 'first rows:');
    for (let i = 0; i < Math.min(rows.length, 8); i += 1) {
      console.log(JSON.stringify(rows[i]));
    }
  }
}
