import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceProfileLink from '../components/ServiceProfileLink';
import { LEETCODE_PROFILE_URL, LEETCODE_USERNAME } from '../data/content';
import { useLeetCode } from '../hooks/useLeetCode';

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const dayFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function formatNumber(value) {
  return Number(value).toLocaleString('en-IN');
}

function getMetrics(profile) {
  const options = [
    ['Solved', profile?.solved?.total],
    ['Easy', profile?.solved?.easy],
    ['Rank', profile?.ranking ? `#${formatNumber(profile.ranking)}` : null],
    ['Medium', profile?.solved?.medium],
    ['Hard', profile?.solved?.hard],
  ];
  return options.filter(([, value]) => value !== undefined && value !== null).slice(0, 3);
}

function makeWeeks(activity) {
  if (!activity?.length) return [];
  const leadingDays = new Date(`${activity[0].date}T00:00:00Z`).getUTCDay();
  const paddedDays = [...Array(leadingDays).fill(null), ...activity];
  return Array.from({ length: Math.ceil(paddedDays.length / 7) }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => paddedDays[weekIndex * 7 + dayIndex] ?? null),
  );
}

function levelFor(count) {
  if (!count) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

function ActivityHeatmap({ activity }) {
  const weeks = useMemo(() => makeWeeks(activity), [activity]);
  const months = useMemo(() => {
    const labels = [];
    weeks.forEach((week, weekIndex) => {
      const firstDay = week.find(Boolean);
      if (!firstDay) return;
      const date = new Date(`${firstDay.date}T00:00:00Z`);
      if (date.getUTCDate() <= 7 || weekIndex === 0) {
        const label = monthFormatter.format(date);
        if (labels.at(-1)?.label !== label) labels.push({ label, weekIndex });
      }
    });
    return labels;
  }, [weeks]);

  if (!weeks.length) return null;

  return <div className="leetcode-activity-panel">
    <div className="leetcode-subheading"><span>ACTIVITY</span><span>LAST 12 MONTHS</span></div>
    <div className="leetcode-calendar-viewport" tabIndex="0" aria-label="Scrollable LeetCode submission calendar">
      <div className="leetcode-calendar-inner" style={{ '--week-count': weeks.length }}>
        <div className="leetcode-months" aria-hidden="true">{months.map(({ label, weekIndex }) => <span key={`${label}-${weekIndex}`} style={{ gridColumn: weekIndex + 1 }}>{label.split(' ')[0]}</span>)}</div>
        <div className="leetcode-calendar" role="grid" aria-label="LeetCode submissions over the last 12 months">
          {weeks.map((week, weekIndex) => <div className="leetcode-week" role="row" key={weekIndex} style={{ '--week-index': weekIndex }}>
            {week.map((day, dayIndex) => <span
              className={`leetcode-cell level-${day ? levelFor(day.count) : 'empty'}`}
              role="gridcell"
              key={day?.date ?? `pad-${weekIndex}-${dayIndex}`}
              title={day ? `${dayFormatter.format(new Date(`${day.date}T00:00:00Z`))} · ${day.count} ${day.count === 1 ? 'submission' : 'submissions'}` : undefined}
              aria-label={day ? `${dayFormatter.format(new Date(`${day.date}T00:00:00Z`))}, ${day.count} ${day.count === 1 ? 'submission' : 'submissions'}` : undefined}
            />)}
          </div>)}
        </div>
      </div>
    </div>
    <div className="leetcode-legend" aria-hidden="true"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <i className={`level-${level}`} key={level} />)}<span>More</span></div>
  </div>;
}

function DifficultyBreakdown({ profile }) {
  const rows = ['easy', 'medium', 'hard'].map(key => ({
    key,
    label: key.toUpperCase(),
    solved: profile?.solved?.[key],
    total: profile?.totals?.[key],
  })).filter(row => row.solved !== undefined && row.solved !== null);

  if (!rows.length) return null;

  return <div className="leetcode-difficulty">
    <div className="leetcode-subheading">DIFFICULTY</div>
    {rows.map(({ key, label, solved, total }) => <div className="leetcode-difficulty-row" key={key}>
      <div className="leetcode-difficulty-meta"><span>{label}</span><span>{formatNumber(solved)}{total !== undefined ? ` / ${formatNumber(total)}` : ''}</span></div>
      {total > 0 && <div className="leetcode-progress-track" role="meter" aria-label={`${label} problems solved`} aria-valuemin="0" aria-valuemax={total} aria-valuenow={Math.min(solved, total)}><span style={{ width: `${Math.min(100, solved / total * 100)}%` }} /></div>}
    </div>)}
  </div>;
}

function RecentSolved({ problems }) {
  if (!problems?.length) return null;

  return <div className="leetcode-recent">
    <div className="leetcode-subheading">RECENT SOLVED</div>
    <ul>{problems.map(problem => <li key={`${problem.slug}-${problem.timestamp}`}>
      <a href={`https://leetcode.com/problems/${encodeURIComponent(problem.slug)}/`} target="_blank" rel="noopener noreferrer">
        <span>{problem.title}</span><span className="leetcode-problem-arrow" aria-hidden="true">&#8599;</span>
      </a>
      {problem.timestamp && <time dateTime={new Date(problem.timestamp * 1000).toISOString()}>{dayFormatter.format(new Date(problem.timestamp * 1000))}</time>}
    </li>)}</ul>
  </div>;
}

function LoadingState() {
  return <div className="leetcode-loading" role="status" aria-label="Loading LeetCode activity">
    <span /><span /><span />
  </div>;
}

export default function LeetCodeSection() {
  const { status, data } = useLeetCode();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const metrics = getMetrics(data?.profile);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className={`section page-shell leetcode-section ${isVisible ? 'is-visible' : ''}`} id="leetcode" aria-labelledby="leetcode-title">
    <div className="leetcode-heading-row">
      <SectionHeading eyebrow="LeetCode" title="Solving problems, one at a time." id="leetcode-title" />
      <ServiceProfileLink service="leetcode" href={LEETCODE_PROFILE_URL} username={LEETCODE_USERNAME} />
    </div>
    {status === 'loading' && <LoadingState />}
    {status === 'unavailable' && <p className="leetcode-unavailable">LeetCode activity unavailable right now.</p>}
    {status === 'success' && <>
      <div className="leetcode-overview">
        <div className="leetcode-stats-column">
          {metrics.length > 0 && <div className="leetcode-metrics">{metrics.map(([label, value], index) => <div className="leetcode-metric" style={{ '--item-index': index }} key={label}>
            <strong>{typeof value === 'number' ? formatNumber(value) : value}</strong><span>{label}</span>
          </div>)}</div>}
          <DifficultyBreakdown profile={data.profile} />
        </div>
        <ActivityHeatmap activity={data.activity} />
      </div>
      <RecentSolved problems={data.recent} />
      {!metrics.length && !data.activity?.length && !data.recent?.length && <p className="leetcode-unavailable">No public LeetCode activity is available yet.</p>}
    </>}
  </section>;
}
