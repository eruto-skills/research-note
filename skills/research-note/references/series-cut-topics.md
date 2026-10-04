# Finding Cut Topics in YouTube Series / Podcasts

When researching a YouTube series or podcast to find topics that were **mentioned but not covered in depth**, use this pattern. Useful for: identifying gaps in a series, finding follow-up episode ideas, understanding what the hosts chose to skip.

## Step 1: Get the episode list

```bash
# List all videos in a playlist (replace PLAYLIST_ID)
yt-dlp --flat-playlist --print "%(title)s\t%(id)s\t%(description)s" "https://www.youtube.com/playlist?list=PLAYLIST_ID" > /tmp/episode-list.txt

# Or for a channel
yt-dlp --flat-playlist --print "%(title)s\t%(id)s" "https://www.youtube.com/@CHANNEL/videos" > /tmp/episode-list.txt
```

Skim titles for episodes that sound like sequels ("Part 2", "続き", "後編") or promised follow-ups — these reveal where the hosts planned to return to a topic.

## Step 2: Search descriptions for cut signals

Look for language that signals a topic was acknowledged but not pursued. Run WebSearch with the channel name and these patterns:

| 日本語パターン | 意味 |
|---|---|
| 「次回以降」「次回詳しく」 | Explicitly deferred to a future episode |
| 「今回は省略」「今回は触れません」 | Consciously skipped this time |
| 「気になる方は」「詳しくは」 | Flagged as deeper territory |
| 「〜については別途」「また改めて」 | Planned but not yet covered |
| 「時間の都合で」「尺の関係で」 | Cut for length |

For English series: "we'll cover that another time", "that's a whole other episode", "we don't have time today", "stay tuned for".

```bash
# Search within transcripts of multiple episodes
# First download transcripts for a playlist
yt-dlp --write-auto-subs --sub-langs 'ja' --sub-format srt --skip-download \
  -o '/tmp/subs/%(id)s' "https://www.youtube.com/playlist?list=PLAYLIST_ID"

# Then grep for cut signals across all files
grep -l "次回以降\|今回は省略\|別途\|尺の関係\|また改めて" /tmp/subs/*.srt
```

## Step 3: Check comments for recurring requests

Comments often surface what the audience noticed was missing.

```bash
# Fetch comments from an episode (top 100)
yt-dlp --write-comments --no-download -o '/tmp/yt-%(id)s' 'VIDEO_URL'
```

Look for:
- Questions the hosts didn't answer in the episode
- "〇〇についても話してほしい" type requests that appear across multiple episodes
- Comment replies from the host acknowledging a topic for "next time"

## Step 4: Check episode show notes / pinned comments

Episode descriptions and pinned comments often list:
- Topics deliberately excluded with a reason
- Links to related resources the hosts didn't have time to cover
- Corrections or additions made after recording

Fetch with `fetch-page.js` or yt-dlp `--write-description`.

## Step 5: Synthesize the cut-topic list

After gathering signals from steps 1–4, compile:

| Topic | Signal | Episode(s) | Priority |
|---|---|---|---|
| (topic name) | (how it was flagged) | (which episodes) | High / Medium |

**Priority High**: Explicitly promised for future coverage but never covered.
**Priority Medium**: Mentioned in passing, audience asked about it, or hosts noted it was out of scope.

## Source quality note

Cut-topic signals from host statements are P2–P3 tier (→ `source-quality-tiers.md`). The fact that "hosts said they'd cover X later" is a P-tier claim about intent, not a Knowledge or News tier claim about the topic itself. When you start researching the cut topic, use appropriate Knowledge/News sources for the substance.
