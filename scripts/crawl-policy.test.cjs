const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const source = readFileSync(resolve(__dirname, '../robots.txt'), 'utf8')
const groups = source.split(/\r?\n\s*\r?\n/).map(block => ({
  agents: [...block.matchAll(/^User-agent:\s*(.+)$/gm)].map(match => match[1].trim()),
  allow: /^Allow:\s*\/\s*$/m.test(block), disallow: /^Disallow:\s*\/\s*$/m.test(block),
}))
for (const agent of ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended']) {
  test(`${agent}: training denied`, () => assert.equal(groups.find(group => group.agents.includes(agent))?.disallow, true))
}
for (const agent of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User']) {
  test(`${agent}: search/retrieval allowed`, () => {
    const group = groups.find(group => group.agents.includes(agent))
    assert.equal(group?.allow, true)
    assert.equal(group?.disallow, false)
  })
}
test('overrides the default training signal and retains canonical sitemap', () => {
  assert.match(source, /Content-Signal: ai-train=no, search=yes, ai-input=yes/)
  assert.match(source, /Sitemap: https:\/\/docs\.aura\.markets\/sitemap.xml/)
})
