# save47-cli

Download videos from YouTube, Instagram, TikTok, Reddit, Twitter, SoundCloud, and 1,000+ other sites — straight from your terminal.

```bash
npm i -g save47-cli
save47 login YOUR_API_KEY
save47 download "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

Get a free API key at [save47.com/api](https://save47.com/api).

## Commands

```
save47 login <token>             save an API key
save47 whoami                    show the configured key
save47 logout                    forget the saved key
save47 probe <url>               print metadata + available formats
save47 download <url> [flags]    download a single video
save47 bulk <file> [flags]       download URLs listed in a file
```

### Flags

- `--quality <best|1080p|720p|480p|mp3>` (default: best)
- `--out <dir>` (default: cwd)
- `--concurrency <1-8>` for bulk (default: 3)
- `--filename <name>` override output filename for single downloads

### Examples

```bash
# Highest quality MP4
save47 download "https://www.tiktok.com/@user/video/123"

# 720p into ./downloads/
save47 download "<url>" --quality 720p --out ./downloads

# MP3 only
save47 download "<url>" --quality mp3

# Bulk from a text file (one URL per line, # comments allowed)
save47 bulk urls.txt --concurrency 4 --out ./batch
```

## Configuration

The CLI saves your API key in `~/.save47/config.json` with `0600` permissions.
You can also pass `SAVE47_API_KEY` as an env var, or override the API base
URL with `SAVE47_API_URL` for self-hosted setups.

## License

MIT
