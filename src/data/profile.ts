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
  upcoming?: boolean;
}

export const timeline: TimelineItem[] = [
  {
    when: '4 to 5 Dec 2026',
    title: 'Hack Apertus Basel',
    org: 'One of 150 selected builders',
    upcoming: true,
  },
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
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Agentic AI and LLMs',
    items: ['LangGraph', 'MCP servers', 'LangSmith', 'Claude API (tool use)', 'AWS Bedrock AgentCore', 'LiteLLM', 'Guardrails', 'Apertus'],
  },
  {
    group: 'Machine learning and data',
    items: ['Python', 'pandas', 'Polars', 'SQL and MySQL', 'scikit-learn', 'NetworkX', 'Gymnasium', 'Azure ML', 'Data pipelines', 'Regression and classification'],
  },
  {
    group: 'Engineering and deployment',
    items: ['FastAPI', 'Docker', 'Google Cloud Run', 'CI/CD on render.com', 'Streamlit', 'pytest', 'Git and GitHub'],
  },
  {
    group: 'Content and communication',
    items: ['Social media strategy', 'Copywriting', 'Photo and video production'],
  },
  {
    group: 'Languages',
    items: ['German (native)', 'English B2 (Cambridge B2 First)', 'French B1 (DELF)'],
  },
  {
    group: 'Certificates',
    items: ['Claude Code 101 (Anthropic, 2026)', 'ICT Advanced-User SIZ (2023)'],
  },
];
