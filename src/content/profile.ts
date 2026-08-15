/**
 * Single source of truth for identity, links, and the numbers shown in the
 * home stat row. Everything user-facing that isn't a project/skill/role lives
 * here so there's exactly one place to edit a handle or a resume path.
 */

export const profile = {
  firstName: 'Arnav',
  lastName: 'Joshi',
  handle: 'arnav020',
  repoName: 'arnav020 : portfolio',
  shellUser: 'arnav',
  title: 'AI/ML Engineer & Full Stack Developer',
  location: 'India',
  /** Role pills on the home hero. `current` renders as the employer badge. */
  roles: [
    { label: 'AI / ML Engineer', tone: 'accent' as const },
    { label: 'Backend & Systems', tone: 'green' as const },
    { label: 'Full Stack Dev', tone: 'blue' as const },
    { label: '@ Samsung R&D', tone: 'pink' as const, current: true },
  ],
  tagline:
    'Building intelligent systems through research-driven ML and production software.',
  /** Cycled by the home hero's typewriter, in order. */
  taglines: [
    'Building intelligent systems 🛠️',
    'Agentic LLM pipelines that stay calibrated 🤖',
    'Physics-informed ML, from real instrument data 🛰️',
    'Go backends that survive their own chaos 💥',
    'Always shipping, always measuring ✨',
  ],
  intro:
    'I work where **research-grade ML** meets **shipped software** — agentic LLM pipelines, **physics-informed models**, and the **backend infrastructure** that keeps them standing up under real load.',
  /** `**term**` spans render in the theme blue — see <Emphasis>. */
  bio: "Hi! I'm **Arnav Joshi**, a Computer Science undergrad at **Thapar Institute**, currently a **Research Intern on Cloud AI/ML at Samsung R&D Bengaluru**. I care about the part of ML that isn't the model: the **ingestion that validates its input**, the **calibration layer** that refuses to trust a weak signal, the **failover chain** that keeps a pipeline alive when a provider goes down, and the **observability** that proves any of it works.",
} as const

export const links = {
  github: 'https://github.com/Arnav020',
  linkedin: 'https://linkedin.com/in/arnav-joshi-038693291',
  email: 'arnavjoshi020@gmail.com',
} as const

export const resumes = [
  {
    id: 'resume-sde',
    label: 'Arnav_Joshi_Resume_SDE.pdf',
    href: '/Arnav_Joshi_Resume_SDE.pdf',
    /** The one-click "Download Resume" target across the activity bar, File menu and settings. */
    default: true,
  },
  {
    id: 'resume-ml',
    label: 'Arnav_Joshi_Resume_ML.pdf',
    href: '/Arnav_Joshi_Resume_ML.pdf',
    default: false,
  },
] as const

export const defaultResume = resumes.find((r) => r.default) ?? resumes[0]

export const stats = [
  { value: '9.57', label: 'CGPA', suffix: '/ 10' },
  { value: '19', label: 'Projects Shipped', suffix: '+' },
  { value: '3', label: 'Merit Scholarships', suffix: '×' },
  { value: '96.7', label: 'Class 12', suffix: '%' },
]

/** Two-column "CURRENT FOCUS" list in about.html. */
export const currentFocus = [
  { emoji: '🛰️', text: 'RAG + agentic ops tooling for Kubernetes at Samsung R&D' },
  { emoji: '🧪', text: 'Physics-informed ML — PINNs, signal processing, PIV fusion' },
  { emoji: '⚙️', text: 'Go backends, worker pools, and observability under failure' },
  { emoji: '🧠', text: 'Multi-agent LLM pipelines that stay calibrated under weak evidence' },
  { emoji: '📦', text: 'MLOps: MLflow, DVC, containerised deploys that actually ship' },
  { emoji: '📚', text: 'Talk to me about Python, Go, distributed systems, or space weather' },
]
