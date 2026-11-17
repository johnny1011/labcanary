# Lab Canary

Can people who work at AI labs tell the public when something's wrong?

Lab Canary scores AI labs' staff contracts and speak-up policies against a simple standard: protect real secrets, never gag criticism or whistleblowing. A beta tab does the same for labs' contracts with outside evaluators. Every rating links to a public source.

Live at **https://labcanary.com**

## How it works

- **The standard** is seven clauses, in [`public/criteria.json`](public/criteria.json).
- **The ratings** are in [`public/ratings.json`](public/ratings.json): one entry for each lab and clause where there's public evidence. Anything not listed shows as "Not public".
- **Grades run from A to F.** Each clause is split into three or four parts (`parts` in `criteria.json`). A ("Meets") means the public evidence shows every part. "Partly" is a B when one part is missing, a D when only one part is shown, and a C in between. F ("Falls short") means none, or evidence of the opposite. "Not public" shows as "?".
- **The publicly evidenced score** adds up the grades (A 1, B ¾, C ½, D ¼, F and "?" 0) and divides by seven.
- Each clause has equal weight. Equal scores can combine different ratings and evidence gaps; they do not mean identical protections.
- Both "Falls short" and "Not public" score zero, but mean different things. "Falls short" means the public evidence shows it doesn't meet the clause. "Not public" means there is not enough public evidence to check. A lab that wants credit can publish its terms.
- A "Meets" rating needs evidence for the complete criterion, from a written policy or the contract wording. One public statement (an interview comment, or a statement reported in the press) earns "Partly" at most, so a B. Use "Partly" when the evidence supports only part of it, and list the parts it does support in `met`.

## Evaluator contracts (beta)

A second tab rates what's public about each lab's contracts with outside (third-party) evaluators. It uses the six terms in Jacob Charnock's GovAI post, [Third-party AI evaluation contracts should be published](https://www.governance.ai/analysis/third-party-ai-evaluation-contracts-should-be-published): scope, access, publication rights, pay, conflict rules, and term and renewal. The post lists them as terms to disclose. What counts as meeting each one is Lab Canary's own.

- The terms and their ratings live in [`public/evaluators.json`](public/evaluators.json), in the same shape as `criteria.json` and `ratings.json`. Term ids are `E1`–`E6`; staff clause ids stay `C1`–`C7`, so ids never clash.
- It's graded and scored the same way, out of six, and **separately**. It is never added to the staff score, the score history or the share text for staff contracts.
- The same evidence rules apply: "Meets" needs published terms or contract wording; one public statement earns "Partly" at most.
- If `evaluators.json` is missing or invalid, the page hides the tab and the staff scorecard still loads.
- Links: `#evaluators` opens the tab, `#openai-evaluators` a lab's evaluator summary, and `#openai-e3` one evaluator rating.

### Two pages in one file

The tab works like a separate page. Everything below the scorecard switches with it, so the evaluator page says nothing about staff contracts: it has its own goals, standard, "What 100% looks like", evidence, opt-in steps and Q&A.

- In `public/index.html`, anything marked `data-only="staff"` or `data-only="evaluators"` shows on that page alone. Anything without it is on both.
- The scorecard, evidence, updates and Q&A are on both pages. The page draws the first three from whichever set is showing, and single Q&A answers are marked `data-only`.
- The evaluator page lists only the updates whose `link` opens that page (`#evaluators`, `#openai-e3`, `#openai-evaluators`, `#evaluator-terms`). The staff page lists every update.
- A link to a section only one page has switches to that page. On the evaluator page, a section both pages have is linked as `#evaluator-` plus its id (for example `#evaluator-evidence`), so a reload or a shared link comes back to the same page.
- New text for one page goes in a `data-only` element. Check the other page afterwards to make sure it didn't leak in.

## Example Lab

Example Lab is a made-up lab that meets all seven clauses. It's the last column of the staff scorecard, marked "made up", with an A on every check, so readers can compare the real labs with 100%. Each of its squares lists the clause's parts, shows the model wording for that clause and links to the document that covers it. The "What 100% looks like" section holds the five documents it would publish: a confidentiality agreement, criticism and non-disparagement terms, equity terms, a speak-up policy and a dated statement.

The evaluator page has the same thing for the six terms: Example Lab is its last column, and its "What 100% looks like" section (`#evaluator-example`) holds three documents: an evaluation agreement, conflict-of-interest rules and a scope notice.

