import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/content';

const commands = [
  { command: '$ hello', output: `Hi, I'm ${personalInfo.name}.` },
  { command: '$ whoami', output: personalInfo.role },
  { command: '$ skills --active', output: 'React \u00b7 JavaScript \u00b7 Node' },
  { command: '$ currently', output: 'Building something cool...' },
  { command: '$ status', output: 'ONLINE' },
];

const completeTerminal = commands.map(({ command, output }) => ({ command, output }));

export default function AsciiTerminal() {
  const [lines, setLines] = useState(commands.map(() => ({ command: '', output: '' })));
  const [activeLine, setActiveLine] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [visible, setVisible] = useState(false);
  const terminalRef = useRef(null);
  const startedRef = useRef(false);
  const timersRef = useRef([]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return undefined;

    const showFinal = () => {
      setLines(completeTerminal);
      setActiveLine(-1);
      setBooted(true);
      setVisible(true);
    };
    const beginBoot = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setVisible(true);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        showFinal();
        return;
      }

      let lineIndex = 0;
      let characterIndex = 0;
      const schedule = (callback, delay) => {
        timersRef.current.push(window.setTimeout(callback, delay));
      };
      const typeNext = () => {
        if (lineIndex >= commands.length) {
          setActiveLine(-1);
          setBooted(true);
          return;
        }
        setActiveLine(lineIndex);
        const { command, output } = commands[lineIndex];
        if (characterIndex < command.length) {
          characterIndex += 1;
          const currentLine = lineIndex;
          setLines(previous => previous.map((line, index) => index === currentLine
            ? { ...line, command: command.slice(0, characterIndex) }
            : line));
          schedule(typeNext, 42 + ((characterIndex * 11) % 21));
          return;
        }

        const currentLine = lineIndex;
        setLines(previous => previous.map((line, index) => index === currentLine ? { ...line, output } : line));
        setActiveLine(-1);
        lineIndex += 1;
        characterIndex = 0;
        schedule(typeNext, lineIndex === commands.length ? 260 : 220);
      };
      typeNext();
    };

    if (!('IntersectionObserver' in window)) {
      beginBoot();
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        beginBoot();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(terminal);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(timer => window.clearTimeout(timer));
    };
  }, []);

  const trackPointer = event => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  return <div className={`ascii-terminal-shell ${visible ? 'is-visible' : ''}`}>
    <section className={`ascii-terminal ${activeLine >= 0 ? 'is-typing' : ''}`} ref={terminalRef} onPointerMove={trackPointer} aria-label="Developer terminal">
      <div className="mac-terminal-bar" aria-hidden="true">
        <div className="mac-terminal-controls"><i /><i /><i /></div>
        <span className="mac-terminal-title">saurabh@portfolio</span>
        <span className="mac-terminal-spacer" />
      </div>
      <div className="ascii-terminal-body">
        <div className="ascii-terminal-top">&#9484;&#9472; saurabh@portfolio ~</div>
        <div className="ascii-terminal-blank"><span>&#9474;</span></div>
        {commands.map(({ output }, index) => <div className={`ascii-terminal-block ${activeLine === index ? 'is-active' : ''}`} key={index}>
          <div className="ascii-terminal-row"><span className="ascii-gutter">&#9474;</span><span className="ascii-command"><span className="ascii-prompt-symbol">$</span>{lines[index].command.startsWith('$ ') ? lines[index].command.slice(1) : lines[index].command}{activeLine === index && <i className="ascii-type-cursor" />}</span></div>
          <div className={`ascii-terminal-row ascii-output-row ${lines[index].output ? 'is-revealed' : ''}`}>
            <span className="ascii-gutter">&#9474;</span>
            {lines[index].output && <span className={`ascii-output output-${index}`}>&gt; {index === 3
              ? <a className="ascii-building-link" href="#projects"><span className="ascii-building-text">{output}</span><span className="ascii-building-arrow" aria-hidden="true">&#8599;</span></a>
              : index === 4 ? <><i className="ascii-online-dot" /><span className="ascii-online-label">ONLINE</span></> : output}</span>}
          </div>
          {index < commands.length - 1 && <div className="ascii-terminal-blank"><span>&#9474;</span></div>}
        </div>)}
        <div className="ascii-terminal-bottom">&#9492;&#9472; <i className={`ascii-final-cursor ${booted ? 'is-ready' : ''}`}>&#9608;</i></div>
      </div>
    </section>
  </div>;
}
