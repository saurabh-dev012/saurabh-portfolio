import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { LEETCODE_PROFILE_URL } from '../data/content';
import { useLeetCode } from '../hooks/useLeetCode';

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
const dayFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const metricLabels = [
  ['total', 'Solved'],
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard'],
];

function formatNumber(value) {
  return Number(value).toLocaleString('en-IN');
}

function getMetrics(profile) {
  return metricLabels
    .map(([key, label]) => ({ key, label, value: profile?.solved?.[key] }))
    .filter(metric => metric.value !== undefined && metric.value !== null);
}

function makeWeeks(activity) {
  if (!activity?.length) return [];
  const leadingDays = new Date(`${activity[0].date}T00:00:00Z`).getUTCDay();
  const calendar = [...Array(leadingDays).fill(null), ...activity];
  return Array.from({ length: Math.ceil(calendar.length / 7) }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => calendar[weekIndex * 7 + dayIndex] ?? null),
  );
}

function levelFor(count) {
  if (!count) return 0;
  if (count < 2) return 1;
  if (count < 4) return 2;
  if (count < 7) return 3;
  return 4;
}

function ActivityHeatmap({ activity }) {
  const weeks = useMemo(() => makeWeeks(activity), [activity]);
  const [tooltip, setTooltip] = useState(null);
  const months = useMemo(() => {
    const labels = [];
    weeks.forEach((week, weekIndex) => {
      const firstDay = week.find(Boolean);
      if (!firstDay) return;
      const date = new Date(`${firstDay.date}T00:00:00Z`);
      if (date.getUTCDate() <= 7 || weekIndex === 0) {
        const month = monthFormatter.format(date);
        if (labels.at(-1)?.month !== month) labels.push({ month, weekIndex });
      }
    });
    return labels;
  }, [weeks]);

  const showTooltip = (event, day) => {
    const panel = event.currentTarget.closest('.leetcode-activity-panel');
    if (!panel) return;
    const cellRect = event.currentTarget.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    setTooltip({
      date: dayFormatter.format(new Date(`${day.date}T00:00:00Z`)),
      count: day.count,
      x: cellRect.left + cellRect.width / 2 - panelRect.left,
      y: cellRect.top - panelRect.top,
    });
  };

  const moveCalendarFocus = event => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in steps)) return;
    const cells = [...event.currentTarget.querySelectorAll('[data-calendar-date]')];
    const currentIndex = cells.indexOf(document.activeElement);
    const next = cells[currentIndex + steps[event.key]];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  if (!weeks.length) return <p className="leetcode-unavailable">Submission calendar unavailable.</p>;

  return <div className="leetcode-activity-panel">
    <div className="leetcode-subheading"><span>ACTIVITY</span><span>LAST 12 MONTHS</span></div>
    <div className="leetcode-calendar-viewport" tabIndex="0" aria-label="Scrollable LeetCode submission calendar">
      <div className="leetcode-calendar-inner" style={{ '--week-count': weeks.length }}>
        <div className="leetcode-months" aria-hidden="true">{months.map(({ month, weekIndex }, index) => {
          const nextMonthStart = months[index + 1]?.weekIndex ?? weeks.length;
          return <span key={`${month}-${weekIndex}`} style={{ gridColumn: `${weekIndex + 1} / ${nextMonthStart + 1}` }}>{month}</span>;
        })}</div>
        <div className="leetcode-calendar" role="grid" aria-label="LeetCode submissions for the last 12 months" onKeyDown={moveCalendarFocus}>
          {weeks.map((week, weekIndex) => <div className="leetcode-week" role="row" key={weekIndex}>
            {week.map((day, dayIndex) => {
              if (!day) return <span className="leetcode-cell level-empty" role="gridcell" aria-hidden="true" key={`empty-${weekIndex}-${dayIndex}`} />;
              const date = dayFormatter.format(new Date(`${day.date}T00:00:00Z`));
              const submissionLabel = `${day.count} ${day.count === 1 ? 'submission' : 'submissions'}`;
              return <span
                className={`leetcode-cell level-${levelFor(day.count)}`}
                role="gridcell"
                tabIndex={day.date === activity[0]?.date ? 0 : -1}
                key={day.date}
                aria-label={`${date}, ${submissionLabel}`}
                aria-describedby="leetcode-activity-tooltip"
                data-calendar-date={day.date}
                onPointerEnter={event => showTooltip(event, day)}
                onPointerLeave={() => setTooltip(null)}
                onFocus={event => showTooltip(event, day)}
                onBlur={() => setTooltip(null)}
              />;
            })}
          </div>)}
        </div>
      </div>
    </div>
    <div className={`leetcode-cell-tooltip ${tooltip ? 'is-visible' : ''}`} id="leetcode-activity-tooltip" role="tooltip" aria-hidden={!tooltip} style={tooltip ? { '--tooltip-x': `${tooltip.x}px`, '--tooltip-y': `${tooltip.y}px` } : undefined}>
      {tooltip && <><span>{tooltip.date}</span><span>{tooltip.count} {tooltip.count === 1 ? 'submission' : 'submissions'}</span></>}
    </div>
    <div className="leetcode-legend" aria-hidden="true"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <i className={`level-${level}`} key={level} />)}<span>More</span></div>
  </div>;
}

