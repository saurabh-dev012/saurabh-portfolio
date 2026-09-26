import { mkdir, writeFile } from 'node:fs/promises';

const outputPath = new URL('../dist/wakatime.json', import.meta.url);
const timezone = 'Asia/Kolkata';

function dateInTimezone(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftDate(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const hoursPart = Math.floor(minutes / 60);
  const minutesPart = minutes % 60;
  if (!hoursPart && !minutesPart) return '0 mins';
  return [hoursPart ? `${hoursPart} hr${hoursPart === 1 ? '' : 's'}` : '', minutesPart ? `${minutesPart} min${minutesPart === 1 ? '' : 's'}` : ''].filter(Boolean).join(' ');
}

function summarizeEntries(days, key) {
  const totals = new Map();
  for (const day of days) {
    for (const entry of day[key] ?? []) {
      if (!entry.name) continue;
      totals.set(entry.name, (totals.get(entry.name) ?? 0) + Number(entry.total_seconds ?? 0));
    }
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, seconds]) => ({ name, time: formatTime(seconds) }));
}

async function writeSnapshot(snapshot) {
  await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

async function main() {
  const apiKey = process.env.WAKATIME_API_KEY?.trim();
  if (!apiKey) {
    await writeSnapshot({ available: false });
    console.log('WakaTime API key is not configured; publishing the activity fallback.');
    return;
  }

  const today = dateInTimezone();
  const yesterday = shiftDate(today, -1);
  const weekday = new Date(`${today}T00:00:00.000Z`).getUTCDay();
  const mondayOffset = (weekday + 6) % 7;
  const weekStart = shiftDate(today, -mondayOffset);
  const start = weekStart < yesterday ? weekStart : yesterday;
  const params = new URLSearchParams({ start, end: today, timezone });
  const response = await fetch(`https://wakatime.com/api/v1/users/current/summaries?${params}`, {
    headers: { Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}` },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) throw new Error(`WakaTime returned HTTP ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.data)) throw new Error('WakaTime returned an invalid summary.');

  const summaries = payload.data;
  const dayByDate = new Map(summaries.map(day => [day.range?.date, day]));
  const currentWeek = summaries.filter(day => day.range?.date >= weekStart && day.range?.date <= today);
  const weekSeconds = currentWeek.reduce((sum, day) => sum + Number(day.grand_total?.total_seconds ?? 0), 0);

  await writeSnapshot({
    available: true,
    updatedAt: new Date().toISOString(),
    timezone,
    today: formatTime(Number(dayByDate.get(today)?.grand_total?.total_seconds ?? 0)),
    yesterday: formatTime(Number(dayByDate.get(yesterday)?.grand_total?.total_seconds ?? 0)),
    week: formatTime(weekSeconds),
    editors: summarizeEntries(currentWeek, 'editors'),
    languages: summarizeEntries(currentWeek, 'languages'),
  });
  console.log('Generated the WakaTime activity snapshot.');
}

main().catch(async () => {
  await writeSnapshot({ available: false });
  console.log('WakaTime activity is unavailable; publishing the activity fallback.');
});
