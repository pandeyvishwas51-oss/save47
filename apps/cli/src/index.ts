#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync, createWriteStream } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import kleur from 'kleur';

interface Config {
  apiBase: string;
  token?: string;
}

const CONFIG_DIR = join(homedir(), '.save47');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');
const DEFAULT_API_BASE = process.env.SAVE47_API_URL || 'https://api.save47.com';

function loadConfig(): Config {
  if (!existsSync(CONFIG_PATH)) return { apiBase: DEFAULT_API_BASE };
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as Config;
  } catch {
    return { apiBase: DEFAULT_API_BASE };
  }
}

function saveConfig(cfg: Config) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), { mode: 0o600 });
}

function authHeaders(cfg: Config): Record<string, string> {
  return cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {};
}

function info(msg: string) { console.log(kleur.gray(msg)); }
function ok(msg: string) { console.log(kleur.green(`✓ ${msg}`)); }
function warn(msg: string) { console.log(kleur.yellow(`! ${msg}`)); }
function err(msg: string) { console.error(kleur.red(`✗ ${msg}`)); }

function help() {
  console.log(`${kleur.bold('save47')} — download videos from your terminal\n`);
  console.log('Commands:');
  console.log('  save47 login <token>             save an API key');
  console.log('  save47 whoami                    show the configured key');
  console.log('  save47 logout                    forget the saved key');
  console.log('  save47 probe <url>               print metadata + available formats');
  console.log('  save47 download <url> [flags]    download a single video');
  console.log('  save47 bulk <file> [flags]       download URLs listed in a file');
  console.log('');
  console.log('Flags for download/bulk:');
  console.log('  --quality <best|1080p|720p|480p|mp3>   default: best');
  console.log('  --out <dir>                            default: current directory');
  console.log('  --concurrency <1-8>                    bulk only, default: 3');
  console.log('  --filename <name>                      override output filename (single only)');
  console.log('');
  console.log(`Endpoint: ${kleur.gray('https://api.save47.com')} (override with SAVE47_API_URL)`);
  console.log(`Get a free key at ${kleur.cyan('https://save47.com/api')}`);
}

interface FormatOption {
  formatId: string;
  label: string;
  ext: string;
  quality: string;
  filesize?: number;
  filesizeApprox?: number;
}
interface MediaInfo {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  platform: string;
  formats: FormatOption[];
  originalUrl: string;
}

async function probe(cfg: Config, url: string): Promise<MediaInfo> {
  const res = await fetch(`${cfg.apiBase}/v1/probe?url=${encodeURIComponent(url)}`, {
    headers: authHeaders(cfg),
  });
  const data = (await res.json()) as MediaInfo & { code?: string; message?: string };
  if (!res.ok) {
    throw new Error(data.message || data.code || `Probe failed (${res.status})`);
  }
  return data as MediaInfo;
}

function sanitize(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'download';
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return '?';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
}

async function downloadOne(
  cfg: Config,
  url: string,
  opts: { quality: string; out: string; filename?: string }
): Promise<{ url: string; ok: boolean; path?: string; error?: string }> {
  let info: MediaInfo;
  try {
    info = await probe(cfg, url);
  } catch (e) {
    return { url, ok: false, error: (e as Error).message };
  }

  const isAudio = opts.quality === 'mp3' || opts.quality === 'audio';
  const ext = isAudio ? 'mp3' : 'mp4';
  const filename = sanitize(opts.filename ?? info.title) + '.' + ext;
  const target = resolve(opts.out, filename);
  mkdirSync(opts.out, { recursive: true });

  const dlUrl = new URL(`${cfg.apiBase}/download`);
  dlUrl.searchParams.set('url', url);
  dlUrl.searchParams.set('formatId', isAudio ? 'mp3' : opts.quality);
  dlUrl.searchParams.set('quality', isAudio ? 'audio' : opts.quality);

  const res = await fetch(dlUrl.toString(), { headers: authHeaders(cfg) });
  if (!res.ok || !res.body) {
    let body: { message?: string } = {};
    try { body = (await res.json()) as { message?: string }; } catch { /* ignore */ }
    return { url, ok: false, error: body.message || `Download failed (${res.status})` };
  }

  const total = Number(res.headers.get('content-length') ?? 0);
  let received = 0;
  const start = Date.now();
  const out = createWriteStream(target);
  const reader = Readable.fromWeb(res.body as never);

  reader.on('data', (chunk: Buffer) => {
    received += chunk.length;
    if (process.stdout.isTTY) {
      const pct = total ? Math.floor((received / total) * 100) : 0;
      const speed = received / Math.max(0.001, (Date.now() - start) / 1000);
      const line = `${pct}%  ${formatBytes(received)}${total ? '/' + formatBytes(total) : ''}  ${formatBytes(speed)}/s`;
      process.stdout.write(`\r${kleur.cyan(filename)} ${kleur.gray(line)}     `);
    }
  });
  await pipeline(reader, out);
  if (process.stdout.isTTY) process.stdout.write('\n');
  return { url, ok: true, path: target };
}

