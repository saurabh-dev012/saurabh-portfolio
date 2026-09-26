import { useEffect, useState } from 'react';
import { personalInfo } from '../data/content';
import ServiceProfileLink from '../components/ServiceProfileLink';

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
  const languages = activity?.languages?.length ? activity.languages.join(', ') : 'No recent language data';
  const editors = activity?.editors?.length ? activity.editors.join(', ') : 'No recent editor data';

  return <section className="section page-shell" id="activity" aria-labelledby="activity-title">
    <div className="waka-panel" aria-live="polite">
      <div className="activity-header">
        <h2 id="activity-title">wakatime.</h2>
        <ServiceProfileLink service="wakatime" href={personalInfo.wakatime} username="WakaTime profile" />
      </div>
      <div className="waka-summary-lines">
        {available ? <>
          <p><strong>Coding Time:</strong> Today: {activity.today} · Yesterday: {activity.yesterday} · Week: {activity.week}</p>
          <p><strong>Recent Languages:</strong> {languages}</p>
          <p><strong>Current Editors:</strong> {editors}</p>
        </> : <p>{waiting ? 'Loading coding activity…' : 'Coding activity is unavailable right now.'}</p>}
      </div>
    </div>
  </section>;
}
