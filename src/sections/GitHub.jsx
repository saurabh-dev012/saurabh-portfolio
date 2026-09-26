import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

export default function GitHub() {
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);
  const [contributionData, setContributionData] = useState(null);
  const [chartFailed, setChartFailed] = useState(false);
  const hasContributionData = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${personalInfo.githubUsername}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Profile unavailable'); return response.json(); })
      .then(setProfile).catch(error => { if (error.name !== 'AbortError') setFailed(true); });
    return () => controller.abort();
  }, []);

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

  return <section className="section page-shell" id="github" aria-labelledby="github-title"><SectionHeading eyebrow="Open source & practice" title="GitHub" id="github-title" />
    <div className="github-card">
      <div className="github-profile">{profile?.avatar_url ? <img className="avatar" src={profile.avatar_url} alt={`${profile.login} profile avatar`} /> : <div className="avatar avatar-placeholder" aria-hidden="true">SP</div>}
        <div className="profile-copy"><span className="profile-label">GITHUB PROFILE</span><h3>{profile?.name || personalInfo.name}</h3><p>{profile?.bio || (failed ? 'Visit my profile to see what I’m working on.' : `@${personalInfo.githubUsername}`)}</p></div>
        <ExternalLink className="profile-link" href={personalInfo.github}>View profile <ArrowIcon /></ExternalLink>
      </div>
      <div className="contribution-wrap"><div className="contribution-heading"><span>Contribution activity</span><span className="contribution-period">Last year</span></div>
        {chartFailed ? <p className="chart-fallback">Contribution activity is unavailable. <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">View activity on GitHub</a></p> : !contributionData ? <p className="chart-loading">Loading contribution activity…</p> : <>
          <a className="contribution-calendar-link" href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${totalContributions.toLocaleString()} of ${personalInfo.name}'s GitHub contributions in the last year`}>
            <div className="contribution-calendar" role="img" aria-label={`${totalContributions.toLocaleString()} contributions in the last year`}>
              <div className="weekday-labels" aria-hidden="true"><span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /></div>
              <div className="calendar-scroll"><div className="contribution-grid">{weeks.map((week, weekIndex) => <div className="contribution-week" key={weekIndex}>{week.map((day, dayIndex) => <span key={day?.date ?? `blank-${weekIndex}-${dayIndex}`} className={`contribution-cell ${day ? `level-${Math.min(4, Math.max(0, Number(day.level) || 0))}` : 'is-empty'}`} title={day ? `${day.count} contributions on ${day.date}` : undefined} />)}</div>)}</div></div>
            </div>
          </a>
          <div className="contribution-foot"><span>{totalContributions.toLocaleString()} contributions · public GitHub data</span><span className="chart-legend"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></span></div>
          {contributionData.updatedAt && <p className="contribution-updated">Updated {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(contributionData.updatedAt)} · refreshes every 5 min</p>}
        </>}
      </div>
    </div>
  </section>;
}