- The column is drawn by the page from `EXAMPLE` in [`public/index.html`](public/index.html). It isn't in `ratings.json` or `evaluators.json`, so it never counts in scores, score history, feeds or share text.
- The documents are plain HTML in the `#example-lab` and `#evaluator-example` sections. If you rename a document's `id`, update `EXAMPLE.docs` to match.
- Links: `#example-lab-c1` or `#example-lab-e1` opens one of its squares, and `#example-lab` or `#evaluator-example` goes to the documents.
- The documents reuse the model wording in `criteria.json` and `evaluators.json` with the blanks filled in. When a clause's or term's `model` changes, update the matching Example Lab document too.
- They're drafts. Keep the "no lawyer has checked these" note until a lawyer has, then say who checked them and when.

The "Worried about your own contract?" section (`#get-help`) has the class `ph-no-capture`, so PostHog doesn't log clicks in it and blanks it out in session recordings. Keep that class if you edit the section.

## Checking the data

```sh
node scripts/check-data.mjs
```

It checks both rating files: known labs and clause ids, valid ratings, parts for every clause, `met` for every "Partly" rating, a source URL and date for every rating other than "Not public", and no duplicates. A GitHub check runs it on every pull request and push.

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
  "met": [2, 4],
  "evidence": "One or two plain sentences on what the source shows.",
  "source": "Name of the source",
  "url": "https://...",
  "date": "2024-05-23"
}
```

- `rating` is one of `Meets`, `Partly`, `Falls short` or `Not public`. The page shows them as A, B to D, F and "?".
- `met` is only for `Partly`. It lists which of the clause's `parts` (numbered from 1, in `criteria.json`) the evidence shows. The page works out B, C or D from it and shows the parts with ticks and crosses.
- `date` is `YYYY-MM-DD`, or `YYYY-MM` if the source only gives a month.
- Update `updated` at the top of the file whenever you change a rating, and add an entry to `updates` (see [Updates and feeds](#updates-and-feeds)).
- Update `checked` whenever you review the evidence for every lab, even if no rating changes. The site shows both dates, and warns readers when `checked` is more than 45 days old.
- Add a lab's name to `optedIn` once it has opted in.
- Add `"fromLab": true` when the main source is the lab's own policy or a statement by its staff. The evidence timeline uses it to show which evidence the labs published themselves.

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

When scores or headline wording change, refresh `public/og.png` so social previews stay accurate. The Q&A section on the page quotes the Anthropic and OpenAI scores and the not-public count, so update it too.

## Updates and feeds

People can follow changes in a feed reader: `https://labcanary.com/feed.xml` covers every lab, and `https://labcanary.com/feeds/<lab>.xml` (for example `feeds/openai.xml`) covers one. The "Updates" section on the page lists the same changes.

When a rating or its evidence changes, add an entry to the top of `updates` in `public/ratings.json`:

```json
{
  "date": "2026-10-24",
  "title": "Google DeepMind: a former researcher posts the non-disparagement clause he signed",
  "text": "A few plain sentences on what changed and why, with the old and new rating.",
  "scores": { "Anthropic": 43, "OpenAI": 43, "Google DeepMind": 7, "xAI / SpaceXSI": 0, "Meta": 0 },
  "labs": ["Google DeepMind"],
  "link": "#google-deepmind-c1"
}
```

- `scores` is every lab's score (percent, rounded) after the change, even when none moved. The Updates section draws each lab's score over time from these, and shows any score that moved, like "Anthropic 43% → 50%".
- `labs` lists the labs it's about. Leave it empty (`[]`) for news about the whole site; that goes in every lab's feed.
- `link` is where "See it on the scorecard" goes: `#openai` opens a lab summary, `#openai-c4` opens one rating.
- Don't change a title once it's live. Feed readers use it to tell updates apart, so an edited title shows up twice.

Then rebuild the feeds and commit them along with `ratings.json`:

```sh
node scripts/feeds.mjs
```

A GitHub check runs `node scripts/feeds.mjs --check` on every pull request and push, and fails if the feeds are out of date.

## Sharing

Each lab summary and rating, and the scorecard, has one "Share" button. On phones it opens the phone's own share sheet; on computers it opens a small pop-up with Copy link, X, Bluesky, LinkedIn and email. They're plain links, so no social media scripts load on the page. The post text is written by `shareInfo()` in `public/index.html` from the current scores. Keep it under 240 characters so it fits on X and Bluesky with the link.

## Short links

`public/_redirects` holds short links that land on the home page with tracking tags PostHog can read: `/x1` to `/x10` for replies on X, and `/m1` to `/m6` for launch outreach by email or DM (press, organisations, people, policy, other, and Pacing the Frontier signers). Outreach links are per group, never per person, so a visit can't be tied to whoever was sent the link.

Changes pushed to `main` go live automatically.

## Licence

Code: MIT (see [LICENSE](LICENSE)). Data and text: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Made by Jonathan Hind ([@import_hind](https://x.com/import_hind)).
