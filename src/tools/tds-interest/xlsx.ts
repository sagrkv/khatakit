/**
 * Writes a one-sheet .xlsx workbook in the browser: SpreadsheetML parts in an uncompressed
 * (stored) zip. Numbers become numeric cells, text becomes inline strings.
 */
import { guardText, type Cell } from './csv';

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const escapeXml = (text: string) =>
  text
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function columnName(index: number): string {
  let name = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  }
  return name;
}

function sheetXml(rows: Cell[][]): string {
  const body = rows
    .map((cells, rowIndex) => {
      const row = cells
        .map((cell, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowIndex + 1}`;
          if (typeof cell === 'number') return `<c r="${ref}"><v>${cell}</v></c>`;
          if (cell === '') return '';
          return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(guardText(cell))}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowIndex + 1}">${row}</row>`;
    })
    .join('');
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<sheetData>${body}</sheetData></worksheet>`
  );
}

function workbookParts(rows: Cell[][], sheetName: string): [string, string][] {
  const xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const pkg = 'http://schemas.openxmlformats.org/package/2006';
  const officeRel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  return [
    [
      '[Content_Types].xml',
      `${xml}<Types xmlns="${pkg}/content-types">` +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '</Types>',
    ],
    [
      '_rels/.rels',
      `${xml}<Relationships xmlns="${pkg}/relationships">` +
        `<Relationship Id="rId1" Type="${officeRel}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    ],
    [
      'xl/workbook.xml',
      `${xml}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${officeRel}">` +
        `<sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    ],
    [
      'xl/_rels/workbook.xml.rels',
      `${xml}<Relationships xmlns="${pkg}/relationships">` +
        `<Relationship Id="rId1" Type="${officeRel}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    ],
    ['xl/worksheets/sheet1.xml', sheetXml(rows)],
  ];
}

export function buildXlsx(rows: Cell[][], sheetName = 'Workings'): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const files = workbookParts(rows, sheetName).map(([name, content]) => {
    const data = encoder.encode(content);
    return { name: encoder.encode(name), data, crc: crc32(data) };
  });

  const localSize = files.reduce((sum, file) => sum + 30 + file.name.length + file.data.length, 0);
  const centralSize = files.reduce((sum, file) => sum + 46 + file.name.length, 0);
  const output = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(output.buffer);
  let offset = 0;
  const u16 = (value: number) => {
    view.setUint16(offset, value, true);
    offset += 2;
  };
  const u32 = (value: number) => {
    view.setUint32(offset, value, true);
    offset += 4;
  };
  const bytes = (value: Uint8Array) => {
    output.set(value, offset);
    offset += value.length;
  };
  // Fixed timestamp: 1 January 1980, 00:00.
  const entryHeader = (file: (typeof files)[number]) => {
    u16(20);
    u16(0x0800);
    u16(0);
    u16(0);
    u16(0x21);
    u32(file.crc);
    u32(file.data.length);
    u32(file.data.length);
    u16(file.name.length);
    u16(0);
  };

  const offsets: number[] = [];
  for (const file of files) {
    offsets.push(offset);
    u32(0x04034b50);
    entryHeader(file);
    bytes(file.name);
    bytes(file.data);
  }
  const centralStart = offset;
  files.forEach((file, index) => {
    u32(0x02014b50);
    u16(20);
    entryHeader(file);
    u16(0);
    u16(0);
    u16(0);
    u32(0);
    u32(offsets[index]);
    bytes(file.name);
  });
  u32(0x06054b50);
  u16(0);
  u16(0);
  u16(files.length);
  u16(files.length);
  u32(offset - centralStart);
  u32(centralStart);
  u16(0);
  return output;
}
