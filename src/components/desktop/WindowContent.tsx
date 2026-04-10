'use client'

import dynamic from 'next/dynamic'

const AboutWindow    = dynamic(() => import('./windows/AboutWindow').then(m => m.AboutWindow))
const SkillsWindow   = dynamic(() => import('./windows/SkillsWindow').then(m => m.SkillsWindow))
const ProjectsWindow = dynamic(() => import('./windows/ProjectsWindow').then(m => m.ProjectsWindow))
const ExperienceWindow = dynamic(() => import('./windows/ExperienceWindow').then(m => m.ExperienceWindow))
const AchievementsWindow = dynamic(() => import('./windows/AchievementsWindow').then(m => m.AchievementsWindow))
const ContactWindow  = dynamic(() => import('./windows/ContactWindow').then(m => m.ContactWindow))

export function WindowContent({ id }: { id: string }) {
  const map: Record<string, React.ReactNode> = {
    about:        <AboutWindow />,
    skills:       <SkillsWindow />,
    projects:     <ProjectsWindow />,
    experience:   <ExperienceWindow />,
    achievements: <AchievementsWindow />,
    contact:      <ContactWindow />,
  }
  return (
    <div className="h-full w-full p-5 text-white/85">
      {map[id] ?? <div className="text-white/40 text-sm p-4">Unknown window</div>}
    </div>
  )
}
