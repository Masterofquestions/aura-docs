# Aura Documentation

The official documentation for [Aura](https://aurabets.io) — decentralized
prediction markets on Alephium.

**Live site:** [docs.aurabets.io](https://docs.aurabets.io)

This repository contains the source of the Aura docs site, which covers:

- **Guides** — getting started, connecting a wallet, bridging USDT, trading,
  creating markets, dispute resolution, and governance.
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
  errors.mdx
  openapi.json          Auto-generated OpenAPI 3.1 spec

logo/                   Brand assets (light + dark)
favicon.png
```

## Community

- **App** — <https://testnet.aurabets.io>
- **Telegram** — <https://t.me/AuraMarkets>
- **X (Twitter)** — <https://x.com/AuraMarkets>

## License

The documentation in this repository is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — you are
free to share and adapt the material, with attribution and under the same
license. Code snippets within the documentation are dedicated to the public
domain (CC0).
