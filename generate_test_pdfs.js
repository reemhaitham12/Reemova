import fs from 'fs';

function createSimplePdf(text, _title) {
  const contentStream = `BT /F1 20 Tf 50 100 Td (${text}) Tj ET`;
  const streamLength = Buffer.byteLength(contentStream);

  const objects = [
    `%PDF-1.4\n`,
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  ];

  let offset = 0;
  const xref = ['xref\n0 6\n0000000000 65535 f \n'];
  let body = '';

  for (let i = 0; i < objects.length; i++) {
    if (i > 0) {
      xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    }
    body += objects[i];
    offset = Buffer.byteLength(body);
  }

  const startxref = offset;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return Buffer.from(body + xref.join('') + trailer);
}

const pdf1 = createSimplePdf('Document 1: John Doe CV - Software Engineer', 'CV 1');
const pdf2 = createSimplePdf('Document 2: Jane Smith Resume - Product Designer', 'CV 2');

fs.writeFileSync('test_cv_1.pdf', pdf1);
fs.writeFileSync('test_cv_2.pdf', pdf2);

console.log('PDF 1 created, size:', pdf1.length, 'Signature:', pdf1.slice(0, 5).toString('latin1'));
console.log('PDF 2 created, size:', pdf2.length, 'Signature:', pdf2.slice(0, 5).toString('latin1'));
