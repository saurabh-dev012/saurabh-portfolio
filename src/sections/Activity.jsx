import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

function ActivityList({ title, entries, available }) {
  return <div className="waka-list">
    <h3>{title}</h3>
    {available && entries.length ? <ul>{entries.map(({ name, time }) => <li key={name}><span>{name}</span><span>{time}</span></li>)}</ul> : <p>{available ? 'No recent activity' : '—'}</p>}
  </div>;
}

export default function Activity() {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const dataUrl = `${import.meta.env.BASE_URL}wakatime.json`;
    fetch(dataUrl, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Activity unavailable')))
      .then(setActivity)
      .catch(error => { if (error.name !== 'AbortError') setActivity({ available: false }); });
    return () => controller.abort();
  }, []);

  const available = activity?.available === true;
  const waiting = activity === null;

  return <section className="section page-shell" id="activity" aria-labelledby="activity-title">
    <SectionHeading title="WakaTime" id="activity-title" />
    <div className="waka-panel" aria-live="polite">
      {available ? <>
        <dl className="waka-totals">
          <div><dt>Today</dt><dd>{activity.today}</dd></div>
          <div><dt>Yesterday</dt><dd>{activity.yesterday}</dd></div>
          <div><dt>This week</dt><dd>{activity.week}</dd></div>
        </dl>
        <div className="waka-details">
          <ActivityList title="Current editors" entries={activity.editors ?? []} available />
          <ActivityList title="Recent languages" entries={activity.languages ?? []} available />
        </div>
        {activity.updatedAt && <p className="waka-updated">Updated {new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: activity.timezone }).format(new Date(activity.updatedAt))}</p>}
      </> : <div className="waka-fallback"><p>{waiting ? 'Loading coding activity…' : 'Coding activity is unavailable right now.'}</p></div>}
      <div className="waka-footer"><ExternalLink href={personalInfo.wakatime}>Open WakaTime profile <ArrowIcon /></ExternalLink></div>
    </div>
  </section>;
}
