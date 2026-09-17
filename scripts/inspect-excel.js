const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const dir = path.join(__dirname, '..', 'src', 'data');
const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.xlsx'));

console.log('FILES:', files);
for (const file of files) {
  const full = path.join(dir, file);
  const wb = XLSX.readFile(full);
  console.log('\nFILE:', file, 'SHEETS:', wb.SheetNames);
  for (const sheetName of wb.SheetNames.slice(0, 3)) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, blankrows: false, defval: '' });
    console.log('---', sheetName);
    rows.slice(0, 8).forEach((r) => console.log(r));
  }
}
