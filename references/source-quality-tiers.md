# Source Quality Tiers

Reliability assessment criteria for information sources. Prefer higher-tier sources and avoid claims backed only by low-tier sources.

**Core principle**: Never cite a URL without actually reading the content and confirming it supports the claim. Use Task subagents with `fetch-page.js` to verify content.

## Native-Language Source Priority

When researching a specific country or region, **prioritize sources written in that country's language**. Native-language sources contain local perspectives, details, and nuances that are often more accurate than secondary sources in English or other languages.

- Example: Lithuanian customs → Lithuanian Wikipedia (lt.wikipedia.org), Lithuanian cultural institution sites
- Example: Spanish festivals → Spanish Wikipedia (es.wikipedia.org), Spanish tourism bureau sites
- Use `site:{lang}.wikipedia.org` and native-language keywords in WebSearch
- Translate native-language content into the note's target language (include original terms in parentheses)
- Do not exclude English sources — use native-language and English sources together for multi-angle verification

## Knowledge Sources

|Tier|Examples|Notes|
|-|-|-|
|1. Academic / Textbook|Research papers, university materials, textbooks|Highest priority. Use for definitions of technical terms|
|2. Encyclopedia|Wikipedia, Britannica|Good for overview verification. Citing Wikipedia's own sources is preferred|
|3. Educational / Blog|Educational sites, personal blogs|Use only for concrete examples or illustrations. Never use as sole source for definitions|

- Claims backed only by Tier 3 sources: search for Tier 1-2 sources, or explicitly note low confidence in the text

## News Sources

For time-sensitive topics (product launches, events, industry moves), Tier 1-2 academic sources often don't exist. Use this scale instead:

|Tier|Examples|Notes|
|-|-|-|
|N1. Primary / Official|Official sites, press releases, conference talks, official blogs|Highest priority. First-party information|
|N2. Major Media|Specialized outlets (e.g., Ars Technica, The Verge, Phoronix)|Reliable. Multiple N2 sources agreeing strengthens verification|
|N3. Aggregator / Minor|Syndicated reprints, summary sites, SEO articles|No original reporting. Never use as sole source for claims without N1-N2 backing|

- Claims backed only by N3: search for N1-N2 sources, or note low confidence
- Same fact reported by multiple N2 outlets: considered sufficiently verified

## Podcast / YouTube Content Creator

For podcasts, YouTube series, and ongoing video content where hosts share knowledge or opinions:

|Tier|Examples|Notes|
|-|-|-|
|P1. Domain expert|Researcher or practitioner speaking about their own specialty|Valid as expert opinion and framing; not a substitute for academic citation of specific facts|
|P2. Knowledgeable host|Experienced generalist explaining a field to an audience|Useful for context and interpretation; verify factual claims via Knowledge or News tiers|
|P3. Exploratory discussion|Hosts learning alongside the audience, speculative conversation|Treat like Tier 3 Knowledge; corroboration required for any factual claim|

- "The host said X" is a citation for the host's belief or framing — it is not proof that X is true
- Factual claims (dates, numbers, named events, causal chains) need corroboration from Knowledge or News tiers regardless of P tier
- Check channel description, episode notes, or the host's background to determine tier
- For series research: mark claims that come solely from host statements as needing corroboration before treating them as established facts

## Common Rules

- Never cite a URL without reading and verifying the content
- When a topic spans multiple categories (Knowledge / News / Podcast), apply all relevant tier systems
