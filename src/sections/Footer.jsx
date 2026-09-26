import { personalInfo } from '../data/content';

export default function Footer() {
  return <footer className="footer page-shell"><a className="footer-brand" href="#home">{personalInfo.name}<span>.</span><small>{personalInfo.role}</small></a><span className="copyright">© {new Date().getFullYear()} {personalInfo.name}</span></footer>;
}
