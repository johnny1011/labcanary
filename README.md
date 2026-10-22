# Lab Canary

Can people who work at AI labs tell the public when something's wrong?

Lab Canary scores AI labs' staff contracts and speak-up policies against a simple standard: protect real secrets, never gag criticism or whistleblowing. Every rating links to a public source.

Live at **https://labcanary.com**

## How it works

- **The standard** is seven clauses, in [`public/criteria.json`](public/criteria.json).
- **The ratings** are in [`public/ratings.json`](public/ratings.json): one entry for each lab and clause where there's public evidence. Anything not listed shows as "Not public".
- **The score** is clauses met, plus half for each one partly met, out of seven.
- Ratings use public evidence only. "Not public" means it can't be checked, not that it's bad.

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
  "rating": "Meets",
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

Changes pushed to `main` go live automatically.

## Licence

Code: MIT (see [LICENSE](LICENSE)). Data and text: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Made by Jonathan Hind ([@import_hind](https://x.com/import_hind)).
