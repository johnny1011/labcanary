// Builds the Atom feeds people can follow from the "updates" list in public/ratings.json.
// public/feed.xml covers every lab; public/feeds/<lab>.xml covers one lab (plus updates about the whole site).
//   node scripts/feeds.mjs           write the feeds
//   node scripts/feeds.mjs --check   fail if they're out of date (CI runs this)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://labcanary.com/";
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const data = JSON.parse(readFileSync(join(PUBLIC, "ratings.json"), "utf8"));

// Same slugs as the page's shareable links: "Google DeepMind" -> "google-deepmind".
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stamp = (date) => date + "T00:00:00Z";

const problems = [];
const updates = (data.updates || []).slice().sort((a, b) => b.date.localeCompare(a.date));
updates.forEach((u, i) => {
  const where = "updates[" + i + "] (" + (u.title || "no title") + ")";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(u.date || "")) problems.push(where + ": date must be YYYY-MM-DD");
  if (!u.title || !u.text) problems.push(where + ": needs a title and text");
  (u.labs || []).forEach(l => { if (!data.labs.includes(l)) problems.push(where + ": unknown lab " + JSON.stringify(l)); });
  if (u.link && !u.link.startsWith("#")) problems.push(where + ": link must be a #fragment on the page, like #openai-c4");
});
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

function feed(path, title, entries) {
  const self = SITE + path;
  const updated = entries.length ? entries[0].date : data.updated;
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    "  <title>" + esc(title) + "</title>",
    "  <subtitle>Changes to Lab Canary's ratings of what's publicly known about AI lab staff contracts and speak-up policies.</subtitle>",
    '  <link rel="self" type="application/atom+xml" href="' + esc(self) + '"/>',
    '  <link rel="alternate" type="text/html" href="' + SITE + '"/>',
    "  <id>" + esc(self) + "</id>",
    "  <updated>" + stamp(updated) + "</updated>",
    "  <author><name>Jonathan Hind</name></author>",
    "  <rights>Text and data: CC BY 4.0</rights>",
    ...entries.flatMap(u => [
      "  <entry>",
      "    <title>" + esc(u.title) + "</title>",
      '    <link rel="alternate" type="text/html" href="' + esc(SITE + (u.link || "#updates")) + '"/>',
      // The id must never change once published, or readers show the update twice. Don't edit a published title.
      "    <id>tag:labcanary.com," + u.date + ":" + slug(u.title) + "</id>",
      "    <updated>" + stamp(u.date) + "</updated>",
      ...(u.labs || []).map(l => '    <category term="' + esc(l) + '"/>'),
      "    <summary>" + esc(u.text) + "</summary>",
      "  </entry>",
    ]),
    "</feed>",
    "",
  ].join("\n");
}

const files = { "feed.xml": feed("feed.xml", "Lab Canary: rating updates", updates) };
data.labs.forEach(l => {
  const path = "feeds/" + slug(l) + ".xml";
  files[path] = feed(path, "Lab Canary: " + l + " updates", updates.filter(u => !(u.labs || []).length || u.labs.includes(l)));
});

const check = process.argv.includes("--check");
const stale = [];
for (const [path, xml] of Object.entries(files)) {
  const file = join(PUBLIC, path);
  const current = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (current === xml) continue;
  if (check) { stale.push("public/" + path); continue; }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, xml);
  console.log("wrote public/" + path);
}
if (stale.length) {
  console.error("These feeds don't match the updates in public/ratings.json:\n  " + stale.join("\n  ") + "\nRun: node scripts/feeds.mjs");
  process.exit(1);
}
if (check) console.log("Feeds are up to date.");
