# Lab Canary

Can people who work at AI labs tell the public when something's wrong?

Lab Canary scores AI labs' staff contracts and speak-up policies against a simple standard: protect real secrets, never gag criticism or whistleblowing. Every rating links to a public source.

Live at **https://labcanary.com**

## How it works

- **The standard** is seven clauses, in [`public/criteria.json`](public/criteria.json).
- **The ratings** are in [`public/ratings.json`](public/ratings.json): one entry for each lab and clause where there's public evidence. Anything not listed shows as "Not public".
- **The publicly evidenced score** is clauses met, plus half for each one partly met, out of seven.
- Each clause has equal weight. Equal scores can combine different ratings and evidence gaps; they do not mean identical protections. The scorecard explains Anthropic and OpenAI's totals using the current ratings.
- Both "Falls short" and "Not public" score zero, but mean different things. "Falls short" means the public evidence shows it doesn't meet the clause. "Not public" means there is not enough public evidence to check. A lab that wants credit can publish its terms. Not-public counts appear beside each lab's score.
- A "Meets" rating needs evidence for the complete criterion, from a written policy or the contract wording. One public statement (an interview comment, or a statement reported in the press) earns "Partly" at most. Use "Partly" when the evidence supports only part of it.

## Suggest a correction

[Open an issue](https://github.com/johnny1011/labcanary/issues), or a pull request that edits `public/ratings.json`. Please include a link to a public source. Ratings without a public source won't be added.

## For labs: opting in

Publish your standard employment, exit and equity terms (redacted is fine) and your speak-up policy, then open an issue linking to them. Each clause will be rated with the exact wording that earned it.

## Editing the data

Each rating in `public/ratings.json` looks like this:

```json
{
  "lab": "OpenAI",
  "clause": "C2",
  "rating": "Partly",
  "evidence": "One or two plain sentences on what the source shows.",
  "source": "Name of the source",
  "url": "https://...",
  "date": "2024-05-23"
}
```

- `rating` is one of `Meets`, `Partly`, `Falls short` or `Not public`.
- `date` is `YYYY-MM-DD`, or `YYYY-MM` if the source only gives a month.
- Update `updated` at the top of the file whenever you change a rating.
- Add a lab's name to `optedIn` once it has opted in.

When a rating combines claims from different documents, keep the main source in `source`, `url` and `date`. Add the other sources in an optional `additionalSources` array:

```json
"additionalSources": [
  {
    "source": "Name of the supporting source",
    "url": "https://...",
    "date": "2026-07-11"
  }
]
```

The detail panel and evidence table display every source with its date. State whether evidence is a company commitment, a reported allegation, or an independent assessment. Date historical promises and attribute reported policy changes to their source.

When scores or headline wording change, refresh `public/og.png` so social previews stay accurate.

Changes pushed to `main` go live automatically.

## Licence

Code: MIT (see [LICENSE](LICENSE)). Data and text: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Made by Jonathan Hind ([@import_hind](https://x.com/import_hind)).
