# Source Acquisition

Acquisition commands, fallback procedures, and error handling for each source type.

## YouTube Transcript via yt-dlp

Extract subtitles using `yt-dlp`.

```bash
# Fetch subtitles (prefer Japanese, include auto-generated)
yt-dlp --write-auto-subs --sub-langs 'ja' --sub-format srt --skip-download -o '/tmp/yt-%(id)s' '<URL>'

# Clean extraction (remove timecodes and noise)
grep -v '^\$' /tmp/yt-<ID>.ja.srt | grep -v '^[0-9]*$' | grep -v '^\[音楽\]$' | grep -v '^[0-9][0-9]:'

# List available subtitle languages
yt-dlp --list-subs '<URL>'

# Fetch comments (when needed)
yt-dlp --write-comments --no-download -o '/tmp/yt-%(id)s' '<URL>'
```

- If Japanese subtitles are unavailable, fall back to `ja-orig` or `en`
- If no subtitles exist at all, report to the user
- Downloaded subtitle files are saved as `/tmp/yt-<ID>.<lang>.srt`

## YouTube / Video Sources

YouTube transcripts are usable as information sources with the following rules:

- Use the video URL for footnotes (e.g., `[^1]: https://www.youtube.com/watch?v=xxxxx`)
- Transcript content is spoken word — not equivalent to written sources. Classify by speaker:
  - Official channel announcements → N1 equivalent
  - Expert / notable developer commentary → Tier 2 to N2 equivalent
  - General user videos → Tier 3 to N3 equivalent
- If transcript extraction fails (no subtitles), report to the user

## X (Twitter) Posts

Fetch X/Twitter posts using the authentication-free FixTweet API.

### URL Detection

Treat URLs matching `x.com/*/status/*` or `twitter.com/*/status/*` as X posts.

### Fetch Commands

```bash
# Fetch tweet info via FixTweet API (primary)
# Response JSON .tweet contains: text, author, created_at, quote, replying_to_status, etc.
curl -s 'https://api.fxtwitter.com/<user>/status/<tweet_id>'

# Extract text only
curl -s 'https://api.fxtwitter.com/<user>/status/<tweet_id>' | jq -r '.tweet.text'

# oEmbed API (fallback: use when FixTweet returns HTTP error, timeout, or empty response)
curl -s 'https://publish.twitter.com/oembed?url=https://x.com/<user>/status/<tweet_id>'
```

Fall back to oEmbed when FixTweet returns a non-200 code or curl errors. If both fail, report to the user.

### Inaccessible Tweets

Deleted, private (locked), or suspended account tweets cannot be fetched via API. Report to the user and ask them to share the content, or search for cached copies via WebSearch.

### Thread Reconstruction

Viral threads are often compiled on aggregator sites (e.g., Togetter). **First search with WebSearch for `"keyword" togetter`** — if a compilation exists, extract the full text from there.

**Upward (parent tweet traversal)**: Follow `replying_to_status_id` recursively until null. Cap at 20 tweets; report excess to user.

**Downward (child tweet discovery)**: FixTweet API does not return child tweets. Use this priority:

1. If the tweet ends with continuation markers ("continued", "→", "thread", "1/", etc.), search for children via WebSearch
2. **If not found, ask the user (required)** — they likely have the continuation URLs. Ask: "I couldn't retrieve the rest of the thread. Could you share the continuation URLs?"
3. Only if the user also doesn't have them, note that the full thread was not retrieved

### Quote Tweets and Replies

|Target|Method|
|-|-|
|Quotes within the tweet|FixTweet API `quote` field|
|Viral quote tweets|WebSearch for the tweet URL|
|Notable replies|WebSearch for `site:x.com "in reply to @user"`, then fetch via FixTweet|

Exhaustive retrieval of all replies/quotes is not possible without authentication. Fetch only notable ones found via WebSearch.

### Tier Classification

|Author|Tier|
|-|-|
|Official accounts (companies, organizations, projects)|N1 equivalent|
|Experts, notable figures, developers|N2 equivalent|
|General users|N3 equivalent|

### Citation Format

```markdown
The official account announced the new feature[^1].
A notable developer shared additional context in a quote tweet[^2].

[^1]: https://x.com/user/status/123456789
[^2]: https://x.com/developer/status/987654321
```

- For threads, use the first tweet's URL as the footnote and note it's a thread in the body text
- For quote tweets, create separate footnotes for the original and the quote
- Prioritize high-impact quotes (expert reactions) found via WebSearch

## GitHub Repositories

When citing GitHub repos, fetch metadata in addition to README content.

### URL Detection

Treat URLs matching `github.com/{owner}/{repo}` as GitHub repositories.

### Fetch Commands

```bash
# Metadata (Stars, language, license, last updated)
curl -s -A 'Mozilla/5.0' 'https://api.github.com/repos/{owner}/{repo}' | jq '{stargazers_count, forks_count, language, license: .license.spdx_id, created_at, updated_at, topics}'

# README (Base64 decode)
curl -s -A 'Mozilla/5.0' 'https://api.github.com/repos/{owner}/{repo}/readme' | jq -r '.content' | base64 -d
```

- GitHub API has rate limits (unauthenticated: 60 requests/hour). For bulk fetching, run inside subagents
- If README fetch fails (404), fall back to `fetch-page.js` on the repository page
- Include metadata (Stars, language, last updated) in comparison tables

