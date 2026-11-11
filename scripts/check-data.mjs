// Checks the scorecard data files before they go live. CI runs this on every pull request and push.
//   node scripts/check-data.mjs
// Covers public/criteria.json + public/ratings.json (staff contracts) and public/evaluators.json (evaluator contracts, beta).
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const read = (name) => JSON.parse(readFileSync(join(PUBLIC, name), "utf8"));
// The page turns these into grades: Meets is A, Partly is B, C or D (from "met"), Falls short is F, Not public is "?".
const RATINGS = ["Meets", "Partly", "Falls short", "Not public"];
const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const problems = [];

const staff = read("ratings.json");
const labs = staff.labs || [];
const sets = [{ name: "ratings.json", criteria: read("criteria.json"), data: staff, prefix: "C" }];
if (existsSync(join(PUBLIC, "evaluators.json"))) {
  const ev = read("evaluators.json");
  sets.push({ name: "evaluators.json", criteria: ev.criteria || [], data: ev, prefix: "E" });
}

const allIds = new Set();
for (const { name, criteria, data, prefix } of sets) {
  if (!Array.isArray(criteria) || !criteria.length) problems.push(name + ": needs at least one criterion");
  for (const k of ["updated", "checked"]) if (data[k] && !DATE.test(data[k])) problems.push(name + ": " + k + " must be YYYY-MM-DD");
  criteria.forEach((c, i) => {
    const where = name + " criteria[" + i + "]";
    if (!new RegExp("^" + prefix + "\\d+$").test(c.id || "")) problems.push(where + ": id must look like " + prefix + "1");
    if (allIds.has(c.id)) problems.push(where + ": id " + c.id + " is used twice (ids must be unique across both sets so links like #openai-" + String(c.id).toLowerCase() + " are unambiguous)");
    allIds.add(c.id);
    for (const k of ["name", "standard", "why"]) if (!c[k]) problems.push(where + ": needs " + k);
    // B, C and D grades count these. Fewer than three and "one part missing" (B) is the same as "only one part" (D).
    if (!Array.isArray(c.parts) || c.parts.length < 3 || c.parts.some(p => !p || typeof p !== "string")) problems.push(where + ": needs parts, a list of at least three short sentences");
  });
  const ids = new Set(criteria.map(c => c.id)), seen = new Set();
  const partCount = Object.fromEntries(criteria.map(c => [c.id, (c.parts || []).length]));
  (data.ratings || []).forEach((r, i) => {
    const where = name + " ratings[" + i + "] (" + r.lab + " " + r.clause + ")";
    if (!labs.includes(r.lab)) problems.push(where + ": unknown lab; labs are listed in ratings.json");
    if (!ids.has(r.clause)) problems.push(where + ": unknown clause for this file");
    if (!RATINGS.includes(r.rating)) problems.push(where + ": rating must be one of " + RATINGS.join(", "));
    if (!r.evidence) problems.push(where + ": needs evidence");
    const met = r.met || [], max = partCount[r.clause] || 0;
    if (r.rating === "Partly" && (!met.length || new Set(met).size !== met.length || met.some(n => !Number.isInteger(n) || n < 1 || n > max))) problems.push(where + ": a Partly rating needs met, the numbers of the parts the evidence shows, like [1, 3] (this clause has parts 1 to " + max + ")");
    if (r.rating !== "Partly" && r.met) problems.push(where + ": only a Partly rating has met");
    if (r.rating !== "Not public" && !r.url) problems.push(where + ": any rating other than Not public needs a source url");
    [r, ...(r.additionalSources || [])].forEach(s => {
      if (s.url && !/^https:\/\//.test(s.url)) problems.push(where + ": source urls must start with https://");
      if (s.url && !s.source) problems.push(where + ": every url needs a source name");
      if (s.url && !DATE.test(s.date || "")) problems.push(where + ": every source needs a date, YYYY-MM-DD or YYYY-MM");
    });
    const key = r.lab + "|" + r.clause;
    if (seen.has(key)) problems.push(where + ": duplicate rating for this lab and clause");
    seen.add(key);
  });
}

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("Data looks good: " + sets.map(s => s.name + " (" + s.criteria.length + " criteria, " + (s.data.ratings || []).length + " ratings)").join(", ") + ".");
