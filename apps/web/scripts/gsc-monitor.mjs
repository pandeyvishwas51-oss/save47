#!/usr/bin/env node
// Google Search Console monitoring script.
//
// Pulls indexing stats, top queries, and CWV from the GSC API and posts
// alerts to Slack/email if anomalies are detected. Run on a daily cron.
//
// Setup:
// 1. In Google Cloud Console, create a service account with the
//    Search Console API enabled.
// 2. Download the service-account JSON key.
// 3. In Search Console → Settings → Users → Add user, add the service
//    account email as "Full" permission.
// 4. Set env vars:
//      GSC_KEY_FILE=/path/to/service-account.json
//      GSC_SITE_URL=sc-domain:save47.com
//      SLACK_WEBHOOK=https://hooks.slack.com/services/... (optional)
//
// Run:
//      node scripts/gsc-monitor.mjs
//
// This is a STARTING TEMPLATE — flesh out the alert thresholds based
// on your historical baseline once you have 30 days of data.

import { google } from 'googleapis';
import fs from 'node:fs';

const KEY_FILE = process.env.GSC_KEY_FILE;
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:save47.com';
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;

if (!KEY_FILE || !fs.existsSync(KEY_FILE)) {
  console.error('GSC_KEY_FILE not set or file does not exist.');
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});
const webmasters = google.webmasters({ version: 'v3', auth });

const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 3600 * 1000);
const fmt = (d) => d.toISOString().slice(0, 10);

async function topQueries() {
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: fmt(sevenDaysAgo),
      endDate: fmt(today),
      dimensions: ['query'],
      rowLimit: 25,
      type: 'web',
    },
  });
  return res.data.rows ?? [];
}

async function indexingStatus() {
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: fmt(sevenDaysAgo),
      endDate: fmt(today),
      dimensions: ['page'],
      rowLimit: 100,
      type: 'web',
    },
  });
  return res.data.rows ?? [];
}

async function alert(message) {
  console.log('\n🔔 ALERT:', message);
  if (SLACK_WEBHOOK) {
    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  }
}

(async () => {
  console.log(`[gsc-monitor] window: ${fmt(sevenDaysAgo)} → ${fmt(today)}`);
  console.log(`[gsc-monitor] site:   ${SITE_URL}\n`);

  const queries = await topQueries();
  console.log('Top 25 queries (last 7 days):');
  console.table(
    queries.map((r) => ({
      query: r.keys?.[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: ((r.ctr ?? 0) * 100).toFixed(2) + '%',
      position: r.position?.toFixed(1),
    }))
  );

  const pages = await indexingStatus();
  console.log(`\n${pages.length} pages getting impressions in window.`);

  // Threshold-based alerting (tune to your baseline once you have data):
  const totalClicks = queries.reduce((sum, r) => sum + (r.clicks ?? 0), 0);
  if (totalClicks === 0) {
    await alert(`Save47: 0 GSC clicks in last 7 days. Check indexation.`);
  }
  if (pages.length < 5) {
    await alert(`Save47: only ${pages.length} pages getting impressions. Indexing may be stalled.`);
  }
})();