### Note Rules

- Use the repository URL for footnotes (e.g., `[^1]: https://github.com/owner/repo`)
- Include Stars, language, license, and last-updated date in comparison tables
- Do not mix different metrics (e.g., GitHub Stars and X likes should be in separate rows)

### Tier Classification

|Repository Type|Tier|
|-|-|
|Official organization repos|N1 equivalent|
|Notable developer/expert personal repos|N2 equivalent|
|General user repos|N3 equivalent|

## PDF Sources

When a user provides a PDF file, extract text directly with the Read tool.

- Read tool supports PDF reading (`pages` parameter for range, max 20 pages per call)
- For large PDFs (10+ pages), read in chunks (e.g., `pages: "1-20"`, `pages: "21-40"`)
- Tier classification is content-based:
  - Academic papers, official reports → Tier 1 equivalent
  - Corporate whitepapers, technical specs → Tier 1 to N1 equivalent
  - Conference materials, slides → Tier 2 to N2 equivalent
- Include PDF title and origin in footnotes (e.g., `[^1]: "Paper Title", Author, 2025`)
- If the original URL is known, include it as well

## URL Content Fetching Strategy

Use Task subagents with `fetch-page.js` (headless Chrome) for URL content retrieval.

Launch multiple subagents in parallel for multiple URLs. During WebSearch, actively pick up open-access results (e.g., PMC) when available.

**Sites with strict bot protection (known)**: WebMD, Cleveland Clinic, Healthline, Planned Parenthood, Wikipedia (*.wikipedia.org), note.com
**Sites that work well (known)**: PMC (pmc.ncbi.nlm.nih.gov), note.com (via API v3)

## Wikipedia Fallback Strategy

Wikipedia often returns 403 errors due to bot protection. The MediaWiki API is the most reliable approach.

```bash
# Full text (plain text)
curl -s -A 'Mozilla/5.0' 'https://{lang}.wikipedia.org/w/api.php?action=query&titles={title}&prop=extracts&explaintext=true&format=json'

# Summary only
curl -s -A 'Mozilla/5.0' 'https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}'
```

- `{title}` is the URL-encoded article title (the part after `/wiki/` in the URL)
- `{lang}` is the language code (`en`, `ja`, `lt`, etc.)
- Full text response: plain text in `query.pages.{pageid}.extract`
- Summary response: summary in the `extract` field
- If curl also fails, use headless Chrome (`fetch-page.js`) as a last resort

## note.com Fallback Strategy

note.com is JS-dependent, but API v3 can retrieve article body HTML.

```bash
# Fetch article body (returns HTML)
# note_key is the last part of the article URL (e.g., nf113f0d1d4c1)
curl -s -A 'Mozilla/5.0' 'https://note.com/api/v3/notes/{note_key}' | jq -r '.data.body'

# Extract as plain text
curl -s -A 'Mozilla/5.0' 'https://note.com/api/v3/notes/{note_key}' | jq -r '.data.body' | python3 -c 'import sys,re; print(re.sub(r"<[^>]+>","\n",sys.stdin.read()))'
```

- `{note_key}` is the part after `/n/` in the URL (e.g., `https://note.com/user/n/nf113f0d1d4c1` → `nf113f0d1d4c1`)
- Response body is in `.data.body` as HTML
- Paid content is not accessible (free portion only)

## PubMed E-utilities (Academic Paper Abstracts)

Publisher sites (tandfonline.com, wiley.com, etc.) often block fetching with Cloudflare. For PubMed-indexed papers, E-utilities API can retrieve abstracts directly (no auth, no bot protection).

```bash
# Step 1: Search PMID by DOI
curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={DOI}&retmode=json'
# Response .esearchresult.idlist[0] is the PMID

# Step 2: Fetch abstract by PMID
curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={PMID}&rettype=abstract&retmode=text'

# Keyword search
curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=your+search+terms&retmode=json&retmax=5'
```

- `{DOI}` does not need URL encoding (e.g., `10.1080/13685538.2024.2363275`)
- Abstracts often contain author names, sample sizes, and statistics (correlation coefficients, p-values) — sufficient for supporting claims
- Prefer PMC full text (pmc.ncbi.nlm.nih.gov) when available. Use E-utilities as fallback
- **Works reliably even on heavily protected sites** — bypasses Cloudflare on tandfonline.com, wiley.com, sciencedirect.com, etc.

## Fetch Failure Fallback

When `fetch-page.js` fails to retrieve page content (timeout, 403, etc.):

1. **Dedicated API (highest priority)**: Try source-specific APIs
   - Academic papers → PubMed E-utilities (see above)
   - Wikipedia → MediaWiki API (see above)
   - note.com → API v3 (see above)
2. **Direct curl (second fallback)**: Especially effective for API endpoints and plain-text sites
   ```bash
   curl -s -A 'Mozilla/5.0' '<URL>'
   ```
   - May not work for JS-rendered sites
3. If all methods fail, citing only search snippets is treated as "insufficiently verified"
4. However, if the same fact is confirmed by **multiple search snippets**, it is acceptable (extension of the N2 multi-media agreement rule)
5. If verification still fails, add a caveat in the text (e.g., "officially announced but details unconfirmed")
6. **For user-provided URLs** that fail: report to the user and ask for key points (never silently drop a source the user intended to reference)
