import type { SkillGroup } from '../lib/skills';

// Alle Profilangaben stammen aus dem Briefing (Spec Abschnitt 6). Nichts ergänzen, was dort nicht steht.

export const name = 'Tim Rusch';
export const headline = 'Business AI Student | Agentic AI, ML & Data';
export const intro =
  'I study Business Artificial Intelligence at FHNW and build agentic AI systems and machine learning pipelines. I am looking for a working student position or internship in data or AI from January 2027.';
export const location = 'Based in the Basel area.';

export const links = {
  github: 'https://github.com/tim931451',
  linkedin: 'https://www.linkedin.com/in/tim-rusch',
  email: 'tim.rusch@bluewin.ch',
  cv: '/cv.pdf',
} as const;

export interface TimelineItem {
  when: string;
  title: string;
  org: string;
  text?: string;
  href?: string;
  upcoming?: boolean;
}

export interface TimelineGroup {
  title: string;
  items: TimelineItem[];
}

export const timeline: TimelineGroup[] = [
  {
    title: 'Hackathons',
    items: [
      {
        when: '4 to 5 Dec 2026',
        title: 'Hack Apertus Basel',
        org: 'One of 150 selected builders',
        upcoming: true,
      },
      {
        when: '24 to 25 Oct 2026',
        title: 'FHNW MAKEathon',
        org: 'Team of 5, built Pythia',
        href: '/projects/pythia/',
      },
    ],
  },
  {
    title: 'Education and work',
    items: [
      {
        when: '09/2024 to 2028',
        title: 'BSc Business Artificial Intelligence',
        org: 'FHNW School of Business',
        text: 'Focus on agentic AI, machine learning and data engineering. Graduation expected in 2028.',
      },
      {
        when: 'Since 2023',
        title: 'Social media manager',
        org: 'Freelance, part-time, for Swiss SMEs',
        text: "Strategy, copy, photo and video for five brands: SLIDE and Furrer Metallbau, ANDREANI and KIVA, Oli's Modellbahndepot. Automation with Python, for example scheduling YouTube Shorts via the YouTube Data API.",
      },
      {
        when: '2023 to 2024',
        title: 'Intern Front Desk and Events',
        org: 'Basel Area Business & Innovation',
      },
      {
        when: '2020 to 2024',
        title: 'Federal Vocational Baccalaureate and EFZ',
        org: 'Wirtschaftsmittelschule Reinach BL',
      },
    ],
  },
];

// Skills erscheinen nur, wenn sie `general` sind (belegt durch Ausbildung oder Lebenslauf) oder ein
// sichtbares Projekt sie im eigenen Stack führt (Projekt-`stack` ohne `teamStack`), siehe src/lib/skills.ts.
// Entwürfe zählen nicht: Google Cloud Run und «Regression and classification» erscheinen automatisch,
// sobald Restaurant bzw. Ad campaign veröffentlicht sind.
// TODO(Tim): Streamlit erscheint erst wieder, wenn ein sichtbares Projekt es als eigenen Stack führt
// (bei Pythia war es Teamarbeit). Falls das Restaurant-Dashboard Streamlit nutzt, dort in `stack` ergänzen.
export const skills: SkillGroup[] = [
  {
    group: 'Agentic AI and LLMs',
    items: [
      { name: 'LangGraph' },
      { name: 'MCP servers', match: ['MCP'] },
      { name: 'LangSmith' },
      { name: 'Claude API (tool use)', match: ['Claude API'] },
      { name: 'AWS Bedrock AgentCore' },
      { name: 'LiteLLM' },
      { name: 'Guardrails' },
      { name: 'Apertus' },
    ],
  },
  {
    group: 'Machine learning and data',
    items: [
      { name: 'Python', general: true },
      { name: 'pandas', general: true },
      { name: 'Polars' },
      { name: 'SQL and MySQL', general: true },
      { name: 'scikit-learn' },
      { name: 'NetworkX' },
      { name: 'Gymnasium (RL environments)' },
      { name: 'Azure ML' },
      { name: 'Data pipelines', general: true },
      { name: 'Regression and classification', match: ['Regression', 'Logistic regression'] },
    ],
  },
  {
    group: 'Engineering and deployment',
    items: [
      { name: 'FastAPI' },
      { name: 'Docker', general: true },
      { name: 'Google Cloud Run' },
      { name: 'CI/CD on render.com', match: ['render.com'] },
      { name: 'Streamlit' },
      { name: 'pytest' },
      { name: 'Git and GitHub', general: true },
    ],
  },
  {
    group: 'Content and communication',
    items: [
      { name: 'Social media strategy', general: true },
      { name: 'Copywriting', general: true },
      { name: 'Photo and video production', general: true },
    ],
  },
  {
    group: 'Languages',
    items: [
      { name: 'German (native)', general: true },
      { name: 'English B2 (Cambridge B2 First)', general: true },
      { name: 'French B1 (DELF)', general: true },
    ],
  },
  {
    group: 'Certificates',
    items: [
      { name: 'Claude Code 101 (Anthropic, 2026)', general: true },
      { name: 'ICT Advanced-User SIZ (2023)', general: true },
    ],
  },
];
