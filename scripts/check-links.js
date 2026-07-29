#!/usr/bin/env node
/**
 * Validates that the Mintlify navigation and every internal link resolve to a
 * real page, so a restructure can't silently ship a dead sidebar entry or a
 * broken cross-reference.
 *
 * Checks:
 *   1. Every page listed in docs.json navigation exists on disk.
 *   2. Every internal markdown/JSX link in every .mdx resolves to a page, a
 *      redirect source, or a generated OpenAPI endpoint page.
 *   3. Every .mdx on disk is reachable from the navigation.
 *   4. Redirect destinations exist.
 *
 * Run: node scripts/check-links.js
 */

const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const docs = JSON.parse(fs.readFileSync(path.join(root, 'docs.json'), 'utf8'))

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

const files = walk(root)
const pages = new Set(
  files.map((f) => path.relative(root, f).replace(/\\/g, '/').replace(/\.mdx$/, '')),
)

// Collect navigation page slugs.
const navPages = new Set()
let openapiSource = null
function collect(node) {
  if (!node) return
  if (Array.isArray(node)) {
    for (const n of node) collect(n)
    return
  }
  if (typeof node === 'string') {
    navPages.add(node.replace(/^\//, ''))
    return
  }
  if (node.openapi) {
    openapiSource = typeof node.openapi === 'string' ? node.openapi : node.openapi.source
    return
  }
  for (const key of ['tabs', 'groups', 'pages', 'anchors', 'navigation']) {
    if (node[key]) collect(node[key])
  }
}
collect(docs.navigation)

const redirectSources = new Set(
  (docs.redirects || []).map((r) => r.source.replace(/^\//, '')),
)
const redirectDests = (docs.redirects || []).map((r) => r.destination.replace(/^\//, ''))

const errors = []
const warnings = []

// 1. Navigation entries must exist.
for (const slug of navPages) {
  if (!pages.has(slug)) errors.push(`nav references missing page: ${slug}`)
}

// 2. Redirect destinations must exist.
for (const dest of redirectDests) {
  if (!pages.has(dest)) errors.push(`redirect destination missing: ${dest}`)
}

// 3. Every page should be reachable from nav.
for (const slug of pages) {
  if (!navPages.has(slug)) warnings.push(`page not in navigation: ${slug}`)
}

// 4. Internal links must resolve.
const linkPattern = /(?:\]\(|href=")(\/[^)"#\s]*)/g
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/')
  const body = fs.readFileSync(file, 'utf8')
  for (const match of body.matchAll(linkPattern)) {
    const target = match[1].replace(/^\//, '').replace(/\/$/, '')
    if (!target) continue
    // Skip static assets.
    if (/\.(png|jpg|jpeg|svg|gif|webp|ico|json|yaml|yml|pdf)$/.test(target)) continue
    if (pages.has(target) || redirectSources.has(target)) continue
    // OpenAPI-generated endpoint pages live under the configured directory.
    if (openapiSource && target.startsWith('api-reference/')) {
      warnings.push(`${rel}: /${target} (assumed OpenAPI-generated)`)
      continue
    }
    errors.push(`${rel}: broken internal link -> /${target}`)
  }
}

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`)
  for (const w of warnings) console.log(`  ! ${w}`)
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`)
  for (const e of errors) console.error(`  x ${e}`)
  process.exit(1)
}

console.log(`\nOK: ${pages.size} pages, ${navPages.size} in navigation, 0 broken links.`)
