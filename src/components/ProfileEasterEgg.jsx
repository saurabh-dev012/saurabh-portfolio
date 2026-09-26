import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/content';

export default function ProfileEasterEgg() {
  const [phase, setPhase] = useState('idle');
  const [playVideo, setPlayVideo] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(timer => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const startBuilderMode = () => {
    if (phase !== 'idle') return;
    clearTimers();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlayVideo(false);
      setPhase('art');
      return;
    }
    setPhase('transition');
    timers.current.push(window.setTimeout(() => {
      setPlayVideo(true);
      setPhase('art');
    }, 300));
  };

  const stopBuilderMode = () => {
    clearTimers();
    setPlayVideo(false);
    setPhase('idle');
  };

  const handlePointerEnter = event => {
    if (event.pointerType === 'mouse') startBuilderMode();
  };

  const handlePointerLeave = event => {
    if (event.pointerType === 'mouse') stopBuilderMode();
  };

  const handleClick = event => {
    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (event.detail === 0 || !hoverPointer) {
      if (phase === 'idle') startBuilderMode();
      else stopBuilderMode();
    }
  };

  const isActive = phase !== 'idle';

  return <button
    className={`profile-easter-egg ${isActive ? `is-${phase}` : ''}`}
    type="button"
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onClick={handleClick}
    aria-label={isActive ? 'Gojo artwork Easter egg active; activate to close' : 'Reveal the Gojo artwork Easter egg'}
    aria-pressed={isActive}
    aria-busy={isActive}
  >
    <img
      className="hero-avatar"
      src={`https://github.com/${personalInfo.githubUsername}.png`}
      alt=""
      onError={event => { event.currentTarget.hidden = true; }}
    />
    <span className="profile-egg-ring" aria-hidden="true" />
    <span className="profile-egg-display" aria-hidden="true">
      {phase === 'art' && (playVideo
        ? <video className="profile-egg-art" autoPlay loop muted playsInline preload="auto" poster={`${import.meta.env.BASE_URL}images/gojo-easter-egg.jpg`}>
          <source src={`${import.meta.env.BASE_URL}media/profile-easter-egg.mp4`} type="video/mp4" />
        </video>
        : <img className="profile-egg-art" src={`${import.meta.env.BASE_URL}images/gojo-easter-egg.jpg`} alt="" />)}
    </span>
  </button>;
}
