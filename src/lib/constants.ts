// 'About', 'Experience' and 'Work' aren't standalone in-page sections —
// they're chapters inside the one continuous pinned machine sequence, only
// reachable by scrolling to a specific point within that pin (see
// useSpineNavigation + the SPINE_GOTO_EVENT bus in
// components/sections/spine/chapters.ts). 'gotoChapter' is where a click
// scrolls to; 'activeChapters' is which spine chapters count as "this nav
// item is current" — About covers both Intro and Education, since the
// Education chapter has no nav item of its own.
export type NavLink =
  | { label: string; kind: 'chapter'; gotoChapter: number; activeChapters: number[] }
  | { label: string; kind: 'anchor'; id: string }

export const NAV_LINKS: NavLink[] = [
  { label: 'About', kind: 'chapter', gotoChapter: 0, activeChapters: [0, 1] },
  { label: 'Experience', kind: 'chapter', gotoChapter: 2, activeChapters: [2] },
  { label: 'Skills', kind: 'anchor', id: 'skills' },
  { label: 'Work', kind: 'chapter', gotoChapter: 3, activeChapters: [3] },
  { label: 'Achievements', kind: 'anchor', id: 'achievements' },
  { label: 'Contact', kind: 'anchor', id: 'contact' },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/Arnav020',
  linkedin: 'https://linkedin.com/in/arnav-joshi-038693291',
  email: 'arnavjoshi020@gmail.com',
}

export const RESUME_LINKS = {
  ml: '/resume-ml.pdf',
  sde: '/resume-sde.pdf',
}
