import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import BlogSection from './sections/BlogSection';
import Skills from './sections/Skills';
import LeetCodeSection from './sections/LeetCodeSection';
import Activity from './sections/Activity';
import GitHub from './sections/GitHub';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return <><Header /><main><Hero /><About /><Projects /><Skills /><LeetCodeSection /><Activity /><GitHub /><BlogSection /><Contact /></main><Footer /></>;
}