function DifficultyBreakdown({ profile }) {
  const rows = ['easy', 'medium', 'hard'].map(key => ({
    key,
    label: key[0].toUpperCase() + key.slice(1),
    solved: profile?.solved?.[key],
    total: profile?.totals?.[key],
  })).filter(row => row.solved !== undefined && row.solved !== null);

  if (!rows.length) return null;

  return <div className="leetcode-difficulty">
    <div className="leetcode-subheading"><span>DIFFICULTY</span><span>SOLVED / TOTAL</span></div>
    {rows.map(({ key, label, solved, total }) => {
      const ratio = total > 0 ? Math.min(100, solved / total * 100) : null;
      const details = `${label}: ${formatNumber(solved)} solved${total !== undefined ? `, ${formatNumber(total)} total` : ''}${ratio !== null ? `, ${ratio.toFixed(1)}%` : ''}`;
      return <div className={`leetcode-difficulty-row difficulty-${key}`} tabIndex="0" role="group" aria-label={details} key={key}>
        <div className="leetcode-difficulty-meta"><span>{label}</span><span>{formatNumber(solved)}{total !== undefined ? ` / ${formatNumber(total)}` : ''}</span></div>
        {ratio !== null && <div className="leetcode-progress-track" aria-hidden="true"><span style={{ width: `${ratio}%` }} /></div>}
        <span className="leetcode-difficulty-tooltip" role="tooltip">{details}</span>
      </div>;
    })}
  </div>;
}

function RecentSolved({ problems }) {
  if (!problems?.length) return null;

  return <div className="leetcode-recent">
    <div className="leetcode-subheading">RECENTLY SOLVED</div>
    <ul>{problems.slice(0, 5).map(problem => <li key={`${problem.slug}-${problem.timestamp}`}>
      <a href={`https://leetcode.com/problems/${encodeURIComponent(problem.slug)}/`} target="_blank" rel="noopener noreferrer">
        <span className="leetcode-recent-title">{problem.title}</span>
        <span className="leetcode-recent-meta">{problem.difficulty && <span>{problem.difficulty}</span>}{problem.timestamp && <time dateTime={new Date(problem.timestamp * 1000).toISOString()}>{dayFormatter.format(new Date(problem.timestamp * 1000))}</time>}</span>
        <span className="leetcode-problem-arrow" aria-hidden="true">&#8599;</span>
      </a>
    </li>)}</ul>
  </div>;
}

function LoadingState() {
  return <div className="leetcode-loading" role="status" aria-label="Loading LeetCode activity">
    <span>loading activity</span><i /><i /><i />
  </div>;
}

export default function LeetCodeSection() {
  const { status, data } = useLeetCode();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const metrics = getMetrics(data?.profile);
  const totalSolved = data?.profile?.solved?.total;

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
    <SectionHeading eyebrow="LEETCODE" title="Solving problems, one at a time." id="leetcode-title" />
    <p className="leetcode-description">A snapshot of my problem-solving activity.</p>

    {status === 'loading' && <LoadingState />}
    {status === 'unavailable' && <p className="leetcode-unavailable">LeetCode activity unavailable right now.</p>}
    {status === 'success' && <>
      <div className="leetcode-lab-grid">
        <div className="leetcode-stats-column">
          {metrics.length > 0 && <div className="leetcode-stats" aria-label="LeetCode problems solved">
            {metrics.map(({ key, label, value }, index) => <div className={`leetcode-stat ${key === 'total' ? 'leetcode-stat-solved' : ''}`} style={{ '--item-index': index }} key={key}>
              <strong>{formatNumber(value)}</strong>
              <span>{label}</span>
              {key === 'total' && totalSolved !== undefined && <small aria-hidden="true">and counting</small>}
            </div>)}
          </div>}
          {!metrics.length && <p className="leetcode-unavailable">Problem totals unavailable.</p>}
          <DifficultyBreakdown profile={data.profile} />
        </div>
        <ActivityHeatmap activity={data.activity} />
      </div>
      <RecentSolved problems={data.recent} />
      {!metrics.length && !data.activity?.length && !data.recent?.length && <p className="leetcode-unavailable">No public LeetCode activity is available yet.</p>}
    </>}

    <div className="leetcode-section-footer">
      <span className="leetcode-state"><span>STATE</span>learning by doing.</span>
      <a className="leetcode-profile-cta" href={LEETCODE_PROFILE_URL} target="_blank" rel="noopener noreferrer">VIEW LEETCODE <span aria-hidden="true">&#8599;</span></a>
    </div>
  </section>;
}
