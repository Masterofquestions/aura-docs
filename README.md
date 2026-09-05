# Aura Documentation

The official documentation for [Aura](https://aura.markets), decentralized
prediction markets on Alephium.

**Live site:** [docs.aura.markets](https://docs.aura.markets)

This repository contains the source of the Aura docs site, which covers:

- **Guides** — getting started, how the built-in wallet works, deposits and
  withdrawals, trading, creating markets, dispute resolution, and governance.
- **Tokens & Vault** — $AURA tokenomics, the staking tier system, and how
  fees and rewards flow through the protocol.
- **Tutorials** — step-by-step walkthroughs and best-practice guides for
  market creators and traders.
- **API Reference** — the public REST API used by integrators, trading bots,
  and partner applications.

## Contributing

Found a typo, a broken link, or a section that needs clarification? PRs are
welcome.

1. Fork this repository.
2. Edit the relevant `.mdx` file. Pages are organized by section
   (`overview/`, `getting-started/`, `markets/`, `tokens/`, `governance/`,
   `tutorials/`, `support/`, `api-reference/`).
3. Open a pull request describing your change.

For substantive content changes (new pages, restructured sections), please
open an issue first so we can discuss scope before you spend time writing.

`api-reference/openapi.json` is the one file to leave alone. It is generated
from the API's live route definitions in the private `aura` monorepo and
overwritten on every sync, so hand edits are lost. It also carries only the
public subset of the API, since internal endpoint families are filtered out
before publishing. To change it, change the route and re-run
`npm run docs:sync-openapi` in the monorepo.

## Local preview

The docs are built with [Mintlify](https://mintlify.com). To preview your
changes locally:

```bash
# One-time install
npm install -g mintlify

# From the repo root
mintlify dev
```

The preview runs at <http://localhost:3000> with hot reload. Use
`mintlify broken-links` before opening a PR to catch any dead internal
references.

> Windows users: `mintlify dev` requires symlink permission. If you see an
> `EPERM` error, enable Developer Mode in **Settings → Privacy & Security →
> For developers**, or run your terminal as Administrator. Mintlify also
> posts a hosted preview URL on every PR, which works regardless of your
> local setup.

## Editing conventions

- **Voice** — second person ("you"), present tense, short sentences.
- **Frontmatter** — every page starts with `title` and `description`.
- **Components** — Mintlify provides `<Card>`, `<Steps>`, `<Tabs>`,
  `<Accordion>`, `<CodeGroup>`, and more. See
  [Mintlify components](https://mintlify.com/docs/components) for the full
  list.
- **Internal links** — use root-relative paths without the `.mdx` extension,
  e.g. `[Tier Structure](/tokens/tier-structure)`.
- **Math** — KaTeX is enabled. Inline `\(...\)`, block `$$...$$`.
- **Images** — drop in `images/` and reference with `/images/foo.png`.
  Prefer SVG for diagrams; keep PNGs under 500&nbsp;KB.

## Repository layout

```
docs.json               Site configuration (navigation, theme, colors)
index.mdx               Landing page

overview/               Welcome, introduction, why Alephium, roadmap
getting-started/        Connecting, passkeys, bridging
markets/                Creating, trading, resolution, rewards
tokens/                 ALPH, $AURA, tier structure, staking
governance/             Outcome voting, proposal voting
tutorials/              User tutorials, best practices, strategies
support/                FAQ, contact

api-reference/          API tab
  introduction.mdx
  authentication.mdx
  rate-limits.mdx
  build-tx-flow.mdx
  integrator-guide.mdx
  errors.mdx
  openapi.json          Generated OpenAPI 3.1 spec. DO NOT EDIT BY HAND.

logo/                   Brand assets (light + dark)
favicon.png
```

## Community

- **App** — <https://aura.markets>
- **Telegram** — <https://t.me/AuraMarkets>
- **X (Twitter)** — <https://x.com/AuraMarkets>

## License

The documentation in this repository is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — you are
free to share and adapt the material, with attribution and under the same
license. Code snippets within the documentation are dedicated to the public
domain (CC0).

## Publishing at both Aura addresses

The authored guides in this repository serve two readers: Mintlify at
`https://docs.aura.markets`, and Aura's own constrained renderer at
`https://aura.markets/docs`. The subdomain remains the canonical URL for each
matching document. Mintlify appends each page path to `seo.metatags.canonical`;
do not replace deep-page canonicals with the homepage.

After reviewing and committing a content update, run in the sibling Aura repo:

```sh
npm --workspace app run docs:sync -- ../aura-docs <full-reviewed-commit>
npm --workspace app test -- src/lib/docsCompiler.test.ts src/lib/docs.test.ts
```

Review and commit the generated snapshot in Aura. It includes the source commit
and content hashes; app builds require no sibling checkout or live provider
fetch. Unsupported MDX components, imports and expressions fail compilation.
Both sites use the same authored guides; the app uses its own styles, presents
code tabs sequentially and equations as source notation. Provider search and
interactive API/stream explorers remain on the isolated subdomain.

`robots.txt` overrides Mintlify's default training opt-in. It permits search and
retrieval, declines model training, and advertises the canonical docs sitemap.
Run `node --test scripts/crawl-policy.test.cjs` after policy edits. Blocking
Google-Extended also declines Gemini grounding; ordinary Google Search remains
allowed. Robots expresses preferences, not access control. A custom robots file
is served unchanged even if Mintlify's dashboard indexing toggle changes, so
private preview hosting still needs authentication.

Before launch, verify DNS/TLS, direct nested links, canonical tags, the sitemap,
and robots responses on both real hosts. Local tests are not deployment receipts.
