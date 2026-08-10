import { HomeExperience } from '@/components/sections/spine/HomeExperience'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { AchievementsList } from '@/components/sections/AchievementsList'
import { ContactCTA } from '@/components/sections/ContactCTA'

export default function Home() {
  return (
    <>
      <HomeExperience />
      <div className="divide-y divide-border">
        <SkillsGrid />
        <AchievementsList />
      </div>
      <ContactCTA />
    </>
  )
}
