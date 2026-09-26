import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/content';
import ServiceProfileLink from '../components/ServiceProfileLink';

export default function GitHub() {
  const [contributionData, setContributionData] = useState(null);
  const [chartFailed, setChartFailed] = useState(false);
  const hasContributionData = useRef(false);

  useEffect(() => {
    let controller;
    const refreshContributions = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${personalInfo.githubUsername}?y=last`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Contribution activity unavailable');
        const data = await response.json();
        if (!Array.isArray(data.contributions)) throw new Error('Invalid contribution activity');
        setContributionData({ days: data.contributions, updatedAt: new Date() });
        hasContributionData.current = true;
        setChartFailed(false);
      } catch (error) {
        if (error.name !== 'AbortError' && !hasContributionData.current) setChartFailed(true);
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshContributions();
    };
    refreshContributions();
    const interval = window.setInterval(refreshContributions, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  const days = contributionData?.days ?? [];
  const totalContributions = days.reduce((total, day) => total + Number(day.count ?? 0), 0);
  const leadingBlankDays = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  const calendarCells = [...Array(leadingBlankDays).fill(null), ...days];
  const weeks = Array.from({ length: Math.ceil(calendarCells.length / 7) }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => calendarCells[weekIndex * 7 + dayIndex] ?? null),
  );
  const monthLabels = [];
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find(Boolean);
    if (!firstDay) return;
    const date = new Date(`${firstDay.date}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (monthLabels.at(-1)?.month === month) return;
    if (!monthLabels.length && date.getUTCDate() > 7) return;
    monthLabels.push({ month, weekIndex, label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(date) });
  });

  return <section className="section page-shell github-section" id="github" aria-labelledby="github-title">
    <div className="github-card">
      <div className="github-header">
        <div className="service-heading-copy"><span className="service-kicker">06 <i>/</i> OPEN SOURCE</span><h2 id="github-title">github.</h2></div>
        <ServiceProfileLink service="github" href={personalInfo.github} username={personalInfo.githubUsername} />
      </div>
      <div className="contribution-wrap">
        <div className="calendar-scroll">
          <div className="github-month-labels" style={{ '--week-count': `${weeks.length}`, '--grid-min-width': `${weeks.length * 10 + (weeks.length - 1) * 3}px` }} aria-hidden="true">{monthLabels.map(({ month, weekIndex, label }, index) => {
            const endWeek = monthLabels[index + 1]?.weekIndex ?? weeks.length;
            return <span key={month} style={{ gridColumn: `${weekIndex + 1} / ${endWeek + 1}` }}>{label}</span>;
          })}</div>
          {chartFailed ? <p className="chart-fallback">Contribution activity is unavailable. <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">View activity on GitHub</a></p> : !contributionData ? <p className="chart-loading">Loading contribution activity…</p> : <a className="contribution-calendar-link" href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${totalContributions.toLocaleString()} of ${personalInfo.name}'s GitHub contributions in the last year`}>
            <div className="contribution-calendar" role="img" aria-label={`${totalContributions.toLocaleString()} contributions in the last year`}>
              <div className="contribution-grid" style={{ '--week-count': `${weeks.length}`, '--grid-min-width': `${weeks.length * 10 + (weeks.length - 1) * 3}px` }}>{weeks.map((week, weekIndex) => <div className="contribution-week" key={weekIndex}>{week.map((day, dayIndex) => <span key={day?.date ?? `blank-${weekIndex}-${dayIndex}`} className={`contribution-cell ${day ? `level-${Math.min(4, Math.max(0, Number(day.level) || 0))}` : 'is-empty'}`} title={day ? `${day.count} contributions on ${day.date}` : undefined} />)}</div>)}</div>
            </div>
          </a>}
        </div>
        {contributionData && <div className="contribution-foot"><span>{totalContributions.toLocaleString()} contributions in the last year</span><span className="chart-legend"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></span></div>}
      </div>
    </div>
  </section>;
}
