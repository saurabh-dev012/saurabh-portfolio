import { mkdir, writeFile } from 'node:fs/promises';
import { LEETCODE_USERNAME } from '../src/data/content.js';

const endpoint = 'https://leetcode.com/graphql';
const outputPath = new URL('../dist/leetcode.json', import.meta.url);
const profileQuery = `
  query PublicProfile($username: String!, $year: Int!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
      userCalendar(year: $year) { submissionCalendar }
    }
  }
`;
const calendarQuery = `
  query ProfileCalendar($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      userCalendar(year: $year) { submissionCalendar }
    }
  }
`;
const recentQuery = `
  query RecentAccepted($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
    }
  }
`;

async function queryLeetCode(query, variables) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://leetcode.com',
      Referer: 'https://leetcode.com/',
      'User-Agent': 'Mozilla/5.0 (compatible; SaurabhPortfolio/1.0)',
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`LeetCode returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join('; '));
  return payload.data;
}

function parseCalendar(calendar) {
  if (typeof calendar !== 'string') return null;
  try {
    const result = JSON.parse(calendar);
    return result && typeof result === 'object' ? result : null;
  } catch {
    return null;
  }
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function createYearActivity(calendarByYear) {
  const countsByDate = new Map();
  for (const calendar of calendarByYear) {
    for (const [timestamp, rawCount] of Object.entries(calendar ?? {})) {
      const date = new Date(Number(timestamp) * 1000);
      const count = toNumber(rawCount);
      if (!Number.isFinite(date.getTime()) || count === null) continue;
      countsByDate.set(date.toISOString().slice(0, 10), count);
    }
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364);

  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: countsByDate.get(key) ?? 0 };
  });
}

function normalizeStats(profileData) {
  const user = profileData?.matchedUser;
  if (!user) return null;

  const solvedRows = user.submitStatsGlobal?.acSubmissionNum ?? [];
  const totalRows = profileData.allQuestionsCount ?? [];
  const byDifficulty = (rows, difficulty) => toNumber(rows.find(row => row.difficulty === difficulty)?.count);
  const solved = {};
  const totals = {};

  for (const difficulty of ['All', 'Easy', 'Medium', 'Hard']) {
    const count = byDifficulty(solvedRows, difficulty);
    if (count !== null) solved[difficulty === 'All' ? 'total' : difficulty.toLowerCase()] = count;
  }
  for (const difficulty of ['Easy', 'Medium', 'Hard']) {
    const count = byDifficulty(totalRows, difficulty);
    if (count !== null) totals[difficulty.toLowerCase()] = count;
  }

  const ranking = toNumber(user.profile?.ranking);
  return {
    solved,
    totals,
    ...(ranking && ranking !== 5000001 ? { ranking } : {}),
  };
}

async function writeSnapshot(snapshot) {
  await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

async function main() {
  const currentYear = new Date().getUTCFullYear();
  const years = [currentYear - 1, currentYear];
  const [profileResult, calendarBatch, recentResult] = await Promise.allSettled([
    queryLeetCode(profileQuery, { username: LEETCODE_USERNAME, year: currentYear }),
    Promise.allSettled(years.map(year => queryLeetCode(calendarQuery, { username: LEETCODE_USERNAME, year }))),
    queryLeetCode(recentQuery, { username: LEETCODE_USERNAME, limit: 30 }),
  ]);

  if (profileResult.status === 'rejected') console.warn('LeetCode profile data unavailable:', profileResult.reason);
  if (calendarBatch.status === 'rejected') console.warn('LeetCode calendar data unavailable:', calendarBatch.reason);
  if (recentResult.status === 'rejected') console.warn('LeetCode recent accepted submissions unavailable:', recentResult.reason);

  const profileData = profileResult.status === 'fulfilled' ? profileResult.value : null;
  const profile = normalizeStats(profileData);
  const calendarPayloads = calendarBatch.status === 'fulfilled'
    ? calendarBatch.value.flatMap((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`LeetCode calendar for ${years[index]} unavailable:`, result.reason);
        return [];
      }
      return [result.value];
    })
    : [];
  const parsedCalendars = calendarPayloads
    .map(payload => parseCalendar(payload?.matchedUser?.userCalendar?.submissionCalendar))
    .filter(Boolean);
  const recentSubmissions = recentResult.status === 'fulfilled'
    ? recentResult.value?.recentAcSubmissionList ?? []
    : [];
  const seenProblems = new Set();
  const recent = [];
  for (const submission of recentSubmissions) {
    if (!submission?.title || !submission.titleSlug || seenProblems.has(submission.titleSlug)) continue;
    seenProblems.add(submission.titleSlug);
    recent.push({ title: submission.title, slug: submission.titleSlug, timestamp: toNumber(submission.timestamp) });
    if (recent.length === 5) break;
  }

  const snapshot = {
    available: Boolean(profile || parsedCalendars.length || recent.length),
    updatedAt: new Date().toISOString(),
    ...(profile ? { profile } : {}),
    ...(parsedCalendars.length ? { activity: createYearActivity(parsedCalendars) } : {}),
    ...(recent.length ? { recent } : {}),
  };

  await writeSnapshot(snapshot);
  console.log(snapshot.available
    ? 'Generated the LeetCode activity snapshot.'
    : 'LeetCode data is unavailable; publishing the activity fallback.');
}

main().catch(async error => {
  console.error('Unable to generate LeetCode activity:', error);
  await writeSnapshot({ available: false, updatedAt: new Date().toISOString() });
});
