# research-note

A Claude Code skill that researches any topic and generates a footnoted Markdown note with source quality assessment and optional Mermaid mindmaps.

## Features

- **Multi-source research**: Web search, YouTube transcripts, PDFs, X/Twitter posts, GitHub repos
- **Source quality tiers**: Systematic reliability assessment (academic → encyclopedia → blog, official → media → aggregator)
- **Footnoted output**: Every factual claim backed by verified sources
- **Mermaid mindmaps**: Auto-generated for comparison and non-linear concept notes
- **Headless Chrome fetching**: Bundled `fetch-page.js` for bot-protected pages
- **Native-language priority**: Prefers local-language sources when researching specific countries

## Installation

Copy this directory into your project's `.claude/skills/` folder:

```bash
# Clone the repo
git clone https://github.com/eruto-skills/research-note.git

# Copy into your project
cp -r research-note /path/to/your-project/.claude/skills/research-note
```

Then install the Node.js dependencies for `fetch-page.js`:

```bash
cd /path/to/your-project/.claude/skills/research-note/scripts
npm install puppeteer-core turndown
```

### System Dependencies

| Tool | Purpose | Install |
|-|-|-|
| `yt-dlp` | YouTube transcript extraction | [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) |
| `curl` | API calls | Usually pre-installed |
| `jq` | JSON processing | [jqlang.github.io/jq](https://jqlang.github.io/jq/) |
| Google Chrome / Chromium | Headless page fetching | [google.com/chrome](https://www.google.com/chrome/) |

## Usage

### Slash command

```
/research-note quantum computing basics
/research-note https://www.youtube.com/watch?v=xxxxx
/research-note https://x.com/user/status/123456789
```

### Natural language

- "Research this topic for me"
- "Summarize this YouTube video"
- "Read this PDF and make a note"
- "What is WebAssembly?"

## Project Integration

The skill works out of the box, but you can customize it for your project by editing the "Project Integration" section in `SKILL.md`:

- **File Placement**: Define directory mapping rules so notes are automatically placed in the right location
- **Lint**: Specify a lint command (e.g., `npx textlint`) to run after note generation
- **Cross-Skill Integration**: Connect with other skills in your project (quality checking, slide creation, article drafting)

## File Structure

```
research-note/
├── README.md
├── LICENSE
├── SKILL.md                          # Main skill definition
├── scripts/
│   └── fetch-page.js                 # Headless Chrome page fetcher
├── references/
│   ├── source-acquisition.md         # Per-source fetch commands & fallbacks
│   ├── source-quality-tiers.md       # Source reliability criteria
│   ├── writing-conventions.md        # Output formatting rules
│   └── qa-checklist.md               # Quality verification checklist
└── assets/
    └── note-template.md              # Note skeleton template
```

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

If you find this skill useful, consider supporting its development:

- [GitHub Sponsors](https://github.com/sponsors/erutobusiness)
- [Ko-fi](https://ko-fi.com/eruto)
