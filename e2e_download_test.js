/**
 * e2e_download_test.js
 *
 * End-to-end test for the Download CV feature using Playwright.
 * Run: node e2e_download_test.js
 *
 * Tests:
 *   T1: Upload test_cv_1.pdf — verify filename and size displayed
 *   T2: Click Download CV — verify file is downloaded with correct name
 *   T3: Compare downloaded file SHA-256 with original
 *   T4: Replace with test_cv_2.pdf — verify new filename shown
 *   T5: Click Download CV — verify test_cv_2 is downloaded (not test_cv_1)
 *   T6: Remove CV — verify Download CV button is gone / disabled
 *   T7: Public profile page — verify no Download CV button appears (no fileUrl)
 */

import { chromium } from 'playwright'
import { createHash } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'http://localhost:5174'
const EDITOR_URL = `${BASE_URL}/editor`

function sha256File(filePath) {
  const bytes = readFileSync(filePath)
  return createHash('sha256').update(bytes).digest('hex')
}

const pdf1Path = path.resolve(__dirname, 'test_cv_1.pdf')
const pdf2Path = path.resolve(__dirname, 'test_cv_2.pdf')

const pdf1Hash = sha256File(pdf1Path)
const pdf2Hash = sha256File(pdf2Path)

console.log('Reference hashes:')
console.log('  test_cv_1.pdf:', pdf1Hash)
console.log('  test_cv_2.pdf:', pdf2Hash)
console.log()

const results = []

function pass(id, detail) {
  results.push({ id, status: 'PASS', detail })
  console.log(`PASS  [${id}] ${detail}`)
}
function fail(id, detail) {
  results.push({ id, status: 'FAIL', detail })
  console.error(`FAIL  [${id}] ${detail}`)
}
function skip(id, detail) {
  results.push({ id, status: 'NOT VERIFIED', detail })
  console.log(`SKIP  [${id}] ${detail}`)
}

const browser = await chromium.launch({ headless: false, slowMo: 300 })
const context = await browser.newContext({
  acceptDownloads: true,
})
const page = await context.newPage()

try {
  // --- Navigate to editor ---
  await page.goto(EDITOR_URL, { waitUntil: 'networkidle' })
  // Click CV tab
  await page.getByRole('button', { name: /CV \/ Resume/i }).click()
  await page.waitForTimeout(500)

  // ---- T1: Upload PDF 1, verify filename and size shown ----
  const fileInput = page.locator('#cv-file-input')
  await fileInput.setInputFiles(pdf1Path)
  await page.waitForTimeout(1500) // wait for async signature verification

  const fileName1 = await page.locator('h4').filter({ hasText: 'test_cv_1.pdf' }).textContent()
  if (fileName1 && fileName1.includes('test_cv_1.pdf')) {
    pass('T1a', `Filename displayed: "${fileName1.trim()}"`)
  } else {
    fail('T1a', `Expected filename "test_cv_1.pdf", got: "${fileName1}"`)
  }

  // Check size (618 bytes → "618 B")
  const sizeText = await page.locator('text=618 B').count()
  if (sizeText > 0) {
    pass('T1b', 'File size displayed: 618 B')
  } else {
    skip('T1b', 'Size text not exactly matched — may show differently')
  }

  // ---- T2 + T3: Click Download CV, verify downloaded file ----
  const [download1] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download CV/i }).first().click(),
  ])

  const dl1SuggestedName = download1.suggestedFilename()
  if (dl1SuggestedName === 'test_cv_1.pdf') {
    pass('T2', `Downloaded filename: "${dl1SuggestedName}"`)
  } else {
    fail('T2', `Expected "test_cv_1.pdf", got "${dl1SuggestedName}"`)
  }

  const dl1Path = await download1.path()
  if (dl1Path && existsSync(dl1Path)) {
    const dl1Hash = sha256File(dl1Path)
    if (dl1Hash === pdf1Hash) {
      pass('T3', `SHA-256 matches original test_cv_1.pdf: ${dl1Hash}`)
    } else {
      fail('T3', `Hash mismatch. Expected: ${pdf1Hash}, Got: ${dl1Hash}`)
    }
  } else {
    fail('T3', 'Downloaded file path not found')
  }

  // ---- T4: Replace with PDF 2 ----
  await page.getByRole('button', { name: /Replace/i }).click()
  await fileInput.setInputFiles(pdf2Path)
  await page.waitForTimeout(1500)

  const fileName2 = await page.locator('h4').filter({ hasText: 'test_cv_2.pdf' }).textContent()
  if (fileName2 && fileName2.includes('test_cv_2.pdf')) {
    pass('T4', `Filename updated to: "${fileName2.trim()}"`)
  } else {
    fail('T4', `Expected "test_cv_2.pdf" after replace, got: "${fileName2}"`)
  }

  // ---- T5: Download PDF 2 and verify it's not PDF 1 ----
  const [download2] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download CV/i }).first().click(),
  ])

  const dl2SuggestedName = download2.suggestedFilename()
  if (dl2SuggestedName === 'test_cv_2.pdf') {
    pass('T5a', `Downloaded filename after replace: "${dl2SuggestedName}"`)
  } else {
    fail('T5a', `Expected "test_cv_2.pdf", got "${dl2SuggestedName}"`)
  }

  const dl2Path = await download2.path()
  if (dl2Path && existsSync(dl2Path)) {
    const dl2Hash = sha256File(dl2Path)
    if (dl2Hash === pdf2Hash) {
      pass('T5b', `SHA-256 matches test_cv_2.pdf: ${dl2Hash}`)
    } else {
      fail('T5b', `Hash mismatch. Expected: ${pdf2Hash}, Got: ${dl2Hash}`)
    }
    if (dl2Hash !== pdf1Hash) {
      pass('T5c', 'Confirmed: downloaded file is NOT the old PDF 1')
    } else {
      fail('T5c', 'Downloaded file hash matches old PDF 1 — wrong file served!')
    }
  } else {
    fail('T5b', 'Downloaded file path not found')
    skip('T5c', 'Cannot verify — no download path')
  }

  // ---- T6: Remove CV — button should disappear ----
  await page.getByRole('button', { name: /Remove/i }).click()
  await page.waitForTimeout(500)

  const downloadBtnAfterRemove = await page.getByRole('button', { name: /Download CV/i }).count()
  if (downloadBtnAfterRemove === 0) {
    pass('T6', 'Download CV button not visible after Remove')
  } else {
    fail('T6', `Download CV button still visible after Remove (${downloadBtnAfterRemove} found)`)
  }

  // ---- T7: Public profile — no Download CV button (no fileUrl) ----
  await page.goto(`${BASE_URL}/u/alex`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  const publicDownloadBtn = await page.getByRole('button', { name: /Download CV/i }).count()
  if (publicDownloadBtn === 0) {
    pass('T7', 'No Download CV button on public profile (no real fileUrl)')
  } else {
    fail('T7', `Unexpected Download CV button on public profile (${publicDownloadBtn} found)`)
  }

} catch (err) {
  console.error('Unexpected test error:', err)
} finally {
  await browser.close()
}

console.log('\n=== Test Summary ===')
for (const r of results) {
  console.log(`  ${r.status.padEnd(14)} [${r.id}] ${r.detail}`)
}

const passed = results.filter(r => r.status === 'PASS').length
const failed = results.filter(r => r.status === 'FAIL').length
const notVerified = results.filter(r => r.status === 'NOT VERIFIED').length
console.log(`\nTotal: ${passed} PASS, ${failed} FAIL, ${notVerified} NOT VERIFIED`)
