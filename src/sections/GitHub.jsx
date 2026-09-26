import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { personalInfo } from '../data/content';
import { ArrowIcon, ExternalLink } from '../components/ExternalLink';

export default function GitHub() {
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);
  const [chartFailed, setChartFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${personalInfo.githubUsername}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Profile unavailable'); return response.json(); })
      .then(setProfile).catch(error => { if (error.name !== 'AbortError') setFailed(true); });
    return () => controller.abort();
  }, []);

  return <section className="section page-shell" id="github" aria-labelledby="github-title"><SectionHeading eyebrow="Open source & practice" title="GitHub" id="github-title" />
    <div className="github-card">
      <div className="github-profile">{profile?.avatar_url ? <img className="avatar" src={profile.avatar_url} alt={`${profile.login} profile avatar`} /> : <div className="avatar avatar-placeholder" aria-hidden="true">SP</div>}
        <div className="profile-copy"><span className="profile-label">GITHUB PROFILE</span><h3>{profile?.name || personalInfo.name}</h3><p>{profile?.bio || (failed ? 'Visit my profile to see what I’m working on.' : `@${personalInfo.githubUsername}`)}</p></div>
        <ExternalLink className="profile-link" href={personalInfo.github}>View profile <ArrowIcon /></ExternalLink>
      </div>
      <div className="contribution-wrap"><div className="contribution-heading"><span>Contribution activity</span><span className="contribution-period">Past year</span></div>
        {chartFailed ? <p className="chart-fallback">Contribution chart unavailable. <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">View activity on GitHub</a></p> : <a className="contribution-chart" href={personalInfo.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${personalInfo.name}'s GitHub contribution activity`}><img src={`https://ghchart.rshah.org/2d6a55/${personalInfo.githubUsername}`} alt="GitHub contribution activity chart" loading="lazy" onError={() => setChartFailed(true)} /></a>}
        <div className="contribution-foot"><span>Activity provided by GitHub</span><span className="chart-legend">Less <i /><i /><i /><i /> More</span></div>
      </div>
    </div>
  </section>;
}
