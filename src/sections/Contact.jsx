import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/content';
import SocialLinks from '../components/SocialLinks';

function FieldIcon({ type }) {
  if (type === 'name') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>;
  if (type === 'email') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.3a8.5 8.5 0 1 1 16.1-5.2Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>;
}

export default function Contact() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (!('IntersectionObserver' in window)) {
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

  const sendMessage = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name').trim();
    const email = form.get('email').trim();
    const message = form.get('message').trim();
    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\nFrom: ${name} <${email}>`;
    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <section ref={sectionRef} className={`section contact-ending ${isVisible ? 'is-visible' : ''}`} id="contact" aria-labelledby="contact-title">
    <div className="contact-ending-inner">
      <h2 className="contact-main-title" id="contact-title">Let&rsquo;s connect.</h2>
      <div className="contact-message-block">
        <h3>Send a message.</h3>
        <p>Have a project or idea in mind? I&rsquo;d love to hear about it.</p>
        <form className="contact-message-form" onSubmit={sendMessage}>
          <label className="contact-field">
            <FieldIcon type="name" />
            <span className="sr-only">Your name</span>
            <input type="text" name="name" placeholder="Your name" autoComplete="name" required />
          </label>
          <label className="contact-field">
            <FieldIcon type="email" />
            <span className="sr-only">Your email address</span>
            <input type="email" name="email" placeholder="your.email@example.com" autoComplete="email" required />
          </label>
          <label className="contact-field contact-message-field">
            <FieldIcon type="message" />
            <span className="sr-only">What would you like to discuss?</span>
            <textarea name="message" placeholder="What would you like to discuss?" required />
          </label>
          <button className="contact-send-button" type="submit"><span>Send Message</span><span aria-hidden="true">&#8594;</span></button>
        </form>
      </div>
      <div className="contact-follow-block">
        <h3>Follow &amp; connect.</h3>
        <p>Find me around the web.</p>
        <SocialLinks iconOnly order={['GitHub', 'LinkedIn', 'X', 'Instagram', 'LeetCode']} />
      </div>
    </div>
  </section>;
}
