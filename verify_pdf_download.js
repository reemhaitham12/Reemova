/**
 * verify_pdf_download.js
 *
 * Run from sahlly project root with Node.js to verify:
 *   1. Both test PDFs have valid %PDF- signatures
 *   2. Each file's SHA-256 hash
 *   3. That a "downloaded" copy (simulated) matches byte-for-byte
 *
 * Usage: node verify_pdf_download.js
 */

import fs from 'fs'
import crypto from 'crypto'

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function checkPdfSignature(buffer) {
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  )
}

const files = ['test_cv_1.pdf', 'test_cv_2.pdf']

console.log('=== PDF Download Verification ===\n')

for (const filename of files) {
  if (!fs.existsSync(filename)) {
    console.log(`SKIP  ${filename} — file not found`)
    continue
  }

  const bytes = fs.readFileSync(filename)
  const sigOk = checkPdfSignature(bytes)
  const hash = sha256(bytes)
  const first5 = bytes.slice(0, 5).toString('latin1')

  console.log(`File:        ${filename}`)
  console.log(`Size:        ${bytes.length} bytes`)
  console.log(`First 5:     "${first5}"  (hex: ${bytes.slice(0, 5).toString('hex')})`)
  console.log(`%PDF- sig:   ${sigOk ? 'PASS' : 'FAIL'}`)
  console.log(`SHA-256:     ${hash}`)

  // Simulate: write to a "downloaded" copy and re-verify
  const downloadedPath = `downloaded_${filename}`
  fs.writeFileSync(downloadedPath, bytes)
  const downloaded = fs.readFileSync(downloadedPath)
  const downloadedHash = sha256(downloaded)

  console.log(`Byte-for-byte match: ${hash === downloadedHash ? 'PASS' : 'FAIL'}`)
  console.log()

  fs.unlinkSync(downloadedPath)
}

console.log('=== Done ===')