interface ParsedArgs {
  command?: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = { positional: [], flags: {} };
  out.command = argv[0];
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out.flags[key] = next;
        i++;
      } else {
        out.flags[key] = true;
      }
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = loadConfig();
  const cmd = args.command;

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    help();
    return;
  }

  if (cmd === 'login') {
    const token = args.positional[0] || process.env.SAVE47_API_KEY;
    if (!token) {
      err('Usage: save47 login <token>');
      process.exit(1);
    }
    cfg.token = token;
    saveConfig(cfg);
    ok(`Saved API key to ${CONFIG_PATH}`);
    // Verify it works
    try {
      const res = await fetch(`${cfg.apiBase}/v1/me`, { headers: authHeaders(cfg) });
      if (res.ok) {
        const me = (await res.json()) as { plan: string; monthlyQuota: number };
        info(`Plan: ${me.plan} · Monthly quota: ${me.monthlyQuota}`);
      } else {
        warn('Saved key, but server rejected it. Double-check the value.');
      }
    } catch {
      warn('Saved key, but could not reach the server.');
    }
    return;
  }

  if (cmd === 'whoami') {
    if (!cfg.token) {
      warn('No API key configured. Run: save47 login <token>');
      return;
    }
    const res = await fetch(`${cfg.apiBase}/v1/me`, { headers: authHeaders(cfg) });
    if (!res.ok) {
      err('Server rejected the saved key.');
      process.exit(1);
    }
    console.log(await res.json());
    return;
  }

  if (cmd === 'logout') {
    saveConfig({ apiBase: cfg.apiBase });
    ok('API key removed.');
    return;
  }

  if (cmd === 'probe') {
    const url = args.positional[0];
    if (!url) { err('Usage: save47 probe <url>'); process.exit(1); }
    const data = await probe(cfg, url);
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (cmd === 'download') {
    const url = args.positional[0];
    if (!url) { err('Usage: save47 download <url> [--quality 1080p] [--out ./dir]'); process.exit(1); }
    const quality = String(args.flags.quality ?? 'best');
    const out = String(args.flags.out ?? '.');
    const filename = args.flags.filename ? String(args.flags.filename) : undefined;
    const result = await downloadOne(cfg, url, { quality, out, filename });
    if (result.ok) ok(`Saved to ${result.path}`);
    else { err(result.error ?? 'Unknown error'); process.exit(1); }
    return;
  }

  if (cmd === 'bulk') {
    const file = args.positional[0];
    if (!file) { err('Usage: save47 bulk <urls.txt> [--quality 1080p] [--out ./dir] [--concurrency 3]'); process.exit(1); }
    const text = readFileSync(file, 'utf8');
    const urls = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    if (!urls.length) { err('No URLs found in file.'); process.exit(1); }
    const quality = String(args.flags.quality ?? 'best');
    const out = String(args.flags.out ?? '.');
    const concurrency = Math.min(Math.max(1, Number(args.flags.concurrency ?? 3)), 8);

    info(`Downloading ${urls.length} URL${urls.length === 1 ? '' : 's'} (concurrency=${concurrency})…`);
    const results: Array<{ url: string; ok: boolean; path?: string; error?: string }> = [];
    let cursor = 0;
    await Promise.all(
      Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
        while (cursor < urls.length) {
          const i = cursor++;
          results[i] = await downloadOne(cfg, urls[i], { quality, out });
        }
      })
    );
    const success = results.filter((r) => r.ok).length;
    const failed = results.length - success;
    console.log('');
    ok(`Done. ${success} ok, ${failed} failed.`);
    if (failed) {
      console.log('');
      results.filter((r) => !r.ok).forEach((r) => {
        console.log(`  ${kleur.red('✗')} ${r.url} — ${r.error}`);
      });
      process.exit(1);
    }
    return;
  }

  err(`Unknown command: ${cmd}`);
  help();
  process.exit(1);
}

main().catch((e) => {
  err((e as Error).message);
  process.exit(1);
});
