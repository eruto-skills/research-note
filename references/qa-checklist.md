# QA Checklist

Quality checklist for research-note output.

## QA Mindset

Even when everything looks fine, problems are always lurking.
Footnote integrity and source quality are especially easy to miss on visual inspection.

## Failure Modes (Common Problems)

- **URL cited without reading**: A URL in the footnotes, but the content was never verified
- **Low-tier-only definitions**: Defining technical terms using only Tier 3 blog posts
- **Footnote number mismatch**: `[^N]` in the body doesn't match `[^N]:` definitions, or gaps exist
- **Mindmap depth exceeded**: Expanding to 4+ levels, making it hard to read
- **Duplicate URL footnotes**: Same URL assigned multiple footnote numbers
- **User-provided URL silently dropped**: Fetch failed but user was not notified, and the source was ignored
- **WikiLink by filename only**: Linking based on filename without confirming content relevance
- **Insight-free fact listing**: Facts listed without any "so what" analysis
- **GitHub Stars not fetched**: Citing a repo without retrieving API metadata
- **Paper snippet citation**: Using an academic paper as a key source but only citing WebSearch snippets without fetching the actual text

## Checklist

### A. Format

- [ ] One sentence per line
- [ ] No sentence-ending period at end of list items
- [ ] Consistent writing style throughout the note
- [ ] Lint passed (if a lint command is configured in "Project Integration")

### B. Content Accuracy

- [ ] All web-sourced claims have footnote citations with URLs
- [ ] Each cited URL has been actually read (via Task subagent + fetch-page.js) and confirms the claim
- [ ] No URL-only citations where content was not verified
- [ ] Fetch failure cases handled per Fallback rules (snippet cross-check or caveat noted)
- [ ] No duplicate footnotes pointing to the same URL
- [ ] User-provided URLs that failed to fetch: user notified and asked for key points
- [ ] Definitions sourced from Tier 1-2 sources (not solely from blogs)

### C. X (Twitter) Posts

- [ ] If X URLs are included, post content fetched via FixTweet API
- [ ] For threads, parent tweets traced via `replying_to_status_id` until complete
- [ ] If child tweets couldn't be retrieved, user was asked for continuation URLs (not just noted as unavailable)
- [ ] If quote tweets exist, content fetched from the `quote` field
- [ ] Tier classification appropriate based on the author's standing

### D. Mindmap

- [ ] Mermaid mindmap: skipped if generation conditions (comparison, non-linear concepts, user request) are not met
- [ ] If generated: root node matches title, depth is within 3 levels

### D2. GitHub Repositories

- [ ] When citing GitHub repos, metadata (Stars, language, last updated) fetched via API
- [ ] Comparison tables use actual values (Stars not mixed with X likes, etc.)

### D3. Academic Papers

- [ ] Papers used as key sources have their full text fetched and reviewed via subagent (not just WebSearch snippets)
- [ ] Key data from papers (model count, top scores, dataset size, etc.) cited with specific numbers
- [ ] Related papers (citing/cited-by) mentioned if relevant

### E. Analytical Insight

- [ ] Existing notes were read in Step 2a to build context before writing
- [ ] Natural insights from connecting existing knowledge are included (do not force formulaic observations — omit if none emerge)
- [ ] If insights are included, they are clearly distinguishable from factual claims

### F. Links & Placement

- [ ] Links inserted only for directly relevant existing content (omit section if none found)
- [ ] Before inserting links, confirmed no filename ambiguity via Glob
- [ ] File placed in appropriate directory (consulted user if no existing directory fits)

## Verification Loop

1. Generate note
2. Run through all checklist items
3. List problems found
4. Apply fixes
5. Re-verify fixed areas (one fix can create another problem — especially footnote renumbering)
